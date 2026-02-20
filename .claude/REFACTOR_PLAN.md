# PLAN DE REFACTORISATION - GENESIS INTERACTIVE MAP

> **Version:** 1.0.0
> **Date:** 2025-02-19
> **Scope:** Architecture, Structure, Best Practices
> **Team:** genesis-refactor

---

## 🎯 OBJECTIFS GLOBAUX

1. ✅ **Architecture ui/logic/methods** complète pour toutes les features
2. ✅ **Composants < 300 lignes** (sauf exception justifiée)
3. ✅ **Maximum 5 hooks par composant**
4. ✅ **Tests coverage > 80%** pour features critiques
5. ✅ **Zéro duplication** de code
6. ✅ **Structure par features** claire et maintenable

---

## 📊 ANALYSE - ÉTAT ACTUEL

### Métriques globales

```
Total fichiers dans components/:  402
Total Server Actions:             147
Total hooks personnalisés:        70+
Total stores Zustand:             7
Total tests:                      32
Composants > 300 lignes:          9
Composants avec > 5 hooks:        5
Score global:                     7.1/10
```

### Problèmes détectés

#### 🔴 CRITIQUES (Immédiat)

1. **Composants volumineux** (> 500 lignes)
   - `pin-icon-picker.tsx`: 804 lignes, 12 hooks
   - `pin-details-panel.tsx`: 783 lignes, 16 hooks
   - `pin-gallery-section.tsx`: 608 lignes, 14 hooks
   - `permissions-panel.tsx`: 565 lignes
   - `character-form.tsx`: 547 lignes

2. **Trop de hooks** dans un composant
   - `layers-panel.tsx`: 25 hooks 🔴
   - `pin-details-panel.tsx`: 16 hooks
   - `pin-gallery-section.tsx`: 14 hooks
   - `inline-edit-text.tsx`: 18 hooks

3. **Architecture incomplète**
   - `comments/`: Pas de logic/, pas de methods/
   - `character/`, `gallery/`, `lore/`, `presence/`, `search/`: Pas de methods/

#### 🟡 ÉLEVÉS (Prochainement)

4. **Tests coverage insuffisante**
   - pins: 98.92% ✅
   - Autres features: 0% ❌

5. **Doublons potentiels**
   - `ui/properties/*` vs `ui/*`

---

## 🚀 PLAN DE REFACTORISATION

### PHASE 1: ARCHITECTURE (Priorité: 🔴 CRITIQUE)

**Objectif:** Compléter l'architecture ui/logic/methods pour toutes les features

#### 1.1 Comments (Architecture manquante)

**État actuel:**
```
comments/
└── ui/           # 5 composants SEULEMENT
```

**Action:** Créer structure complète
```
comments/
├── ui/           # Présentation
│   ├── comment-thread.tsx         # Refactoriser (422 → < 300 lignes)
│   ├── comment-item.tsx
│   ├── comment-form.tsx
│   └── ...
├── logic/        # Hooks client
│   ├── use-comments.ts            # Data fetching (TanStack Query)
│   ├── use-comment-mutations.ts   # Mutations
│   └── use-comment-replies.ts     # Reply logic
└── methods/      # Server Actions wrappers
    ├── get-comments.ts
    ├── create-comment.ts
    ├── update-comment.ts
    └── delete-comment.ts
```

**Server Actions existantes dans `/actions/comments.ts` (413 lignes):**
- Déplacer dans `comments/methods/` avec exports
- Créer wrappers typés et documentés
- Ajouter validation Zod

---

#### 1.2 Lore (Architecture partielle)

**État actuel:**
```
lore/
├── ui/           # 5 composants
└── logic/        # 2 hooks
```

**Action:** Ajouter methods/
```
lore/
├── ui/
│   ├── lore-detail-client.tsx     # Refactoriser (361 → < 300 lignes)
│   └── lore-card.tsx
├── logic/
│   ├── use-lore.ts
│   └── use-lore-categories.ts
└── methods/      # NOUVEAU
    ├── get-lore-entries.ts
    ├── create-lore-entry.ts
    ├── update-lore-entry.ts
    └── delete-lore-entry.ts
```

---

#### 1.3 Character (Architecture partielle)

**État actuel:**
```
character/
├── ui/           # 6 composants
└── logic/        # Hooks
```

**Action:** Ajouter methods/ + refactoriser composants
```
character/
├── ui/
│   ├── character-form.tsx         # Refactoriser (547 → < 300 lignes)
│   ├── character-detail.tsx       # Refactoriser (464 → < 300 lignes)
│   └── ...
├── logic/
│   └── use-characters.ts
└── methods/      # NOUVEAU
    ├── get-characters.ts
    ├── create-character.ts
    ├── update-character.ts
    └── delete-character.ts
```

---

#### 1.4 Gallery (Architecture partielle)

**État actuel:**
```
gallery/
├── ui/           # 5 composants
├── logic/        # 3 hooks
└── utils/        # Utilitaires
```

**Action:** Ajouter methods/
```
gallery/
├── ui/
├── logic/
│   ├── use-gallery.ts
│   ├── use-image-upload.ts
│   └── use-gallery-pagination.ts
└── methods/      # NOUVEAU
    ├── get-gallery-items.ts
    ├── upload-image.ts
    ├── update-image.ts
    └── delete-image.ts
```

**Server Actions existantes dans `/actions/gallery.ts` (1019 lignes):**
- Déplacer dans `gallery/methods/`
- Séparer en fichiers par fonctionnalité

---

#### 1.5 Presence (Architecture partielle)

**Action:** Ajouter methods/
```
presence/
├── ui/
├── logic/
│   ├── use-presence.ts
│   └── use-cursors.ts
└── methods/      # NOUVEAU
    ├── broadcast-cursor.ts
    ├── get-presence.ts
    └── update-presence.ts
```

---

#### 1.6 Search (Architecture partielle)

**Action:** Ajouter methods/
```
search/
├── ui/
├── logic/
│   └── use-search.ts
└── methods/      # NOUVEAU
    ├── search-all.ts
    ├── search-pins.ts
    ├── search-lore.ts
    └── search-characters.ts
```

---

### PHASE 2: COMPOSANTS VOLUMINEUX (Priorité: 🔴 CRITIQUE)

**Objectif:** Réduire tous les composants > 300 lignes

#### 2.1 Pin Icon Picker (804 lignes → < 300)

**Problème:**
- 804 lignes
- 12 hooks
- Toutes les icônes inline

**Solution:**
```
pins/ui/
├── pin-icon-picker.tsx            # Main component (< 200 lignes)
└── icon-picker/
    ├── icon-data.ts               # Toutes les icônes exportées
    ├── icon-grid.tsx              # Grille d'icônes
    ├── icon-search.tsx            # Recherche
    ├── icon-categories.tsx        # Catégories
    └── icon-preview.tsx           # Preview
```

**logic/**
```
pins/logic/
└── use-icon-picker.ts             # Hook pour icon picker
    ├── search state
    ├── category filter
    ├── selection
    └── preview
```

---

#### 2.2 Pin Details Panel (783 lignes → < 300)

**Problème:**
- 783 lignes
- 16 hooks
- Trop de responsabilités

**Solution:**
```
pins/ui/
├── pin-details-panel.tsx          # Main component (< 150 lignes)
└── details-panel/
    ├── pin-info-section.tsx       # Info basiques
    ├── pin-gallery-section.tsx    # Refactoriser (608 → < 200)
    ├── pin-lore-section.tsx       # Liaison lore
    ├── pin-characters-section.tsx # Liaison characters
    ├── pin-metadata-section.tsx   # Metadata
    └── pin-permissions-section.tsx # Permissions
```

**logic/**
```
pins/logic/
├── use-pin-details.ts             # Hook principal
├── use-pin-gallery.ts             # Gestion galerie
├── use-pin-lore-link.ts           # Liaison lore
└── use-pin-character-link.ts      # Liaison characters
```

---

#### 2.3 Pin Gallery Section (608 lignes → < 200)

**Problème:**
- 608 lignes
- 14 hooks
- Upload, drag-drop, preview, etc.

**Solution:**
```
pins/ui/details-panel/
├── pin-gallery-section.tsx        # Main (< 100 lignes)
└── gallery/
    ├── gallery-upload-zone.tsx    # Upload zone
    ├── gallery-grid.tsx           # Grille d'images
    ├── gallery-item.tsx           # Item individuel
    ├── gallery-preview-modal.tsx  # Preview plein écran
    └── gallery-delete-confirm.tsx # Confirmation suppression
```

**logic/**
```
pins/logic/
├── use-gallery-upload.ts          # Upload logic
├── use-gallery-preview.ts         # Preview modal
└── use-gallery-sort.ts            # Sort/filter
```

---

#### 2.4 Layers Panel (450 lignes, 25 hooks → < 300, < 5 hooks)

**Problème:**
- 450 lignes
- **25 hooks** 🔴
- Gestion des calques, drag-drop, visibilité, verrouillage

**Solution:**
```
world/ui/docks/
├── layers-panel.tsx               # Main (< 150 lignes)
└── layers/
    ├── layer-list.tsx             # Liste des calques
    ├── layer-item.tsx             # Item de calque
    ├── layer-controls.tsx         # Contrôles (visibilité, verrou)
    ├── layer-create-form.tsx      # Création
    └── layer-permissions.tsx      # Permissions
```

**logic/**
```
world/logic/
├── use-layers-management.ts       # Gestion globale
├── use-layer-operations.ts        # CRUD opérations
├── use-layer-reorder.ts           # Drag-drop reordering
├── use-layer-visibility.ts        # Visibilité/verrouillage
└── use-layer-permissions.ts       # Gestion permissions
```

**Combiner les hooks:**
- Au lieu de 25 petits hooks, créer 3-4 hooks bien définis
- Chaque hook a une responsabilité unique

---

#### 2.5 Permissions Panel (565 lignes → < 300)

**Solution:**
```
world/ui/docks/
├── permissions-panel.tsx          # Main (< 150 lignes)
└── permissions/
    ├── member-list.tsx            # Liste membres
    ├── member-role-select.tsx     # Sélection rôle
    ├── permission-grid.tsx        # Grille permissions
    └── invite-form.tsx            # Formulaire invitation
```

---

#### 2.6 Character Form (547 lignes → < 300)

**Solution:**
```
character/ui/
├── character-form.tsx             # Main (< 150 lignes)
└── form/
    ├── character-basic-info.tsx   # Info basiques
    ├── character-attributes.tsx   # Attributs RPG
    ├── character-relationships.tsx# Relations
    ├── character-image-upload.tsx # Upload image
    └── character-lore-links.tsx   # Liaison lore
```

**logic/**
```
character/logic/
├── use-character-form.ts          # Form state
└── use-character-image-upload.ts  # Upload logic
```

---

#### 2.7 Comment Thread (422 lignes → < 300)

**Solution:**
```
comments/ui/
├── comment-thread.tsx             # Main (< 150 lignes)
└── thread/
    ├── comment-list.tsx           # Liste commentaires
    ├── comment-item.tsx           # Item commentaire
    ├── comment-reply-form.tsx     # Formulaire réponse
    └── comment-pagination.tsx     # Pagination
```

---

### PHASE 3: HOOKS OPTIMISATION (Priorité: 🟡 ÉLEVÉ)

**Objectif:** Réduire le nombre de hooks par composant (< 5)

#### Règle: Moins de hooks, plus cohérents

**Principe:**
- Un composant ne devrait pas avoir plus de 5 hooks
- Combiner les hooks liés
- Extraire la logique dans des sous-composants

**Exemple - Layers Panel:**

**Avant (25 hooks):**
```typescript
function LayersPanel() {
  const layers = useLayers()
  const activeLayer = useActiveLayer()
  const toggleVisibility = useLayerVisibility()
  const toggleLock = useLayerLock()
  const reorderLayers = useLayerReorder()
  const createLayer = useCreateLayer()
  const deleteLayer = useDeleteLayer()
  // ... 18 autres hooks
}
```

**Après (3 hooks):**
```typescript
function LayersPanel() {
  const {
    layers,
    activeLayer,
    visibility,
    lock,
    reorder
  } = useLayersManagement()  // 1 hook cohérent

  const { create, delete, update } = useLayerOperations()  // 1 hook

  const { permissions, hasPermission } = useLayerPermissions()  // 1 hook

  return <LayersPanelUI {...} />
}
```

---

### PHASE 4: TESTS (Priorité: 🟡 ÉLEVÉ)

**Objectif:** Tests coverage > 80% pour features critiques

#### 4.1 Tests à créer

**Priority 1 - Features critiques:**
- ✅ pins: 98.92% coverage
- 🔴 world/logic/*: 0% → Target 80%
- 🔴 comments: 0% → Target 80%
- 🔴 gallery: 0% → Target 80%

**Priority 2 - Features importantes:**
- 🟡 character: 0% → Target 70%
- 🟡 lore: 0% → Target 70%

**Priority 3 - Features secondaires:**
- 🟢 search: 0% → Target 60%
- 🟢 presence: 0% → Target 60%

#### 4.2 Stratégie de tests

**Tests unitaires:**
- Tous les hooks dans `logic/`
- Tous les utilitaires dans `utils/` et `methods/`
- Composants UI critiques

**Tests d'intégration:**
- Flux complets (create pin → edit → delete)
- Interactions entre features (pin + gallery + lore)

**Tests E2E:**
- Playwright pour flux critiques

---

### PHASE 5: CLEANUP (Priorité: 🟢 MOYEN)

**Objectif:** Éliminer duplication et code mort

#### 5.1 Doublons ui/properties/

**Analyser:**
- `property-input.tsx` vs `ui/input.tsx`
- `property-textarea.tsx` vs `ui/textarea.tsx`
- `property-select.tsx` vs `ui/select.tsx`

**Action:**
- Si fonctionnalité identique: Supprimer `property-*`
- Si fonctionnalité étendue: Créer variant props
- Documenter la décision

#### 5.2 Composants morts

**Action:**
- Lancer `grepai search` pour trouver tous les imports
- Identifier les composants non importés
- Supprimer après confirmation

#### 5.3 Barrel exports

**Vérifier:**
- Tous les dossiers ont un `index.ts`
- Imports propres via barrels
- Pas d'imports relatifs profonds (`../../../`)

---

### PHASE 6: OPTIMISATION (Priorité: 🟢 MOYEN)

**Objectif:** Performance et DX

#### 6.1 Stores Zustand

**Stores manquants:**
- `use-layers-store.ts` (créer)
- `use-characters-store.ts` (créer)
- `use-gallery-store.ts` (optionnel)

#### 6.2 TanStack Query

**Vérifier:**
- Tous les `useEffect` avec fetch remplacés par `useQuery`
- Bon usage de `staleTime`, `cacheTime`
- Invalidation correcte après mutations

#### 6.3 Server Actions

**Optimisation:**
- Validation Zod pour toutes les actions
- Error handling cohérent
- Logging pour debug

---

## 📋 ORDRE D'EXÉCUTION

### SPRINT 1: Architecture Critique (Semaine 1)

**Teammate: architect**
1. ✅ Créer `comments/methods/` (0.5 jour)
2. ✅ Créer `character/methods/` (0.5 jour)
3. ✅ Créer `gallery/methods/` (0.5 jour)
4. ✅ Créer `presence/methods/` (0.5 jour)
5. ✅ Créer `search/methods/` (0.5 jour)
6. ✅ Créer `lore/methods/` (0.5 jour)

**Livraison:** Architecture ui/logic/methods complète

---

### SPRINT 2: Refactorisation Composants Critiques (Semaine 2)

**Teammate: refactor-components**
1. ✅ Refactoriser `pin-icon-picker.tsx` (1 jour)
2. ✅ Refactoriser `pin-details-panel.tsx` (1 jour)
3. ✅ Refactoriser `pin-gallery-section.tsx` (1 jour)
4. ✅ Refactoriser `layers-panel.tsx` (1 jour)
5. ✅ Refactoriser `permissions-panel.tsx` (0.5 jour)

**Livraison:** Composants < 300 lignes

---

### SPRINT 3: Refactorisation Autres Composants (Semaine 3)

**Teammate: refactor-components**
1. ✅ Refactoriser `character-form.tsx` (0.5 jour)
2. ✅ Refactoriser `comment-thread.tsx` (0.5 jour)
3. ✅ Refactoriser `lore-detail-client.tsx` (0.5 jour)
4. ✅ Refactoriser `character-detail.tsx` (0.5 jour)

**Livraison:** Tous composants < 300 lignes

---

### SPRINT 4: Tests (Semaine 4)

**Teammate: test-engineer**
1. ✅ Tests pour `world/logic/*` (2 jours)
2. ✅ Tests pour `comments/*` (1 jour)
3. ✅ Tests pour `gallery/*` (1 jour)
4. ✅ Tests pour `character/*` (0.5 jour)

**Livraison:** Coverage > 80% pour features critiques

---

### SPRINT 5: Cleanup & Optimisation (Semaine 5)

**Teammate: cleaner**
1. ✅ Analyser et fusionner `ui/properties/*` (0.5 jour)
2. ✅ Supprimer composants morts (0.5 jour)
3. ✅ Créer stores Zustand manquants (0.5 jour)
4. ✅ Optimiser TanStack Query (0.5 jour)
5. ✅ Améliorer barrel exports (0.5 jour)

**Livraison:** Code propre, optimisé

---

## ✅ CRITÈRES DE SUCCÈS

### Métriques cibles

```
Composants > 300 lignes:         0 (depuis 9)
Composants avec > 5 hooks:        0 (depuis 5)
Architecture ui/logic/methods:    12/12 features (depuis 6/12)
Tests coverage (critiques):       > 80% (depuis pins: 98%, autres: 0%)
Score global:                     > 9/10 (depuis 7.1/10)
```

### Validation

- [ ] Tous les tests passent
- [ ] Aucune régression détectée
- [ ] TypeScript compile sans erreurs
- [ ] ESLint passe
- [ ] Performance maintenue ou améliorée

---

## 🔄 WORKFLOW

### Pour chaque changement

1. **Analyser** le fichier/feature
2. **Créer** la nouvelle structure
3. **Déplacer** le code existant
4. **Refactoriser** pour améliorer
5. **Tester** unitairement
6. **Valider** pas de régression
7. **Commit** avec message Git Flow Master

### Convention de commit

```
UPDATE: Genesis - v1.3.0

- Refactored: pin-icon-picker (804 → 250 lignes)
- Added: pins/ui/icon-picker/* structure
- Added: pins/logic/use-icon-picker.ts
- Fixed: icon search performance

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

## 📊 PROGRESSION

### Phase 1: Architecture
- [ ] comments/methods/
- [ ] character/methods/
- [ ] gallery/methods/
- [ ] presence/methods/
- [ ] search/methods/
- [ ] lore/methods/

### Phase 2: Composants volumineux
- [ ] pin-icon-picker (804 → < 300)
- [ ] pin-details-panel (783 → < 300)
- [ ] pin-gallery-section (608 → < 200)
- [ ] layers-panel (450 → < 300, 25 → < 5 hooks)
- [ ] permissions-panel (565 → < 300)
- [ ] character-form (547 → < 300)
- [ ] comment-thread (422 → < 300)

### Phase 3: Hooks
- [ ] layers-panel (25 → < 5 hooks)
- [ ] pin-details-panel (16 → < 5 hooks)
- [ ] pin-gallery-section (14 → < 5 hooks)

### Phase 4: Tests
- [ ] world/logic/* (> 80%)
- [ ] comments/* (> 80%)
- [ ] gallery/* (> 80%)
- [ ] character/* (> 70%)

### Phase 5: Cleanup
- [ ] Doublons ui/properties/*
- [ ] Composants morts
- [ ] Barrel exports

### Phase 6: Optimisation
- [ ] Stores Zustand manquants
- [ ] TanStack Query optimisation
- [ ] Server Actions validation

---

**Status:** 🚧 Plan créé, prêt pour exécution
**Team:** genesis-refactor
**Estimation:** 5 semaines pour complétion totale
