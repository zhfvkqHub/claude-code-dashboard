# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code Radar — a dashboard that displays the official Claude Code changelog in a readable, filterable format. Built with Next.js 15 (App Router) + Tailwind CSS 4, deployed on Vercel. Content is in Korean.

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint via Next.js
npm run fetch-changelog  # Fetch latest changelog from official docs (node scripts/fetch-changelog.mjs)
```

## Architecture

- **app/page.tsx** — Server component, imports feature data from JSON, uses ISR (6h revalidation)
- **components/Dashboard.tsx** — Client component with all filtering, searching, and sorting logic
- **components/FeatureCard.tsx** — Individual feature card display
- **data/features.json** — Single source of truth for all feature data (schema defined in `lib/types.ts`)
- **lib/types.ts** — TypeScript interfaces: `Feature`, `FeaturesData`, `CategoryId`, `SortMode`
- **lib/utils.ts** — Category color mapping and date formatting helpers
- **scripts/fetch-changelog.mjs** — Scrapes official changelog and updates `data/features.json`

## Data Flow

`data/features.json` → `app/page.tsx` (server, static import) → `Dashboard.tsx` (client, interactive filtering/sorting)

Data updates happen via the fetch script (manually or via GitHub Actions daily cron), not at runtime.

## Key Conventions

- Six categories: core, productivity, integration, platform, security, dx
- Feature scores: importance (1-5) and usability (1-5)
- Theme: dark editorial style with amber accents, defined in `app/globals.css` `@theme` block
- Fonts: Fraunces (display), Inter Tight (body), JetBrains Mono (mono)
