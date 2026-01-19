# Quality Check Quick Guide

## Running the Quality Check

### Manual Execution

```bash
# Option 1: Using npm (recommended)
npm run quality-check

# Option 2: Direct bash execution (Linux/Mac/WSL)
bash scripts/quality-check.sh

# Option 3: Windows batch file
scripts\quality-check.bat
```

## Understanding the Report

The quality check evaluates 6 key areas:

### 1. TypeScript Type Checking
- **What**: Validates type safety
- **Target**: 0 errors
- **Impact**: High - Type errors can cause runtime issues

### 2. ESLint Linting
- **What**: Code quality and style
- **Target**: 0 errors, 0 warnings
- **Impact**: Medium - Warnings may indicate maintainability issues

### 3. Test Coverage
- **What**: Test suite execution with coverage
- **Target**: 80%+ coverage
- **Impact**: High - Low coverage means untested code

### 4. Component Complexity
- **What**: Checks component line counts
- **Target**: All components < 200 lines
- **Impact**: Medium - Large components are harder to maintain

### 5. Design System Compliance
- **What**: Checks for prohibited Tailwind patterns
- **Target**: 100% compliant
- **Impact**: Medium - Ensures consistent UI

### 6. Code Organization
- **What**: Verifies barrel files (index.ts)
- **Target**: All directories have index.ts
- **Impact**: Low - Affects tree-shaking optimization

## Quality Score Calculation

Each check is scored out of 100 points:

- **100%**: Perfect (no issues)
- **75-99%**: Good (minor issues)
- **50-74%**: Fair (moderate issues)
- **0-49%**: Poor (significant issues)

**Overall Score**: Weighted average of all checks

## Taking Action

### If Score < 70% (Critical)

Priority actions:
1. Fix TypeScript errors first (blocking)
2. Fix ESLint errors (code quality)
3. Address failing tests (broken functionality)

### If Score 70-89% (Good)

Improvement actions:
1. Reduce warnings to zero
2. Break down large components
3. Fix design system violations
4. Add missing barrel files

### If Score 90-100% (Excellent)

Maintenance actions:
1. Keep it up! 🎉
2. Add more tests to reach 100% coverage
3. Continue following best practices

## Common Issues & Solutions

### TypeScript Errors

**Issue**: Cannot find type definition files
```bash
# Solution: Install missing @types packages
npm install --save-dev @types/package-name
```

### ESLint Errors

**Issue**: Unexpected linting errors
```bash
# Solution: Run lint with auto-fix
npm run lint -- --fix
```

### Design System Violations

**Issue**: Arbitrary values like `w-[432px]`
```tsx
// ❌ Bad
<div className="w-[432px]">

// ✅ Good
<div className="w-1/2 md:w-2/3">
```

### Component Complexity

**Issue**: Component over 200 lines
```tsx
// Solution: Extract sub-components
function LargeComponent() {
  // Extract to separate files
  return (
    <>
      <SubComponentA />
      <SubComponentB />
      <SubComponentC />
    </>
  )
}
```

### Missing Barrel Files

**Issue**: Directory missing index.ts
```bash
# Solution: Create index.ts in each component directory
touch src/components/feature/index.ts
```

## Integration Options

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
npm run quality-check || exit 1
```

### GitHub Actions

Automatically runs on:
- Push to main/develop
- Pull requests
- Every Monday at 9:00 AM UTC
- Manual trigger

### Scheduled Checks (Linux/Mac)

```bash
# Edit crontab
crontab -e

# Add weekly check
0 9 * * 1 cd /path/to/project && npm run quality-check
```

### Scheduled Checks (Windows)

```powershell
# Create task in Task Scheduler
schtasks /create /sc weekly /d mon /tn "Quality Check" /tr "cd C:\path\to\project && npm run quality-check"
```

## Customizing the Script

Edit `scripts/quality-check.sh` to adjust:

```bash
# Component size limit
max_lines=200  # Change to desired limit

# Coverage threshold
if [ "$coverage_int" -ge 80 ]; then  # Change 80 to desired percentage

# Prohibited patterns
local patterns=(
    "rounded-3xl"     # Add/remove patterns
    "shadow-\["
)
```

## Troubleshooting

### Script Permission Error (Linux/Mac)

```bash
chmod +x scripts/quality-check.sh
```

### "Command not found: bash" (Windows)

**Solution**: Use Git Bash or WSL, or run the batch file:
```bash
scripts\quality-check.bat
```

### Tests Timing Out

**Solution**: Increase timeout or run tests separately
```bash
npm run test:coverage
```

### Report Not Generated

**Solution**: Check directory permissions
```bash
mkdir -p .claude/.smite
chmod +w .claude/.smite
```

## Viewing Historical Reports

Reports are saved to `.claude/.smite/quality-report-latest.md`

To track quality over time:
```bash
# Archive reports with date
cp .claude/.smite/quality-report-latest.md .claude/.smite/reports/quality-report-$(date +%Y%m%d).md
```

## Best Practices

1. **Run Before Commits**: Catch issues early
2. **Review Reports Regularly**: Track progress
3. **Address Issues Promptly**: Don't let debt accumulate
4. **Update Thresholds**: Adjust as codebase grows
5. **Celebrate Improvements**: Acknowledge progress!

---

**Need Help?** Check the main README: `scripts/README.md`
