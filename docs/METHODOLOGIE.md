# Méthodologie de Développement pour Genesis

## Architecture Principale

### Structure des Composants
Tous les composants suivent le pattern **ui/logic/methods** :

```
components/[feature]/
├── ui/          # Composants de présentation purs
├── logic/       # Hooks personnalisés, gestion d'état
└── methods/     # Appels API, transformations de données
```

### Séparation Server/Client Components
- **Server Components** : Par défaut, pour données statiques et SEO
- **Client Components** : Pour fonctionnalités interactives avec directive `"use client"`

### Gestion d'État
- **État Serveur** : TanStack Query
- **État Client** : Zustand
- **Formulaires** : React Hook Form + Zod

## Standards de Code

### TypeScript
- Typage strict, pas de `any`
- Validation Zod pour données externes
- Interfaces explicites pour les props

### Composants
- Fichiers en `kebab-case.tsx`
- Hooks en `use-[feature].ts`
- Actions en `[resource].ts`

### Qualité
- 80%+ de couverture de test pour logique métier
- Pas de `console.log`, utiliser logger approprié
- Gestion d'erreurs dans Server Actions

## Intégration UI avec ShadCN

### Composants de Base
- `Button` : Actions et interactions
- `Card` : Conteneurs de contenu
- `Dialog` : Modales et fenêtres
- `Input` : Champs de formulaire
- `Collapsible` : Sections rétractables

### Personnalisation
- Utilisation des variables CSS existantes :
  - Couleurs : `var(--color-*)`
  - Espacement : `var(--spacing-*)`
  - Typographie : `var(--font-*)`
- Classes utilitaires Tailwind pour layout

## Workflow de Développement

1. **Analyse** : Comprendre l'architecture existante
2. **Planification** : Définir composants ui/logic/methods
3. **Implémentation** : 
   - UI avec ShadCN
   - Logic avec hooks Zustand/TanStack
   - Methods avec Server Actions
4. **Tests** : Unitaires et intégration
5. **Validation** : Vérification typage et linting