---
iteration: 1
max_iterations: 50
completion_promise: COMPLETE
---

# Ralph Loop: Shadcn UI Migration

## Objective
Migrate all components to use Shadcn UI components for a consistent, Lego-like design system.

## User Stories

### US-001: Audit Current Component Usage
**Priority**: 1
**Agent**: smite:smite-explore

Audit all components NOT using Shadcn UI. Create inventory with migration priorities.

### US-002: Install Missing Shadcn Components
**Priority**: 2
**Agent**: builder

Install all required Shadcn components via CLI.

### US-003: Migrate World Components
**Priority**: 3
**Agent**: builder

Refactor `src/components/world/` to use Shadcn UI.

### US-004: Migrate Pin Components
**Priority**: 4
**Agent**: builder

Refactor `src/components/pins/` to use Shadcn UI.

### US-005: Migrate Search Components
**Priority**: 5
**Agent**: builder

Refactor `src/components/search/` to use Shadcn UI.

### US-006: Migrate Export Components
**Priority**: 6
**Agent**: builder

Ensure export dialog uses Shadcn UI completely.

### US-007: Migrate Auth Components
**Priority**: 7
**Agent**: builder

Refactor `src/components/auth/` to use Shadcn UI.

### US-008: Migrate Create Components
**Priority**: 8
**Agent**: builder

Refactor `src/components/create/` to use Shadcn UI.

### US-009: Standardize Layout & Theme
**Priority**: 9
**Agent**: builder

Update Tailwind config and CSS for Shadcn compatibility.

### US-010: Verify & Test
**Priority**: 10
**Agent**: smite:finalize

Test all flows, verify accessibility, update docs.

## Progress
- Current iteration: 1
- Active: US-001
- Status: Starting audit
