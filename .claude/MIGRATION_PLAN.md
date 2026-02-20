# PLAN DE MIGRATION - STRUCTURE FEATURE-BASED

> **Version:** 1.0.0
> **Date:** 2025-02-19
> **Option:** 1 - Migration immédiate
> **Objectif:** Restructurer Genesis en architecture features-based

---

## 🎯 OBJECTIF

Passer d'une structure Next.js standard à une architecture propre par features, où chaque feature est autonome avec ses propres components, hooks, actions, et stores.

---

## 📊 ÉTAT ACTUEL (AVANT MIGRATION)

### Structure actuelle
```
src/
├── app/                    # Routes Next.js
├── components/            # Tous les composants mélangés
│   ├── ui/               # Composants réutilisables
│   ├── pins/             # Feature pins
│   ├── world/            # Feature world editor
│   ├── character/        # Feature character
│   ├── lore/             # Feature lore
│   ├── gallery/          # Feature gallery
│   ├── comments/         # Feature comments
│   ├── search/           # Feature search
│   ├── presence/         # Feature presence
│   ├── export/           # Feature export
│   ├── import/           # Feature import
│   ├── create/           # Feature create world
│   ├── explore/          # Feature explore
│   ├── home/             # Feature home
│   ├── members/          # Feature members
│   ├── versions/         # Feature versions
│   ├── worlds/           # Feature worlds list
│   ├── logic/            # Hooks partagés (??)
│   └── providers/        # Providers
│
├── actions/              # Server Actions (toutes mélangées)
│   ├── auth.ts
│   ├── worlds.ts
│   ├── pins.ts
│   ├── characters.ts
│   ├── lore.ts
│   ├── gallery.ts
│   ├── comments.ts
│   ├── search.ts
│   ├── presence.ts
│   ├── versions.ts
│   ├── layers.ts
│   ├── regions.ts
│   ├── tags.ts
│   ├── invites.ts
│   ├── migrations.ts
│   ├── export.ts
│   └── import.ts
│
├── store/                # Zustand stores (tous mélangés)
│   ├── use-pins-store.ts
│   ├── use-lore-store.ts
│   ├── use-comments-store.ts
│   ├── use-search-store.ts
│   ├── use-floating-panels-store.ts
│   ├── use-versions-store.ts
│   ├── use-ui-store.ts
│   ├── map-store.ts
│   ├── use-character-store.ts
│   ├── use-gallery-store.ts
│   └── history-store.ts
│
├── hooks/                # Global hooks
│   ├── use-autosave.ts
│   └── use-keyboard-shortcut.ts
│
└── lib/                  # Utilitaires
    ├── auth.ts
    ├── db.ts
    └── utils.ts
```

### Problèmes actuels
- ❌ Server Actions mélangés dans /actions/
- ❌ Stores mélangés dans /store/
- ❌ Pas de séparation claire entre shared et feature-specific
- ❌ Imports complexes: `from "@/components/world/ui/docks/layers-panel"`

---

## 🚀 STRUCTURE CIBLE (FEATURES-BASED)

```
src/
├── app/                              # Routes Next.js (inchangé)
│
├── features/                         # 🎯 NOUVEAU - Features autonomes
│
│   ├── auth/                         # Feature: Authentication
│   │   ├── components/              # Composants auth
│   │   │   ├── signin-form.tsx
│   │   │   └── signup-form.tsx
│   │   ├── hooks/                   # Hooks auth
│   │   │   ├── use-auth.ts
│   │   │   └── use-session.ts
│   │   ├── actions/                 # Server Actions auth
│   │   │   ├── signIn.ts
│   │   │   ├── signOut.ts
│   │   │   └── signUp.ts
│   │   └── index.ts                 # Barrel export
│   │
│   ├── worlds/                       # Feature: Worlds management
│   │   ├── components/
│   │   │   ├── world-card.tsx
│   │   │   ├── world-list.tsx
│   │   │   ├── world-form.tsx
│   │   │   └── world-settings.tsx
│   │   ├── hooks/
│   │   │   ├── use-worlds.ts
│   │   │   ├── use-world-data.ts
│   │   │   └── use-world-permissions.ts
│   │   ├── actions/
│   │   │   ├── get-worlds.ts
│   │   │   ├── create-world.ts
│   │   │   ├── update-world.ts
│   │   │   └── delete-world.ts
│   │   └── index.ts
│   │
│   ├── world-editor/                 # Feature: Map editor (world/* actuel)
│   │   ├── components/
│   │   │   ├── docks/               # UI docks
│   │   │   │   ├── layers-panel/
│   │   │   │   │   ├── layers-panel.tsx
│   │   │   │   │   ├── layer-list.tsx
│   │   │   │   │   ├── layer-item.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── pin-details-panel/
│   │   │   │   │   ├── pin-details-panel.tsx
│   │   │   │   │   ├── pin-info-section.tsx
│   │   │   │   │   ├── pin-gallery-section.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── permissions-panel/
│   │   │   │       ├── permissions-panel.tsx
│   │   │   │       └── index.ts
│   │   │   ├── map-canvas/          # Map rendering
│   │   │   │   ├── world-client.tsx
│   │   │   │   └── map-viewer.tsx
│   │   │   └── floating-panels/     # Floating UI
│   │   ├── hooks/
│   │   │   ├── use-layers-management.ts
│   │   │   ├── use-map-interactions.ts
│   │   │   ├── use-map-initialization.ts
│   │   │   ├── use-viewport.ts
│   │   │   └── use-autosave.ts
│   │   ├── actions/                 # Server Actions
│   │   │   ├── get-world-data.ts
│   │   │   ├── update-layers.ts
│   │   │   └── manage-permissions.ts
│   │   ├── store/                   # Zustand stores
│   │   │   ├── map-store.ts
│   │   │   ├── use-layers-store.ts
│   │   │   └── use-floating-panels-store.ts
│   │   └── index.ts
│   │
│   ├── pins/                         # Feature: Pins/markers
│   │   ├── components/
│   │   │   ├── pin-marker.tsx
│   │   │   ├── icon-picker/
│   │   │   │   ├── pin-icon-picker.tsx
│   │   │   │   ├── icon-data.ts
│   │   │   │   ├── components/
│   │   │   │   └── index.ts
│   │   │   ├── gallery-section/
│   │   │   │   ├── pin-gallery-section.tsx
│   │   │   │   ├── gallery-upload-zone.tsx
│   │   │   │   ├── gallery-grid.tsx
│   │   │   │   └── index.ts
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── use-pins.ts
│   │   │   ├── use-pin-drag.ts
│   │   │   ├── use-pin-mutations.ts
│   │   │   └── ... (13 hooks existants)
│   │   ├── actions/                 # From pins/methods/
│   │   │   ├── get-pins.ts
│   │   │   ├── create-pin.ts
│   │   │   ├── update-pin.ts
│   │   │   └── delete-pin.ts
│   │   ├── store/
│   │   │   ├── use-pins-store.ts
│   │   │   └── selectors.ts
│   │   └── index.ts
│   │
│   ├── characters/                   # Feature: Characters RPG
│   │   ├── components/
│   │   │   ├── character-card.tsx
│   │   │   ├── character-detail.tsx
│   │   │   ├── character-form.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   └── use-characters.ts
│   │   ├── actions/                 # From character/methods/
│   │   │   ├── get-characters.ts
│   │   │   ├── create-character.ts
│   │   │   └── ...
│   │   ├── store/
│   │   │   └── use-character-store.ts
│   │   └── index.ts
│   │
│   ├── lore/                         # Feature: Lore/wiki
│   │   ├── components/
│   │   │   ├── lore-card.tsx
│   │   │   ├── lore-detail.tsx
│   │   │   └── lore-form.tsx
│   │   ├── hooks/
│   │   │   ├── use-lore.ts
│   │   │   └── use-lore-categories.ts
│   │   ├── actions/                 # From lore/methods/
│   │   ├── store/
│   │   │   └── use-lore-store.ts
│   │   └── index.ts
│   │
│   ├── gallery/                      # Feature: Image gallery
│   │   ├── components/
│   │   │   ├── image-card.tsx
│   │   │   ├── image-lightbox.tsx
│   │   │   └── upload-zone.tsx
│   │   ├── hooks/
│   │   │   ├── use-gallery.ts
│   │   │   ├── use-image-upload.ts
│   │   │   └── use-gallery-pagination.ts
│   │   ├── actions/                 # From gallery/methods/
│   │   ├── store/
│   │   │   └── use-gallery-store.ts
│   │   └── index.ts
│   │
│   ├── comments/                     # Feature: Comments
│   │   ├── components/
│   │   │   ├── comment-thread.tsx
│   │   │   ├── comment-item.tsx
│   │   │   └── comment-form.tsx
│   │   ├── hooks/
│   │   │   ├── use-comments.ts
│   │   │   └── use-comment-mutations.ts
│   │   ├── actions/                 # From comments/methods/
│   │   ├── store/
│   │   │   └── use-comments-store.ts
│   │   └── index.ts
│   │
│   ├── search/                       # Feature: Search
│   │   ├── components/
│   │   │   ├── search-bar.tsx
│   │   │   ├── search-results.tsx
│   │   │   └── search-filter.tsx
│   │   ├── hooks/
│   │   │   └── use-search.ts
│   │   ├── actions/                 # From search/methods/
│   │   ├── store/
│   │   │   └── use-search-store.ts
│   │   └── index.ts
│   │
│   ├── presence/                     # Feature: Real-time collaboration
│   │   ├── components/
│   │   │   ├── presence-indicator.tsx
│   │   │   └── cursor-tracker.tsx
│   │   ├── hooks/
│   │   │   ├── use-presence.ts
│   │   │   └── use-cursors.ts
│   │   ├── actions/                 # From presence/methods/
│   │   └── index.ts
│   │
│   ├── export/                       # Feature: Export maps
│   │   ├── components/
│   │   │   └── export-dialog.tsx
│   │   ├── hooks/
│   │   │   └── use-export.ts
│   │   ├── actions/
│   │   └── index.ts
│   │
│   ├── import/                       # Feature: Import data
│   │   ├── components/
│   │   │   └── import-dialog.tsx
│   │   ├── hooks/
│   │   │   └── use-import.ts
│   │   ├── actions/
│   │   └── index.ts
│   │
│   └── versions/                     # Feature: Version history
│       ├── components/
│       │   └── version-list.tsx
│       ├── hooks/
│       │   └── use-versions.ts
│       ├── actions/
│       ├── store/
│       │   └── use-versions-store.ts
│       └── index.ts
│
├── shared/                           # 🎯 NOUVEAU - Code partagé
│
│   ├── ui/                          # Composants réutilisables atomiques
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── card.tsx
│   │   ├── toast.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── label.tsx
│   │   └── index.ts                 # Barrel export
│   │
│   ├── hooks/                       # Hooks globaux réutilisables
│   │   ├── use-debounce.ts
│   │   ├── use-throttle.ts
│   │   ├── use-media-query.ts
│   │   ├── use-local-storage.ts
│   │   └── index.ts
│   │
│   ├── utils/                       # Utilitaires purs
│   │   ├── cn.ts                    # ClassNames utility
│   │   ├── format.ts                # Formatage (date, currency, etc.)
│   │   ├── validation.ts            # Validators
│   │   └── index.ts
│   │
│   └── lib/                         # Bibliothèques externes
│       ├── db.ts                    # Prisma client
│       ├── auth.ts                  # NextAuth config
│       └── index.ts
│
└── config/                          # Configuration
    ├── site.ts                      # Site config
    └── ...
```

---

## 📋 PLAN DE MIGRATION

### ÉTAPE 1: PRÉPARATION (15 min)

1.1. Créer la nouvelle structure de dossiers
```bash
mkdir -p src/features
mkdir -p src/shared/ui
mkdir -p src/shared/hooks
mkdir -p src/shared/utils
mkdir -p src/shared/lib
```

1.2. Commit actuel comme "Pre-migration state"
```bash
git add .
git commit -m "WIP: Pre-migration state - refactors completed"
```

---

### ÉTAPE 2: MIGRATION FEATURES (2-3 heures)

**Ordre de migration (du moins dépendant au plus dépendant):**

#### 2.1. Features simples (sans dépendances)

**export/**
```bash
mv src/components/export src/features/export
mv src/actions/export.ts src/features/export/actions/
```

**import/**
```bash
mv src/components/import src/features/import
mv src/actions/import.ts src/features/import/actions/
```

**versions/**
```bash
mv src/components/versions src/features/versions
mv src/actions/versions.ts src/features/versions/actions/
mv src/store/use-versions-store.ts src/features/versions/store/
```

**home/**
```bash
mv src/components/home src/features/home
```

**explore/**
```bash
mv src/components/explore src/features/explore
```

**create/**
```bash
mv src/components/create src/features/create
```

**members/**
```bash
mv src/components/members src/features/members
```

**worlds/**
```bash
mv src/components/worlds src/features/worlds
mv src/actions/worlds.ts src/features/worlds/actions/
```

#### 2.2. Features moyennes (avec quelques dépendances)

**search/**
```bash
mv src/components/search src/features/search
mv src/actions/search.ts src/features/search/actions/
mv src/store/use-search-store.ts src/features/search/store/
```

**presence/**
```bash
mv src/components/presence src/features/presence
mv src/actions/presence.ts src/features/presence/actions/
```

**comments/**
```bash
mv src/components/comments src/features/comments
mv src/actions/comments.ts src/features/comments/actions/
mv src/store/use-comments-store.ts src/features/comments/store/
```

**lore/**
```bash
mv src/components/lore src/features/lore
mv src/actions/lore.ts src/features/lore/actions/
mv src/store/use-lore-store.ts src/features/lore/store/
```

**gallery/**
```bash
mv src/components/gallery src/features/gallery
mv src/actions/gallery.ts src/features/gallery/actions/
mv src/store/use-gallery-store.ts src/features/gallery/store/
```

**characters/**
```bash
mv src/components/character src/features/characters
mv src/actions/characters.ts src/features/characters/actions/
mv src/store/use-character-store.ts src/features/characters/store/
```

#### 2.3. Features complexes (avec beaucoup de dépendances)

**pins/**
```bash
mv src/components/pins src/features/pins
mv src/actions/pins.ts src/features/pins/actions/
mv src/store/use-pins-store.ts src/features/pins/store/
```

**world-editor/**
```bash
mv src/components/world src/features/world-editor
mv src/actions/layers.ts src/features/world-editor/actions/
mv src/actions/regions.ts src/features/world-editor/actions/
mv src/actions/tags.ts src/features/world-editor/actions/
mv src/actions/invites.ts src/features/world-editor/actions/
mv src/store/map-store.ts src/features/world-editor/store/
mv src/store/use-floating-panels-store.ts src/features/world-editor/store/
mv src/store/history-store.ts src/features/world-editor/store/
```

---

### ÉTAPE 3: MIGRATION SHARED (30 min)

#### 3.1. UI components
```bash
mv src/components/ui/* src/shared/ui/
```

#### 3.2. Global hooks
```bash
mv src/hooks/* src/shared/hooks/
```

#### 3.3. Lib
```bash
mv src/lib/* src/shared/lib/
```

#### 3.4. Logic shared
```bash
mv src/components/logic/* src/shared/hooks/  # Si contient des hooks
```

---

### ÉTAPE 4: NETTOYAGE (15 min)

#### 4.1. Supprimer anciens dossiers vides
```bash
# Supprimer src/components/ (maintenant vide)
rm -rf src/components

# Supprimer src/actions/ (maintenant vide)
rm -rf src/actions

# Supprimer src/store/ (maintenant vide)
rm -rf src/store

# Supprimer src/hooks/ (maintenant vide)
rm -rf src/hooks
```

#### 4.2. Supprimer src/lib/ (déplacé)
```bash
rm -rf src/lib
```

---

### ÉTAPE 5: MISE À JOUR DES IMPORTS (2-3 heures)

**C'est l'étape la plus critique.** 300+ fichiers à mettre à jour.

#### 5.1. Imports vers features
```bash
# Avant
import { PinMarker } from "@/components/pins/ui/pin-marker"
import { getPin } from "@/actions/pins"

# Après
import { PinMarker } from "@/features/pins"
import { getPin } from "@/features/pins/actions"
```

#### 5.2. Imports vers shared
```bash
# Avant
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

# Après
import { Button } from "@/shared/ui"
import { cn } from "@/shared/utils"
```

#### 5.3. Imports vers stores
```bash
# Avant
import { usePinsStore } from "@/store/use-pins-store"

# Après
import { usePinsStore } from "@/features/pins/store"
```

**Automatisation possible avec:**
```bash
# Utiliser sed ou ast-grep pour remplacer les imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/pins|@/features/pins|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/ui|@/shared/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/lib/utils|@/shared/utils|g'
```

---

### ÉTAPE 6: CRÉATION DES BARREL EXPORTS (1 heure)

Chaque feature doit avoir un `index.ts` propre:

**Exemple - features/pins/index.ts:**
```typescript
// Components
export { PinMarker } from "./components/pin-marker"
export { PinIconPicker } from "./components/icon-picker"
// ... tous les composants

// Hooks
export { usePins } from "./hooks/use-pins"
// ... tous les hooks

// Actions
export { getPins, createPin } from "./actions"
// ... toutes les actions

// Store
export { usePinsStore } from "./store"
```

**Exemple - shared/ui/index.ts:**
```typescript
export { Button } from "./button"
export { Input } from "./input"
export { Textarea } from "./textarea"
export { Dialog } from "./dialog"
// ... etc
```

---

### ÉTAPE 7: VALIDATION (30 min)

#### 7.1. TypeScript compilation
```bash
npm run typecheck
```

#### 7.2. Linting
```bash
npm run lint
```

#### 7.3. Tests
```bash
npm run test
```

#### 7.4. Build
```bash
npm run build
```

#### 7.5. Dev server
```bash
npm run dev
# Vérifier que l'app fonctionne
```

---

### ÉTAPE 8: AJUSTEMENTS (Variable)

Corriger les erreurs de compilation/import manuelles.

---

## ⚙️ AUTOMATISATION POSSIBLE

### Script de migration (Bash)

```bash
#!/bin/bash
# migration.sh

echo "🚀 Starting migration to features-based structure..."

# Step 1: Create directories
echo "📁 Creating new directories..."
mkdir -p src/features
mkdir -p src/shared/{ui,hooks,utils,lib}

# Step 2: Move features
echo "📦 Moving features..."

# Simple features
mv src/components/export src/features/export
mv src/components/import src/features/import
mv src/components/versions src/features/versions
mv src/components/home src/features/home
mv src/components/explore src/features/explore
mv src/components/create src/features/create
mv src/components/members src/features/members
mv src/components/worlds src/features/worlds

# Medium features
mv src/components/search src/features/search
mv src/components/presence src/features/presence
mv src/components/comments src/features/comments
mv src/components/lore src/features/lore
mv src/components/gallery src/features/gallery
mv src/components/character src/features/characters

# Complex features
mv src/components/pins src/features/pins
mv src/components/world src/features/world-editor

# Step 3: Move shared
echo "📦 Moving shared..."
mv src/components/ui/* src/shared/ui/
mv src/hooks/* src/shared/hooks/
mv src/lib/* src/shared/lib/

# Step 4: Clean up
echo "🧹 Cleaning up..."
rm -rf src/components
rm -rf src/actions  # After moving actions to features
rm -rf src/store    # After moving stores to features

# Step 5: Update imports (basic)
echo "🔄 Updating imports..."
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/pins|@/features/pins|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/character|@/features/characters|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/world|@/features/world-editor|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/ui|@/shared/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/lib/utils|@/shared/utils|g'

echo "✅ Migration complete!"
echo "⚠️  Please run: npm run typecheck && npm run lint && npm run build"
```

---

## 🎯 CRITÈRES DE SUCCÈS

- [ ] Tous les fichiers déplacés dans `src/features/` ou `src/shared/`
- [ ] Anciens dossiers (components/, actions/, store/, hooks/, lib/) supprimés
- [ ] Tous les imports mis à jour
- [ ] TypeScript compile sans erreurs
- [ ] ESLint passe
- [ ] Tous les tests passent
- [ ] Build réussit
- [ ] App fonctionne en dev

---

## 📊 ESTIMATION

| Étape | Durée |
|-------|-------|
| Préparation | 15 min |
| Migration features | 2-3 heures |
| Migration shared | 30 min |
| Nettoyage | 15 min |
| Mise à jour imports | 2-3 heures |
| Barrel exports | 1 heure |
| Validation | 30 min |
| Ajustements | Variable (1-2 heures) |
| **TOTAL** | **8-11 heures** |

---

## 🚨 RISQUES

- **Imports cassés:** 300+ fichiers à mettre à jour
- **Dépendances circulaires:** Possibles après restructuration
- **Tests cassés:** Chemins d'import incorrects
- **Build fail:** TypeScript erreurs

**Mitigation:**
- Commit avant migration
- Tester par feature
- Validation continue

---

## 📋 POST-MIGRATION

Une fois la migration terminée:

1. ✅ Continuer le refactor des composants > 200 lignes
2. ✅ Compléter les tests coverage
3. ✅ Optimiser TanStack Query
4. ✅ Améliorer la documentation

---

**Status:** 📝 Plan prêt pour exécution
**Next Step:** Créer le script de migration et exécuter
