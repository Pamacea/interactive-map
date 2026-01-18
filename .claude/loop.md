---
iteration: 1
max_iterations: 50
completion_promise: COMPLETE
---

# Ralph Loop: Interactive Map Platform Fixes & Improvements

## Original Prompt

Explore le projet, analyse le projet, trouve les bugs, les failles de logique, les features à implémenter, les features à corriger(car y'a beaucoup de bugs, genre on peut pas déplacer les pins, les layers, les propriétés), fait une analyse du design et des layout du site. Mets à jour le prd.json avec tout ca et lance le. Ensuite envoie moi le plan de fix, improve, etc..

## Analysis Summary

A comprehensive analysis has identified **18 critical issues** across multiple categories:

### Critical Bugs (Immediate Action Required)
1. **Pin Drag Position Calculation Error** - Pins jump to incorrect positions during drag
2. **Layer Position Not Persisted** - Layer movements lost after page refresh
3. **Layer Lock State Not Propagated** - Drag initializes before lock check
4. **Drag Race Condition** - Optimistic updates conflict with database sync
5. **Missing Error Boundaries** - App can crash from single component error

### High-Priority Issues
6. **Lore Entries UI Missing** - Schema ready, no implementation
7. **Pin Marker Re-renders** - Performance issues during pan/zoom
8. **Property Form State Sync** - Sidebar and popup states conflict
9. **Pin List Centering** - TODO functionality not implemented

### Medium-Priority Issues
10. **Image Gallery UI Missing** - Schema ready, no implementation
11. **Pins Store Too Large** - 569 lines, needs splitting
12. **Error Handling** - Silent failures, no user feedback
13. **Accessibility** - Missing ARIA labels, keyboard nav
14. **Type Safety** - Unsafe casts, missing null checks
15. **Map Export** - No export functionality
16. **Full-Text Search** - Only basic filtering exists

### Low-Priority Issues
17. **Loading Patterns** - Inconsistent across app
18. **Double Popup Rendering** - Redundant render logic

## User Stories

See `.claude/.smite/prd.json` for complete user stories with acceptance criteria.

## Execution Plan

Stories are prioritized by severity and dependencies:

### Phase 1: Critical Bug Fixes (US-001 to US-005)
Fix blocking bugs that prevent core functionality:
- Fix pin dragging (US-001)
- Fix layer persistence (US-002)
- Fix layer lock propagation (US-003)
- Fix drag race conditions (US-004)
- Add error boundaries (US-005)

### Phase 2: High Priority Features (US-006 to US-010)
Implement missing critical features and performance fixes:
- Lore entries UI (US-006)
- Pin list centering (US-007)
- Property form sync (US-008)
- Pin marker optimization (US-009)
- Image gallery UI (US-010)

### Phase 3: Architecture Improvements (US-011 to US-016)
Refactor and improve code quality:
- Split pins store (US-011)
- Error handling (US-012)
- Accessibility (US-013)
- Loading patterns (US-014)
- Type safety (US-015)
- Fix double rendering (US-016)

### Phase 4: Feature Enhancements (US-017 to US-018)
Add new capabilities:
- Map export (US-017)
- Full-text search (US-018)

## Instructions

Execute user stories in priority order (1-18). For each story:

1. Read the story details from PRD
2. Invoke appropriate agent (builder or simplifier)
3. Mark story as `passes: true` in PRD after completion
4. Run tests if applicable
5. Commit changes with descriptive message
6. Continue to next story

When ALL stories are complete, output:

```
<promise>COMPLETE</promise>
```

## Status

**Iteration**: 1/50
**Stories Completed**: 0/18
**Current Story**: US-001 - Fix Pin Drag Position Calculation
