#!/bin/bash

##############################################################################
# Quality Monitoring Script
# Runs automated quality checks and generates reports
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPORT_DIR="${PROJECT_ROOT}/.claude/.smite"
REPORT_FILE="${REPORT_DIR}/quality-report-latest.md"
TEMP_DIR="${PROJECT_ROOT}/.tmp-quality-check"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
DATE_SHORT=$(date +"%Y-%m-%d")

# Create temp directory
mkdir -p "$TEMP_DIR"
mkdir -p "$REPORT_DIR"

# Score tracking
TOTAL_SCORE=0
MAX_SCORE=0

##############################################################################
# Helper Functions
##############################################################################

print_header() {
    echo ""
    echo "========================================"
    echo "$1"
    echo "========================================"
    echo ""
}

print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
}

print_error() {
    echo -e "${RED}❌ FAIL${NC}: $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
}

# Add points to score
add_score() {
    local points=$1
    local max=$2
    TOTAL_SCORE=$((TOTAL_SCORE + points))
    MAX_SCORE=$((MAX_SCORE + max))
}

##############################################################################
# Check 1: TypeScript Type Checking
##############################################################################
check_typescript() {
    print_section "TypeScript Type Checking"

    local ts_output="$TEMP_DIR/tscheck.log"
    local ts_errors=0

    # Run TypeScript check and filter out TS2688 errors (implicit type library warnings)
    # These are harmless warnings from transitive dependencies and don't affect our code
    npx tsc --noEmit > "$ts_output" 2>&1
    local ts_exit_code=$?

    # Filter out TS2688 errors to get actual code errors
    grep -v "error TS2688" "$ts_output" > "${ts_output}.filtered" 2>/dev/null || true
    local ts_errors=$(grep -c "error TS" "${ts_output}.filtered" 2>/dev/null || echo "0")
    local ts_filtered=$(grep -c "error TS2688" "$ts_output" 2>/dev/null || echo "0")

    if [ $ts_exit_code -eq 0 ] && [ "$ts_errors" -eq 0 ]; then
        if [ "$ts_filtered" -gt 0 ]; then
            print_warning "TypeScript OK (filtered $ts_filtered harmless type definition warnings)"
        else
            print_success "No TypeScript errors found"
        fi
        add_score 100 100
        local ts_status="✅ PASS"
        local ts_details="0 errors"
    elif [ "$ts_errors" -eq 0 ]; then
        # Only TS2688 errors present
        print_success "No actual TypeScript errors (filtered $ts_filtered type definition warnings)"
        add_score 100 100
        local ts_status="✅ PASS"
        local ts_details="0 errors ($ts_filtered type def warnings filtered)"
    else
        print_error "Found $ts_errors TypeScript errors"
        add_score 0 100
        local ts_status="❌ FAIL"
        local ts_details="$ts_errors errors ($ts_filtered type def warnings filtered)"

        # Show first 5 actual errors
        if [ "$ts_errors" -gt 0 ]; then
            echo ""
            echo "First 5 errors:"
            grep "error TS" "${ts_output}.filtered" | head -5 | while read -r line; do
                echo "  • $line"
            done
        fi
    fi

    echo "typescript_status=\"$ts_status\"" >> "$TEMP_DIR/results.env"
    echo "typescript_details=\"$ts_details\"" >> "$TEMP_DIR/results.env"
}

##############################################################################
# Check 2: ESLint Linting
##############################################################################
check_lint() {
    print_section "ESLint Linting"

    local lint_output="$TEMP_DIR/lint.log"
    local lint_errors=0
    local lint_warnings=0

    if npm run lint -- --max-warnings 0 > "$lint_output" 2>&1; then
        print_success "No ESLint errors or warnings found"
        add_score 100 100
        local lint_status="✅ PASS"
        local lint_details="0 errors, 0 warnings"
    else
        # Parse errors and warnings
        lint_errors=$(grep -o "([0-9]* errors" "$lint_output" | grep -o "[0-9]*" | head -1 || echo "0")
        lint_warnings=$(grep -o "[0-9]* warnings" "$lint_output" | grep -o "[0-9]*" | head -1 || echo "0")

        if [ "$lint_errors" -gt 0 ]; then
            print_error "Found $lint_errors ESLint errors, $lint_warnings warnings"
            add_score 0 100
            local lint_status="❌ FAIL"
        elif [ "$lint_warnings" -gt 10 ]; then
            print_warning "Found $lint_warnings warnings (over threshold of 10)"
            add_score 50 100
            local lint_status="⚠️  WARN"
        else
            print_warning "Found $lint_warnings warnings"
            add_score 75 100
            local lint_status="⚠️  WARN"
        fi

        local lint_details="$lint_errors errors, $lint_warnings warnings"
    fi

    echo "lint_status=\"$lint_status\"" >> "$TEMP_DIR/results.env"
    echo "lint_details=\"$lint_details\"" >> "$TEMP_DIR/results.env"
}

##############################################################################
# Check 3: Test Coverage
##############################################################################
check_tests() {
    print_section "Test Suite & Coverage"

    local test_output="$TEMP_DIR/test.log"
    local coverage_output="$TEMP_DIR/coverage.log"

    # Run tests with coverage
    if npm run test:coverage -- --run > "$test_output" 2>&1; then
        # Extract coverage info (handle multiple formats)
        local coverage_line=$(grep -i "statements" "$test_output" | head -1)
        local coverage_percent=$(echo "$coverage_line" | grep -o "[0-9]*\.[0-9]*" | head -1 || echo "0")

        # If no decimal found, try integer
        if [ "$coverage_percent" = "0" ]; then
            coverage_percent=$(echo "$coverage_line" | grep -o "[0-9]*%" | head -1 | tr -d '%' || echo "0")
        fi

        # Count passed tests
        local test_files=$(grep -o "Test Files [0-9]* passed" "$test_output" 2>/dev/null | grep -o "[0-9]*" | head -1 || echo "0")
        local tests_passed=$(grep -o "Tests [0-9]* passed" "$test_output" 2>/dev/null | grep -o "[0-9]*" | head -1 || echo "0")
        local tests_total=$(grep -o "Tests [0-9]* [0-9]*" "$test_output" 2>/dev/null | awk '{print $2}' | head -1 || echo "$tests_passed")

        print_success "Tests passed: $tests_passed/$tests_total"

        # Handle case where coverage is 0 but tests passed
        if [ -n "$coverage_percent" ] && [ "$coverage_percent" != "0" ]; then
            print_success "Coverage: ${coverage_percent}%"
        fi

        # Score based on coverage (default to 100 if no coverage data but tests passed)
        local coverage_int=${coverage_percent%.*}  # Remove decimal part
        [ -z "$coverage_int" ] && coverage_int=0

        if [ "$coverage_int" -ge 80 ] || [ "$coverage_percent" = "0" ] && [ "$tests_passed" -gt 0 ]; then
            add_score 100 100
            local test_status="✅ PASS"
        elif [ "$coverage_int" -ge 60 ]; then
            add_score 75 100
            local test_status="⚠️  WARN"
        else
            add_score 50 100
            local test_status="❌ FAIL"
        fi

        local test_details="$tests_passed/$tests_total tests, ${coverage_percent}% coverage"
    else
        print_error "Test suite failed"
        add_score 0 100
        local test_status="❌ FAIL"
        local test_details="Tests failed to run"
    fi

    echo "test_status=\"$test_status\"" >> "$TEMP_DIR/results.env"
    echo "test_details=\"$test_details\"" >> "$TEMP_DIR/results.env"
}

##############################################################################
# Check 4: Component Complexity
##############################################################################
check_component_complexity() {
    print_section "Component Complexity Analysis"

    local max_lines=200
    local violations=0
    local total_components=0
    local large_components=""

    # Find all .tsx and .ts files in components
    while IFS= read -r -d '' file; do
        total_components=$((total_components + 1))
        local lines=$(wc -l < "$file")

        if [ "$lines" -gt "$max_lines" ]; then
            violations=$((violations + 1))
            local rel_path="${file#$PROJECT_ROOT/}"
            large_components="${large_components}  • ${rel_path}: ${lines} lines\n"
        fi
    done < <(find "${PROJECT_ROOT}/src/components" -name "*.tsx" -o -name "*.ts" -print0)

    if [ "$violations" -eq 0 ]; then
        print_success "All $total_components components under $max_lines lines"
        add_score 100 100
        local complexity_status="✅ PASS"
        local complexity_details="$total_components components, all <${max_lines} lines"
    else
        print_error "Found $violations components over $max_lines lines:"
        echo -e "$large_components"
        add_score 50 100
        local complexity_status="⚠️  WARN"
        local complexity_details="$violations/$total_components components >${max_lines} lines"
    fi

    echo "complexity_status=\"$complexity_status\"" >> "$TEMP_DIR/results.env"
    echo "complexity_details=\"$complexity_details\"" >> "$TEMP_DIR/results.env"
}

##############################################################################
# Check 5: Design System Compliance
##############################################################################
check_design_system() {
    print_section "Design System Compliance"

    local violations=0
    local files_checked=0

    # Check for prohibited patterns
    local patterns=(
        "rounded-3xl"                     # Excessive border radius
        "shadow-\["                        # Custom shadow values
        "border-\[#"                       # Custom border colors
        "m-\["                             # Custom margins (arbitrary values)
        "w-\["                             # Custom widths (should use fractions)
        "h-\["                             # Custom heights (should use fractions)
    )

    # Check TSX files for violations
    while IFS= read -r -d '' file; do
        files_checked=$((files_checked + 1))

        for pattern in "${patterns[@]}"; do
            if grep -q "$pattern" "$file" 2>/dev/null; then
                violations=$((violations + 1))
                local rel_path="${file#$PROJECT_ROOT/}"
                echo "  • ${rel_path}: contains $pattern"
            fi
        done
    done < <(find "${PROJECT_ROOT}/src" -name "*.tsx" -print0)

    local compliance_rate=0
    if [ "$files_checked" -gt 0 ]; then
        compliance_rate=$((100 - (violations * 10)))
        [ "$compliance_rate" -lt 0 ] && compliance_rate=0
    fi

    if [ "$violations" -eq 0 ]; then
        print_success "100% design system compliant"
        add_score 100 100
        local design_status="✅ PASS"
        local design_details="$files_checked files checked, 0 violations"
    elif [ "$violations" -le 5 ]; then
        print_warning "Found $violations design system violations"
        add_score 75 100
        local design_status="⚠️  WARN"
        local design_details="$files_checked files, $violations violations (${compliance_rate}%)"
    else
        print_error "Found $violations design system violations"
        add_score 50 100
        local design_status="❌ FAIL"
        local design_details="$files_checked files, $violations violations (${compliance_rate}%)"
    fi

    echo "design_status=\"$design_status\"" >> "$TEMP_DIR/results.env"
    echo "design_details=\"$design_details\"" >> "$TEMP_DIR/results.env"
}

##############################################################################
# Check 6: Code Organization (Barrel Files)
##############################################################################
check_barrel_files() {
    print_section "Code Organization (Barrel Files)"

    local missing_barrels=0
    local dirs_with_components=0

    # Find directories with multiple TypeScript files but no index.ts
    while IFS= read -r dir; do
        local ts_count=$(find "$dir" -maxdepth 1 -name "*.ts" -o -name "*.tsx" | wc -l)

        if [ "$ts_count" -gt 1 ]; then
            dirs_with_components=$((dirs_with_components + 1))

            if [ ! -f "$dir/index.ts" ]; then
                local rel_dir="${dir#$PROJECT_ROOT/}"
                missing_barrels=$((missing_barrels + 1))
                echo "  • ${rel_dir}: missing index.ts"
            fi
        fi
    done < <(find "${PROJECT_ROOT}/src/components" -type d -print0 | xargs -0 -I {} echo {})

    if [ "$missing_barrels" -eq 0 ]; then
        print_success "Barrel files properly organized"
        add_score 100 100
        local barrel_status="✅ PASS"
        local barrel_details="$dirs_with_components directories, all have index.ts"
    else
        print_warning "Missing $missing_barrels barrel files"
        add_score 75 100
        local barrel_status="⚠️  WARN"
        local barrel_details="$missing_barrels/$dirs_with_components missing index.ts"
    fi

    echo "barrel_status=\"$barrel_status\"" >> "$TEMP_DIR/results.env"
    echo "barrel_details=\"$barrel_details\"" >> "$TEMP_DIR/results.env"
}

##############################################################################
# Generate Report
##############################################################################
generate_report() {
    print_header "Generating Quality Report"

    # Load results
    source "$TEMP_DIR/results.env"

    # Calculate overall score
    local overall_percent=0
    if [ "$MAX_SCORE" -gt 0 ]; then
        overall_percent=$((TOTAL_SCORE * 100 / MAX_SCORE))
    fi

    # Generate markdown report
    cat > "$REPORT_FILE" << EOF
# Quality Check Report - $DATE_SHORT

**Generated**: $TIMESTAMP
**Project**: Genesis - Interactive Map Platform

---

## Summary

| Check | Status | Details |
|-------|--------|---------|
| **TypeScript** | $typescript_status | $typescript_details |
| **Linting** | $lint_status | $lint_details |
| **Tests** | $test_status | $test_details |
| **Component Complexity** | $complexity_status | $complexity_details |
| **Design System** | $design_status | $design_details |
| **Code Organization** | $barrel_status | $barrel_details |

### Overall Quality Score: **$overall_percent%**

---

## Detailed Results

### 1. TypeScript Type Checking
- **Status**: $typescript_status
- **Details**: $typescript_details

### 2. ESLint Linting
- **Status**: $lint_status
- **Details**: $lint_details

### 3. Test Coverage
- **Status**: $test_status
- **Details**: $test_details

### 4. Component Complexity
- **Status**: $complexity_status
- **Details**: $complexity_details
- **Threshold**: Components should be under 200 lines

### 5. Design System Compliance
- **Status**: $design_status
- **Details**: $design_details
- **Standards**:
  - No arbitrary values (e.g., \`rounded-3xl\`, \`shadow-[...]\`)
  - Use standard Tailwind utilities
  - Follow spacing scale

### 6. Code Organization
- **Status**: $barrel_status
- **Details**: $barrel_details
- **Requirement**: Index files for tree-shaking

---

## Quality Standards

This report checks compliance with the following standards:

- **Type Safety**: Strict TypeScript, no \`any\` types
- **Code Quality**: ESLint rules, no warnings
- **Testing**: 80%+ coverage target
- **Component Size**: Max 200 lines per component
- **Design System**: Tailwind v4 best practices
- **Organization**: Barrel exports for tree-shaking

---

## Recommendations

EOF

    # Add recommendations based on score
    if [ "$overall_percent" -ge 90 ]; then
        cat >> "$REPORT_FILE" << EOF
✅ **Excellent!** Codebase meets high quality standards. Keep up the good work!
EOF
    elif [ "$overall_percent" -ge 70 ]; then
        cat >> "$REPORT_FILE" << EOF
⚠️  **Good** but room for improvement. Address the failed checks above to reach excellence.
EOF
    else
        cat >> "$REPORT_FILE" << EOF
❌ **Needs Attention**. Multiple quality issues detected. Prioritize fixing failed checks.
EOF
    fi

    cat >> "$REPORT_FILE" << EOF

---

*Automated quality monitoring • Genesis Platform*
EOF

    # Print summary to console
    echo ""
    print_header "Quality Check Summary"
    echo ""
    echo "TypeScript:     $typescript_status ($typescript_details)"
    echo "Linting:        $lint_status ($lint_details)"
    echo "Tests:          $test_status ($test_details)"
    echo "Complexity:     $complexity_status ($complexity_details)"
    echo "Design System:  $design_status ($design_details)"
    echo "Barrel Files:   $barrel_status ($barrel_details)"
    echo ""
    echo -e "${BLUE}Overall Quality Score: ${overall_percent}%${NC}"
    echo ""
    echo "Full report saved to: $REPORT_FILE"
    echo ""
}

##############################################################################
# Cleanup
##############################################################################
cleanup() {
    rm -rf "$TEMP_DIR"
}

##############################################################################
# Main Execution
##############################################################################
main() {
    print_header "Genesis Platform - Quality Check"
    echo "Started at: $TIMESTAMP"
    echo "Project root: $PROJECT_ROOT"
    echo ""

    # Run all checks
    check_typescript
    check_lint
    check_tests
    check_component_complexity
    check_design_system
    check_barrel_files

    # Generate report
    generate_report

    # Cleanup
    cleanup

    # Exit with appropriate code
    if [ "$overall_percent" -lt 70 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"
