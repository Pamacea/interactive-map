# Genesis

Plateforme web pour créer et partager des cartes interactives de mondes fantasy. Construis des cartes riches avec marqueurs personnalisables, wiki lore, galeries et collaboration temps réel.

**Problème :** Les outils de worldbuilding existants sont limités ou complexes
**Solution :** Éditeur de cartes interactif inspiré de League of Legends, avec drag & drop, couches multiples et collaboration

## Quick Start

```bash
npm install
cp .env.example .env  # Configure DATABASE_URL, NEXTAUTH_SECRET
npm run db:push
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Features

- **Cartes interactives** : Drag & drop de marqueurs, couches multiples, zoom/pan
- **Wiki Lore** : Entrées riches avec markdown, liens croisés et catégories
- **Personnages** : Stats RPG, relations, dialogue et inventaire
- **Collaboration** : Membres, permissions, présence et activité en temps réel
- **Export/Import** : PNG, PDF, JSON, GeoJSON

## Tech Stack

Next.js 16, TypeScript, Tailwind 4, Prisma, NextAuth, MapLibre, Zustand, TanStack Query

## Stats

- 100% des features core implémentées
- 98.92% couverture tests (pins)
- 11 modules fonctionnels

## Docs

- [CLAUDE.md](CLAUDE.md) - Architecture et patterns
- [PROGRESS.md](PROGRESS.md) - Statut détaillé features

## License

MIT
