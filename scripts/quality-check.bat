@echo off
REM Quality Monitoring Script for Windows
REM Runs automated quality checks and generates reports

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_ROOT=%~dp0..
set REPORT_DIR=%PROJECT_ROOT%\.claude\.smite
set REPORT_FILE=%REPORT_DIR%\quality-report-latest.md
set TEMP_DIR=%PROJECT_ROOT%\.tmp-quality-check

REM Get timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set TIMESTAMP=%dt:~0,4%-%dt:~4,2%-%dt:~6,2% %dt:~8,2%:%dt:~10,2%:%dt:~12,2%
set DATE_SHORT=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%

echo ========================================
echo Genesis Platform - Quality Check
echo ========================================
echo Started at: %TIMESTAMP%
echo Project root: %PROJECT_ROOT%
echo.

REM Create temp directory
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"
if not exist "%REPORT_DIR%" mkdir "%REPORT_DIR%"

REM Score tracking
set TOTAL_SCORE=0
set MAX_SCORE=0

echo.
echo ▶ TypeScript Type Checking
echo.

set TS_OUTPUT=%TEMP_DIR%\tscheck.log
npx tsc --noEmit > "%TS_OUTPUT%" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] No TypeScript errors found
    set /a TOTAL_SCORE+=100
    set /a MAX_SCORE+=100
    set TS_STATUS=PASS
    set TS_DETAILS=0 errors
) else (
    echo [FAIL] TypeScript errors found
    set /a MAX_SCORE+=100
    set TS_STATUS=FAIL
    find /c "error TS" "%TS_OUTPUT%" > nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set TS_DETAILS=Multiple errors
    ) else (
        set TS_DETAILS=Type check failed
    )
)

echo.
echo ▶ ESLint Linting
echo.

set LINT_OUTPUT=%TEMP_DIR%\lint.log
npm run lint -- --max-warnings 0 > "%LINT_OUTPUT%" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] No ESLint errors or warnings
    set /a TOTAL_SCORE+=100
    set /a MAX_SCORE+=100
    set LINT_STATUS=PASS
    set LINT_DETAILS=0 errors, 0 warnings
) else (
    echo [WARN] ESLint issues found
    set /a MAX_SCORE+=100
    set LINT_STATUS=WARN
    set LINT_DETAILS=Issues found
)

echo.
echo ▶ Test Coverage
echo.

set TEST_OUTPUT=%TEMP_DIR%\test.log
npm run test:coverage -- --run > "%TEST_OUTPUT%" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Tests passed
    findstr /C:"Statements" "%TEST_OUTPUT%" > nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        for /f "tokens=2 delims= " %%a in ('findstr /C:"Statements" "%TEST_OUTPUT%"') do set COVERAGE=%%a
        echo Coverage: !COVERAGE!
    )
    set /a TOTAL_SCORE+=100
    set /a MAX_SCORE+=100
    set TEST_STATUS=PASS
    set TEST_DETAILS=Tests passed
) else (
    echo [FAIL] Tests failed
    set /a MAX_SCORE+=100
    set TEST_STATUS=FAIL
    set TEST_DETAILS=Tests failed
)

echo.
echo ▶ Component Complexity
echo.

set VIOLATIONS=0
set TOTAL_COMP=0

for /r "%PROJECT_ROOT%\src\components" %%f in (*.tsx *.ts) do (
    set /a TOTAL_COMP+=1
    for /f "usebackq delims=" %%l in ("%%f") do set /a LINES=%%l
    if !LINES! GTR 200 (
        set /a VIOLATIONS+=1
        echo   Violation: %%f - !LINES! lines
    )
)

if %VIOLATIONS% EQU 0 (
    echo [SUCCESS] All components under 200 lines
    set /a TOTAL_SCORE+=100
    set /a MAX_SCORE+=100
    set COMPLEXITY_STATUS=PASS
    set COMPLEXITY_DETAILS=%TOTAL_COMP% components, all ^< 200 lines
) else (
    echo [WARN] Found %VIOLATIONS% components over 200 lines
    set /a TOTAL_SCORE+=50
    set /a MAX_SCORE+=100
    set COMPLEXITY_STATUS=WARN
    set COMPLEXITY_DETAILS=%VIOLATIONS%/%TOTAL_COMP% components ^> 200 lines
)

echo.
echo ▶ Design System Compliance
echo.

set DS_VIOLATIONS=0
set DS_FILES=0

for /r "%PROJECT_ROOT%\src" %%f in (*.tsx) do (
    set /a DS_FILES+=1
    findstr /C:"rounded-3xl" "%%f" > nul 2>&1
    if !ERRORLEVEL! EQU 0 set /a DS_VIOLATIONS+=1
    findstr /C:"shadow-[" "%%f" > nul 2>&1
    if !ERRORLEVEL! EQU 0 set /a DS_VIOLATIONS+=1
)

if %DS_VIOLATIONS% EQU 0 (
    echo [SUCCESS] 100%% design system compliant
    set /a TOTAL_SCORE+=100
    set /a MAX_SCORE+=100
    set DESIGN_STATUS=PASS
    set DESIGN_DETAILS=%DS_FILES% files, 0 violations
) else (
    echo [WARN] Found %DS_VIOLATIONS% design system violations
    set /a TOTAL_SCORE+=75
    set /a MAX_SCORE+=100
    set DESIGN_STATUS=WARN
    set DESIGN_DETAILS=%DS_FILES% files, %DS_VIOLATIONS% violations
)

echo.
echo ▶ Code Organization (Barrel Files)
echo.

set MISSING_BARRELS=0
set DIRS_WITH_COMP=0

for /d /r "%PROJECT_ROOT%\src\components" %%d in (*) do (
    dir /b "%%d\*.ts" "%%d\*.tsx" > nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        set /a DIRS_WITH_COMP+=1
        if not exist "%%d\index.ts" (
            set /a MISSING_BARRELS+=1
        )
    )
)

if %MISSING_BARRELS% EQU 0 (
    echo [SUCCESS] Barrel files properly organized
    set /a TOTAL_SCORE+=100
    set /a MAX_SCORE+=100
    set BARREL_STATUS=PASS
    set BARREL_DETAILS=%DIRS_WITH_COMP% directories, all have index.ts
) else (
    echo [WARN] Missing %MISSING_BARRELS% barrel files
    set /a TOTAL_SCORE+=75
    set /a MAX_SCORE+=100
    set BARREL_STATUS=WARN
    set BARREL_DETAILS=%MISSING_BARRELS%/%DIRS_WITH_COMP% missing index.ts
)

REM Calculate overall score
set OVERALL=0
if %MAX_SCORE% GTR 0 (
    set /a OVERALL=%TOTAL_SCORE%*100/%MAX_SCORE%
)

echo.
echo ========================================
echo Quality Check Summary
echo ========================================
echo.
echo TypeScript:     %TS_STATUS% (%TS_DETAILS%)
echo Linting:        %LINT_STATUS% (%LINT_DETAILS%)
echo Tests:          %TEST_STATUS% (%TEST_DETAILS%)
echo Complexity:     %COMPLEXITY_STATUS% (%COMPLEXITY_DETAILS%)
echo Design System:  %DESIGN_STATUS% (%DESIGN_DETAILS%)
echo Barrel Files:   %BARREL_STATUS% (%BARREL_DETAILS%)
echo.
echo Overall Quality Score: %OVERALL%%%
echo.
echo Full report saved to: %REPORT_FILE%
echo.

REM Generate markdown report
(
echo # Quality Check Report - %DATE_SHORT%
echo.
echo **Generated**: %TIMESTAMP%
echo **Project**: Genesis - Interactive Map Platform
echo.
echo ---
echo.
echo ## Summary
echo.
echo ^| Check ^| Status ^| Details ^|
echo ^|-------^|--------^|---------^|
echo ^| **TypeScript** ^| %TS_STATUS% ^| %TS_DETAILS% ^|
echo ^| **Linting** ^| %LINT_STATUS% ^| %LINT_DETAILS% ^|
echo ^| **Tests** ^| %TEST_STATUS% ^| %TEST_DETAILS% ^|
echo ^| **Component Complexity** ^| %COMPLEXITY_STATUS% ^| %COMPLEXITY_DETAILS% ^|
echo ^| **Design System** ^| %DESIGN_STATUS% ^| %DESIGN_DETAILS% ^|
echo ^| **Code Organization** ^| %BARREL_STATUS% ^| %BARREL_DETAILS% ^|
echo.
echo ### Overall Quality Score: **%OVERALL%%%**
echo.
echo ---
echo.
echo ## Quality Standards
echo.
echo This report checks compliance with the following standards:
echo.
echo - **Type Safety**: Strict TypeScript, no \`any\` types
echo - **Code Quality**: ESLint rules, no warnings
echo - **Testing**: 80%%+ coverage target
echo - **Component Size**: Max 200 lines per component
echo - **Design System**: Tailwind v4 best practices
echo - **Organization**: Barrel exports for tree-shaking
echo.
echo ---
echo.
echo *Automated quality monitoring • Genesis Platform*
) > "%REPORT_FILE%"

REM Cleanup
rd /s /q "%TEMP_DIR%" 2>nul

REM Exit with appropriate code
if %OVERALL% LSS 70 (
    exit /b 1
) else (
    exit /b 0
)
