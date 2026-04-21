# Radar UI Kit

React/JSX recreation of the Claude Code Radar dashboard. Load `index.html` to see a click-through of the single-screen product.

## Files

- `index.html` — mounts the Dashboard, loads all JSX files via Babel
- `utils.js` — category color meta, `relativeDate`, `formatDate` (Korean locale)
- `Header.jsx` — app header, sticky control bar, filter panel (Header / Controls / FilterPanel)
- `FeatureRow.jsx` — one row of the feature list with hover + importance-left-border state
- `FeatureModal.jsx` — opened-feature detail view with prev/next + keyboard nav
- `Dashboard.jsx` — top-level state + filter/sort/search logic
- `main.jsx` — mounts Dashboard with 8 sample features covering all 6 categories

## Demonstrated interactions

- Type in search → list filters live
- Click a sort button (최신순/중요도/사용성) → list re-sorts
- Click 필터 → expand category chips + min-importance buttons
- Click a row → modal opens
- In modal: ← / → arrow keys walk through results · Esc or click-outside closes

## What was copied vs. simplified

All visual tokens — colors, type, radii, shadows, spacing — were lifted from `repo/app/globals.css` and the Tailwind classes in the original components. Component structure mirrors `repo/components/{Dashboard,FeatureRow,FeatureModal}.tsx` but with:

- Tailwind → inline styles (so the kit runs without a build step)
- No TypeScript
- Inline sample data instead of importing the full 50-entry JSON

The dark-mode `FeatureCard.tsx` variant from the repo was intentionally not recreated — the shipped product runs the light `FeatureRow`.
