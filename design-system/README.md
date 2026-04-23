# Claude Code Radar — Design System

A design system for **Claude Code Radar** (aka `claude-code-dashboard`), a Korean-language community dashboard that surfaces the official Claude Code changelog as a searchable, filterable, scorable feed.

> This design system was built against the **zhfvkqHub/claude-code-dashboard** Next.js repo. It is an **unofficial community product** — not an Anthropic artifact. It borrows its neutral palette (stone) and accent (amber) from the dashboard, and its editorial voice (Fraunces display type) from the repo's globals.css.

---

## Index

| File / Folder | Purpose |
|---|---|
| `README.md` | You are here — product context, content & visual foundations, iconography |
| `SKILL.md` | Agent-skill front-matter for use inside Claude Code / other skill runners |
| `colors_and_type.css` | All CSS vars: color scale, semantic tokens, type scale |
| `assets/` | Logos and brand marks (SVG, lucide icons) |
| `preview/` | Individual design-system cards registered into the Design System tab |
| `ui_kits/radar/` | React/JSX recreation of the Radar dashboard — header, controls, rows, modal |
| `repo/` | Full import of the source Next.js project for reference (do not ship) |

**Sources this system was built from:**
- GitHub: `zhfvkqHub/claude-code-dashboard@main`
- Imported files: `repo/app/globals.css`, `repo/components/*.tsx`, `repo/lib/*.ts`, `repo/data/features.json`
- Live doc the product wraps: https://code.claude.com/docs/en/changelog

---

## Product context

**What it is.** A static (ISR every 6h) Next.js 15 / Tailwind 4 dashboard that reads `data/features.json` and renders it as a filterable list of Claude Code changelog entries. Built for the Korean-speaking Claude Code community.

**Who it's for.** Korean developers who use Claude Code and want to quickly triage "what changed, what matters, and is it easy to use?" without reading prose release notes.

**One surface.** There is exactly one screen: a header, a sticky control bar (search + sort + filter + count), a list of feature rows, and a modal that opens when you click a row. No settings, no auth, no separate pages. A tiny product.

**Data shape.** Each feature has `title`, `summary`, `details`, `category` (one of six), `date`, `version`, `importance` 1–5, `usability` 1–5, `tags[]`, `docUrl`.

**Categories** (order matters — this is how they appear in filter chips):
1. `core` — 핵심 기능 — amber
2. `productivity` — 생산성 — emerald
3. `integration` — 통합/연동 — sky
4. `platform` — 플랫폼/배포 — violet
5. `security` — 보안/권한 — rose
6. `dx` — 개발자 경험 — orange

**Sort modes:** `date` (default, 최신순), `importance` (중요도), `usability` (사용성).

---

## Content fundamentals

The product is **Korean-first**. All UI copy, feature titles, summaries, and details are written in Korean. English appears only as (a) product identifiers (`Claude Code Radar`, version strings like `v2.1.116`, tag slugs like `resume`, `mcp`), and (b) the brand name itself.

### Voice

- **Terse, declarative, scan-first.** Titles are full sentences or noun phrases with a verb — "`/resume 대형 세션 성능 대폭 개선`" (not "Improved performance on large sessions with /resume"). Summaries compress *what changed + why you'd care* into one or two clauses joined by a period.
- **No first or second person.** The copy never addresses the reader (`you`/`당신`) and never speaks for the product (`we`/`우리`). It states facts: "40MB 이상 세션에서 최대 67% 빠른 `/resume`."
- **Numbers are proof.** When a feature has a measurable delta (67%, 40MB, 50MB), put it in the summary. Specifics build trust.
- **Backticks for identifiers.** Slash commands (`/resume`, `/branch`, `/reload-plugins`), filenames, flag names — always monospace via backticks in the source, rendered in `--font-mono`.

### Tone

Editorial-neutral. Not cheerful. Not corporate. Closest to a well-edited Hacker News post or a release-note changelog written by an engineer. No exclamation marks. No emoji anywhere in product copy. The Fraunces display face does the personality; the words stay flat.

### Casing

- **Korean:** standard orthography — no all-caps, no title case (Korean doesn't have case).
- **English product names:** as-branded — `Claude Code`, `MCP`, `VS Code`, `Cursor`, `Windsurf`, `Vercel`, `GitHub`.
- **Eyebrows / micro labels in the UI** (category labels on cards): uppercase with `letter-spacing: 0.15em`, rendered in mono. *This is a visual treatment, not a copy rule — the source string is still lowercase.*

### Examples pulled from the data

| Title | Summary |
|---|---|
| `/resume 대형 세션 성능 대폭 개선` | 40MB 이상 세션에서 최대 67% 빠른 `/resume`. dead-fork 항목이 많은 세션도 효율적 처리. |
| `MCP 서버 병렬 시작 최적화` | 다수의 stdio MCP 서버 설정 시 시작 속도 개선. `resources/templates/list`를 첫 @-mention까지 지연. |
| `IDE 터미널 풀스크린 스크롤 개선` | VS Code, Cursor, Windsurf 터미널에서 부드러운 풀스크린 스크롤. `/terminal-setup`으로 에디터 스크롤 감도 설정. |

### Writing a new feature entry

1. Title: Korean noun phrase ending in a verb-derived noun (`개선`, `추가`, `지원`, `최적화`, `수정`). Lead with the identifier if there is one.
2. Summary: 1–2 sentences. First sentence = headline fact with a number if possible. Second (optional) = a concrete knob, flag, or side-benefit.
3. Details: 1–3 sentences for the modal. Can reference related changes or caveats.
4. Tags: 2–4 lowercase English slugs. Prefer the noun form of the thing: `mcp`, `performance`, `session`, not `faster-mcp`.

---

## Visual foundations

### Palette philosophy

Warm neutrals (`stone-*`) on a near-white page (`#fafaf9`). **One** saturated accent — amber (`#f59e0b`) — used sparingly for CTAs, active states, and the `core` category. Every other category gets its own hue, but those hues appear only as a 6px dot + a subdued light-bg chip — they never run the full page.

The dashboard is **strictly light mode**. The repo's `globals.css` hard-codes `color-scheme: light` and the page background. Do not build dark-mode variants without asking.

### Type

Three faces, each with a job:

- **Fraunces → IBM Plex Sans KR.** Previous iteration used Fraunces (display), Inter Tight (body). Replaced with **IBM Plex Sans KR** for both display and body — refined, low-contrast, calmer Korean-first sans. **JetBrains Mono** stays for version/date/score/tag mono needs.

### Spacing & layout

4px-based spacing. Container is `max-w-5xl` (1024px) with `px-5 sm:px-8` (20–32px gutters). Vertical rhythm is loose: header `py-5`, control bar `py-4`, main `py-6`, footer `py-8`. The list itself is a tight `gap-1` (4px) — rows lean on hover background, not spacing, for separation.

### Borders, corners, surfaces

- **Radii:** `rounded-lg` (8px) for inputs, buttons, and rows. `rounded-xl` (12px) for the modal. `rounded-md` (6px) for small inline chips. `rounded-sm` (2px) for monospace tag chips. `rounded-full` for the category dots and score pills.
- **Borders:** hairline `1px solid var(--border-hair)` — `#e7e5e4`. Stronger `#d6d3d1` on inputs and interactive controls. No double-borders, no shadow-plus-border combos except on the modal.
- **Cards / surfaces:** white (`#ffffff`) on the page bg. Lift happens via `hover:shadow-sm` on rows, `shadow-2xl` on the modal — no elevated cards at rest.

### Shadows

Minimal. Three levels:
- `shadow-sm` — subtle row hover.
- `shadow-md` — not much used; reserved for future menus.
- `shadow-2xl` on the modal (`0 25px 50px -12px rgba(0,0,0,0.25)` Tailwind default).

No inner shadows, no colored glow shadows, no neumorphism.

### Background treatment

Flat. No gradients except the 2px top accent stripe on high-importance (≥5) feature cards — `bg-gradient-to-r from-transparent via-amber-400 to-transparent`. No textures, no noise, no patterns, no imagery. The product is information, not atmosphere.

### Hover / press / focus

- **Hover row:** transparent → white bg, transparent → `border-stone-200` border, `shadow-sm` appears. Title color shifts from `stone-900` → `amber-800`. The right-chevron arrow shifts from `stone-300` → `amber-500`. Transition `transition-all` (~150ms).
- **Hover button (accent):** `amber-500` → `amber-600`. No scale, no shadow.
- **Hover button (ghost):** text `stone-600` → `stone-900`, bg transparent → `stone-50`.
- **Active sort button:** solid `bg-amber-500 text-white`. Inactive siblings sit on white with `text-stone-600`.
- **Focus rings:** `focus:ring-2 focus:ring-amber-500/20` + `focus:border-amber-500` on inputs. Outline-none elsewhere — the ring is the indicator.
- **Press:** no explicit press state. The UI is quiet.

### Transitions & animation

- Everything animates on `transition-all` or `transition-colors` at ~150–200ms with default Tailwind easing.
- Two named keyframes in `globals.css`:
  - `fade-in` (0.2s ease-out) — modal backdrop.
  - `slide-up` (0.25s ease-out, translateY 16px + scale 0.98 → 0) — modal content entering.
- No bounce, no spring, no scale-on-hover on interactive elements. Cards in the unused `FeatureCard.tsx` variant have `hover:scale-[1.01]` but the shipped `FeatureRow` does not.

### Transparency & blur

Used in exactly two places:
- Sticky control bar: `bg-stone-50/95 backdrop-blur-md` — near-opaque with a faint blur so content slides under legibly.
- Modal backdrop: `bg-stone-900/40 backdrop-blur-sm` — dims and softly blurs the list behind.

Elsewhere, surfaces are fully opaque.

### Importance / scoring treatments

- **Score bars:** 5 equal segments, 1.5–2px tall, `gap-0.5` between. Amber for importance, emerald for usability. Filled segments use the color; empty use `stone-200` (light) or `stone-800` (dark variant).
- **High-importance accent on rows:** `importance >= 4` gets a 3px left border in `amber-400`. This is the single strongest visual signal in the list.
- **Category eyebrow on cards:** `w-1.5 h-1.5` colored dot + 10px uppercase mono label.

### Imagery

There is none, and this is deliberate. The product has no hero images, no illustrations, no user avatars, no OG-image generator. The design system ships with placeholder tiles for when future surfaces need imagery — use warm, low-saturation photography or keep going without it.

---

## Iconography

All icons in the repo are **inline SVGs drawn in-place** in the component JSX — there is no icon library dependency in `package.json`. They are simple 1.5px-stroke line icons in `currentColor`, sized at 10–20px viewBox.

Four icons exist in the source, all one-off:

| Icon | Where | SVG strokes |
|---|---|---|
| Search | control bar input | circle + diagonal handle |
| Filter | filter toggle | three descending horizontal lines |
| External link | modal "공식 문서 보기" + card "공식문서" | arrow out of box (M…→) |
| Chevron / right | row arrow | `M6 4L10 8L6 12` |
| Close X | modal header | two diagonals |

### Our approach

Because the codebase doesn't use an icon library, we adopt **Lucide** (https://lucide.dev) as the closest match to the existing aesthetic — same 1.5px stroke weight, same `currentColor`, same round line caps. This is a **substitution, flagged below**. If a different icon set is preferred (Heroicons, Phosphor, custom), drop replacements into `assets/icons/` and update the UI kit.

- **Lucide via CDN:** `https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.js` for the full set, or cherry-picked SVGs in `assets/icons/`.
- **Inline SVGs from the repo** are mirrored into `assets/icons/` as `search.svg`, `filter.svg`, `external-link.svg`, `chevron-right.svg`, `x-close.svg` so prototypes can drop them in directly.

### Emoji, unicode, custom glyphs

- **No emoji.** Anywhere. The product is editorial and Korean — emoji noise would clash.
- **Unicode punctuation** (`·`, `—`, `→`) appears in the UI as visual separators — see `data.meta.currentVersion` spacer and the "이전" / "다음" modal buttons. Keep using them.
- **No custom mark / wordmark** yet. The product currently leans on a plain `<h1>Claude Code Radar</h1>`. Placeholder `CCR` monogram lives in `assets/logos/`.

### Logo

There is no official logo in the repo. The placeholder we ship is a monospace `CCR` monogram inside an amber square — see `assets/logos/ccr-mark.svg`. **Flagged** — ask the project owner for an official mark before production use.

---

## ⚠️ Substitutions & caveats

These choices were made because the source did not provide the real thing. Replace when possible:

1. **Logo** — no logo exists in the repo. Placeholder `CCR` monogram in `assets/logos/`.
2. **Icon library** — repo uses inline SVGs. We adopted Lucide as the closest stylistic match and mirrored the exact inline SVGs from the repo into `assets/icons/` so you can keep using them literally.
3. **Fonts** — IBM Plex Sans KR + JetBrains Mono served from Google Fonts. Original repo shipped Fraunces + Inter Tight; we swapped to IBM Plex Sans KR per user request for a less "Claude-typical", less chunky, Korean-native feel. Update `repo/app/layout.tsx` and `repo/app/globals.css` if syncing back.
4. **Dark mode** — the source `FeatureCard.tsx` component contains stone-900 bg / stone-100 text styling, but the shipped page runs `FeatureRow` on a light bg. Treat dark mode as *not supported* until confirmed.
5. **Imagery** — none in source. Don't invent any.

---
