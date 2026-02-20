import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Customize rules if needed
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_+',
        varsIgnorePattern: '^_+',
        caughtErrorsIgnorePattern: '^_+'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Override default ignores of eslint-config-next
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'node_modules/**',
    '*.config.js',
    '*.config.ts',
    'dist/**',
  ]),
])

export default eslintConfig
