# 02_PLAN - Strategy Creation

## Files to Create

### 1. src/components/ui/page-background.tsx
- **Purpose**: Reusable background wrapper with grain, grid, and particles
- **Dependencies**: GridBackground, FloatingParticles
- **Size estimate**: small (~30 lines)

### 2. src/components/ui/page-header.tsx
- **Purpose**: Standardized page header with runes and ornate styling
- **Dependencies**: None (pure presentational)
- **Size estimate**: small (~40 lines)

### 3. src/components/ui/fantasy-card.tsx
- **Purpose**: Themed card with fantasy hover effects
- **Dependencies**: None (pure presentational)
- **Size estimate**: medium (~60 lines)

### 4. src/components/ui/empty-state.tsx
- **Purpose**: Styled empty state with call-to-action
- **Dependencies**: CrownButton
- **Size estimate**: small (~40 lines)

## Files to Modify

### 1. src/app/worlds/page.tsx
- **Changes**: Add PageBackground wrapper, enhance empty state, use FantasyCard
- **Risk level**: low
- **Dependencies affected**: None

### 2. src/app/settings/page.tsx
- **Changes**: Add PageBackground wrapper, use FantasyCard for settings cards
- **Risk level**: low
- **Dependencies affected**: None

### 3. src/app/auth/signin/page.tsx
- **Changes**: Add PageBackground wrapper
- **Risk level**: low
- **Dependencies affected**: None

### 4. src/app/about/page.tsx
- **Changes**: Add PageBackground wrapper, enhance section styling
- **Risk level**: low
- **Dependencies affected**: None

### 5. src/app/terms/page.tsx
- **Changes**: Add PageBackground wrapper
- **Risk level**: low
- **Dependencies affected**: None

### 6. src/app/privacy/page.tsx
- **Changes**: Add PageBackground wrapper
- **Risk level**: low
- **Dependencies affected**: None

## Acceptance Criteria

### Functional Requirements
- [ ] All pages have consistent background (grain + grid + particles)
- [ ] All page headers follow the same ornate pattern with runes
- [ ] All cards have consistent hover effects (gold border, lift)
- [ ] Empty states are visually consistent and themed
- [ ] Animations are smooth and enhance the fantasy theme

### Non-Functional Requirements
- [ ] Code passes linting
- [ ] Code passes typecheck
- [ ] Build succeeds
- [ ] No console errors

### Quality Standards
- [ ] Follows existing patterns (Crown of Ashes theme)
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Clear component names

## Implementation Steps

### Phase 1: Create Reusable Components
- [ ] Create PageBackground component
- [ ] Create PageHeader component
- [ ] Create FantasyCard component
- [ ] Create EmptyState component

### Phase 2: Update Pages
- [ ] Update worlds/page.tsx
- [ ] Update settings/page.tsx
- [ ] Update auth/signin/page.tsx
- [ ] Update about/page.tsx
- [ ] Update terms/page.tsx
- [ ] Update privacy/page.tsx

### Phase 3: Testing
- [ ] Visual testing of all pages
- [ ] Animation smoothness check
- [ ] Responsive behavior verification

## Risk Assessment

### Low Risk Items
- Adding background components - purely visual, isolated changes
- Updating page headers - consistent pattern already established

### Medium Risk Items
- None identified

### High Risk Items
- None identified
