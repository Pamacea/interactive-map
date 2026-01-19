# Scripts

This directory contains utility scripts for the Genesis Interactive Map Platform.

## Available Scripts

### Quality Check (`quality-check.sh`)

Automated quality monitoring script that runs comprehensive checks on the codebase and generates reports.

#### Usage

```bash
# Run manually
npm run quality-check

# Or directly
bash scripts/quality-check.sh
```

#### What It Checks

1. **TypeScript Type Checking** (`npx tsc --noEmit`)
   - Validates type safety across the entire codebase
   - Reports any TypeScript errors

2. **ESLint Linting** (`npm run lint`)
   - Checks code quality and style
   - Reports errors and warnings
   - Target: 0 errors, 0 warnings

3. **Test Coverage** (`npm run test:coverage`)
   - Runs full test suite with coverage reporting
   - Target: 80%+ coverage
   - Reports pass/fail status

4. **Component Complexity Analysis**
   - Scans all components in `src/components/`
   - Checks if any component exceeds 200 lines
   - Reports violations with file paths and line counts

5. **Design System Compliance**
   - Checks for prohibited patterns:
     - `rounded-3xl` (excessive border radius)
     - `shadow-[...]` (custom shadow values)
     - `border-[#...]` (custom border colors)
     - `m-[...]` (custom margins)
     - `w-[...]` / `h-[...]` (custom sizing)
   - Calculates compliance rate

6. **Code Organization (Barrel Files)**
   - Verifies `index.ts` files exist in component directories
   - Ensures proper tree-shaking setup

#### Output

The script generates two outputs:

1. **Console Output**: Real-time progress and summary
   ```
   Quality Check Summary
   ====================

   TypeScript:     ✅ PASS (0 errors)
   Linting:        ✅ PASS (0 errors, 0 warnings)
   Tests:          ✅ PASS (101/101, 98.46% coverage)
   Complexity:     ✅ PASS (all <200 lines)
   Design System:  ✅ PASS (100% compliant)
   Barrel Files:   ✅ PASS (all organized)

   Overall Quality Score: 100%
   ```

2. **Markdown Report**: Saved to `.claude/.smite/quality-report-latest.md`
   - Detailed breakdown of each check
   - Full list of violations
   - Recommendations
   - Historical tracking

#### Exit Codes

- `0`: Quality score ≥70% (success)
- `1`: Quality score <70% (failure)

#### GitHub Actions Integration

The script is automatically run on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Every Monday at 9:00 AM UTC (scheduled)
- Manual workflow dispatch

Results are uploaded as artifacts and can be commented on PRs.

#### Continuous Monitoring

For continuous quality monitoring, consider:

1. **Local Pre-commit Hook**:
   ```bash
   # .git/hooks/pre-commit
   npm run quality-check || exit 1
   ```

2. **Weekly Cron Job** (Linux/Mac):
   ```bash
   # Add to crontab with: crontab -e
   0 9 * * 1 cd /path/to/project && npm run quality-check
   ```

3. **Windows Task Scheduler**:
   ```powershell
   # Create scheduled task to run weekly
   schtasks /create /sc weekly /d mon /tn "Quality Check" /tr "cd C:\path\to\project && npm run quality-check"
   ```

#### Customization

You can customize thresholds in the script:

- `max_lines=200`: Component size limit
- Coverage threshold: Currently 80%
- Design system patterns: Add/remove prohibited patterns
- Scoring weights: Adjust points per check

#### Troubleshooting

**Script fails with permission error:**
```bash
chmod +x scripts/quality-check.sh
```

**Missing dependencies:**
```bash
npm install
```

**TypeScript errors not showing:**
- Ensure `tsconfig.json` exists and is valid
- Check that all dependencies are installed

**Tests failing:**
- Run tests locally first: `npm test`
- Check test configuration in `vitest.config.ts`

---

## Database Scripts

### `check-db.ts`
Checks database connection and basic operations.

### `check-pins-db.ts`
Validates pins table structure and data.

### `fix-world-permissions.ts`
Utility script to fix world permission issues.

---

## Development

When adding new scripts:

1. Use `.sh` for bash scripts
2. Use `.ts` for TypeScript scripts with database access
3. Add documentation to this README
4. Make scripts executable: `chmod +x scripts/script-name.sh`
5. Test scripts before committing

---

## See Also

- [CLAUDE.md](../CLAUDE.md) - Project documentation
- [.github/workflows/quality-check.yml](../.github/workflows/quality-check.yml) - CI/CD configuration
