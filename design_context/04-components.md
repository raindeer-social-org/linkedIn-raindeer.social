# 04 — Components

> Specs for every recurring element. Values reference tokens from `01` (color/shadow), `02` (type), `03` (motion), `05` (spacing). If a needed component is missing here, derive it from the closest spec and keep the geometry table in §1 sacred.

---

## 1. Geometry: the intentional radius scale

Uniform radius is an AI tell. Raindeer's roundness is mapped to component *class*:

| Class | Radius | Examples |
|---|---|---|
| Text & rules | 0 | underlines, hairlines, table rows |
| Controls | **10px** | buttons, inputs, selects, tabs container |
| Containers | **16px** | cards, panels, popovers |
| Stage | **24px** | modals, hero product frame, midnight band inner |
| Identity | **999px** | chips/tags, avatars, the node marker |

Never mix classes (no pill buttons, no 6px cards). Nested elements: inner radius = outer − padding (e.g. image inside a 16px card with 8px padding → 8px).

## 2. Icons

- Set: **Lucide**, 1.5px stroke, sizes 16 (inline/app) / 20 (buttons, nav) / 24 (feature moments).
- Color: inherit text color; never multi-color icons, never filled duotone, never emoji.
- Feature sections on marketing do **not** use icon-in-tinted-circle. Features are illustrated by real product crops or the Antler Graph — an icon may appear inline in the eyebrow at most.

## 3. Buttons

Height 44px (marketing) / 36px (app compact). Padding-x 20px / 14px. Type: sans 500, `--text-body` / `--text-small`. Radius 10px. Icon gap 8px.

| Variant | Idle | Hover | Notes |
|---|---|---|---|
| **Primary** | bg `--cobalt-600`, text white | `--cobalt-700`, −1px lift, `--shadow-cta` | One per view. Hero CTA may use G1 gradient + magnetic (`03 §6`) |
| **Secondary** | bg `--snow-card`, 1px `--hairline-bold`, text `--ink` | border `--ink-4`, bg `--snow-2` | The workhorse |
| **Ghost** | text `--ink-2`, transparent | bg `--snow-2`, text `--ink` | Toolbars, table actions |
| **Destructive** | bg `--negative`, white | darken 8% | Confirm dialogs only |
| **On-midnight** | 1px `--midnight-line`, text `--midnight-ink` | bg `--midnight-card` | Midnight band secondary; primary stays cobalt-600 |

Loading: label fades to 0, three-node ellipsis (mini Antler nodes) pulses in place; width locked. Disabled: `--snow-3` bg, `--ink-4` text.

## 4. Inputs & forms

- Field: 44px (marketing) / 38px (app), radius 10px, bg `--snow-card`, 1px `--hairline-bold`, text `--ink`, placeholder `--ink-3` (never lighter).
- Label above, sans 500 `--text-small` `--ink`; helper below in `--ink-3`; error swaps helper to `--negative` + border `--negative` (no shake animations).
- Focus per `01 §8` + ring growth per `03 §6`.
- Textareas (composer): min-height 120px, line-height 1.6.
- Selects/dropdown menus: popover = container class (16px radius, `--shadow-md`, 1px `--hairline`), items 36px, hover `--snow-2`, selected `--cobalt-50` bg + `--cobalt-700` text + 6px node dot on the left.
- Search: leading 16px icon in `--ink-3`; `⌘K` hint in mono `--text-micro` inside a 4px-radius `--snow-2` key cap.

## 5. Cards

Base: bg `--snow-card`, 1px `--hairline`, radius 16px, `--shadow-sm` (interactive) or flat (static), padding 24px (marketing) / 20px (app).

- **Feature card (marketing):** media zone (product crop or Antler fragment) top with inner radius rule, then eyebrow → sans 600 title → 2-line body `--ink-2`. No icons-in-circles, no "Learn more →" unless it truly links.
- **Stat card (app):** eyebrow label (mono, `--ink-3`) → metric (mono `--text-metric-lg`, `--ink`) → delta chip (`▲ 12.4%` mono small in `--positive` on `--positive-wash`, radius 999) → 32px sparkline in `--cobalt-600` with G2 area fade. Counter animates per `03 §4.5`.
- **AI suggestion card:** the node marker (pulsing, 8px) top-left + eyebrow `RAINDEER SUGGESTS` in `--cobalt-600`; body is the suggested copy in serif italic `--text-subtitle`; actions: Primary "Use this" + Ghost "Regenerate". Left border: none — no colored left-border cards, ever.
- **Pricing card:** secondary style; the featured plan gets a 1.5px **G5 brass gradient border** (via border-image or wrapper) + a brass chip `MOST CHOSEN` — the one sanctioned brass moment on the page.

## 6. Chips, tags, badges

Radius 999. Height 24px, padding-x 10px, mono `--text-micro` uppercase +0.08em.
- Status: Draft `--snow-3`/`--ink-2` · Scheduled `--cobalt-50`/`--cobalt-700` · Published `--positive-wash`/`--positive` · Failed `--negative-wash`/`--negative` · Needs review `--caution-wash`/`--caution`.
- Topic tags: `--snow-2` bg, `--ink-2`, hairline border.
- "PRO": brass-500 text on `--snow-card`, 1px brass-300 border. Only brass use in-app.

## 7. Navigation

**Marketing header:** 76px, transparent over hero; condenses per `03 §5`. Left: logo (deer mark 28px + "raindeer." wordmark; "social" suffix in mono `--ink-3`). Center: 5 links max, sans 500 15px `--ink-2`, active = `--ink` + 6px node dot below (sliding, `03 §6`). Right: Ghost "Sign in" + Primary "Start free". Condensed state: bg `rgba(250,251,253,.85)` + `backdrop-blur(12px)` + bottom hairline — the only glass in the system.

**Footer:** midnight plate (G4). 4-column links in `--midnight-ink-2`, hover `--midnight-ink`. A large, faint ice-stroke Antler Graph occupies the right third. Bottom row: mono micro `© 2026 RAINDEER · DELHI ✦ EVERYWHERE`, legal links.

**App sidebar:** 264px (collapsible to 72px icon rail), bg `--snow-canvas`, right hairline. Sections: workspace switcher (top, card-style 44px), nav groups with mono micro group labels, items 38px radius 10px — active: `--cobalt-50` bg, `--cobalt-700` text, 20px icon. Bottom: usage meter + account. **App topbar:** 56px, bg `--snow-card`, bottom hairline: page title (serif 500 `--text-title`), breadcrumb mono micro, right: search, notification bell (dot badge `--cobalt-500`), avatar.

## 8. Tables (analytics, post lists)

- Container: card base, padding 0; header row bg `--snow-2`, mono `--text-micro` uppercase `--ink-3`, 40px.
- Rows 52px, bottom hairline, hover `--snow-2`; selected `--cobalt-50` + left inset 2px `--cobalt-500` (inset, not a floating border).
- Numeric columns right-aligned in mono tabular; entity cells: 28px avatar/thumb + sans 500 name + mono meta below.
- Sort: 12px chevron animates rotation 200ms. Sticky header on scroll with `--shadow-xs`.

## 9. Overlays

- **Modal:** stage class (24px radius, `--shadow-lg`), max-w 560px, scrim `rgba(14,27,58,.42)`; enter: scale .98→1 + fade 240ms `--ease-out`; scrim fades 200ms. Title serif 500 `--text-title`.
- **Drawer (post details):** right side 480px, same scrim, slides 320ms `--ease-cinema`.
- **Toast:** bottom-right, container class, `--shadow-md`, 1px hairline, leading status node (6px, semantic color), sans 500 + ghost action. Motion per `03 §8`.
- **Tooltip:** `--ink` bg, `--snow-card` text, radius 8px (exception: micro element), mono `--text-micro`, 6px/10px padding, 120ms fade, arrow-less.
- **Popover/command-K:** container class; results grouped by mono labels; selected row gets the node dot.

## 10. Product set-pieces (the app's identity)

### 10.1 Post composer
Two-pane stage: left = editor card (textarea per §4, toolbar of ghost icon-buttons, character counter in mono that shifts to `--caution` at 90% of LinkedIn's limit); right = **live LinkedIn preview** rendered faithfully inside a stage-radius frame on `--snow-2`, with device toggle chips. Below editor: AI toolbelt — ghost buttons "Rewrite hook", "Tighten", "Add CTA", each firing the generating state from `03 §8`. Voice/tone selector is a select showing the workspace's named voices.

### 10.2 Content calendar
Month grid: hairline cells on `--snow-canvas`, day numbers mono micro top-right, today = 6px cobalt node beside the number (not a filled cell). Posts = 24px pills (identity radius) with status color dot + truncated title, draggable per `03 §8`. Week view: hour rules hairline, "best time to post" bands = G2 at 6% alpha with a mono `PEAK` label.

### 10.3 Analytics overview
Top row: 4 stat cards (§5). Main chart card: 280px line/area chart — line `--cobalt-600` 2px, **data points are logo-style nodes** (white fill, cobalt stroke) appearing on hover, area = G2 fading to transparent, gridlines `--hairline` dashed 2/4, axis labels mono micro `--ink-3`. Tooltip per §9. Comparison series: `--glacier-500` dashed. Never rainbow charts — series order fixed by `01 §3`.

### 10.4 Audience/network view
The Railway-style "architecture at a glance" moment: contacts/companies as nodes sized by engagement, edges by interaction strength — literally the antler aesthetic as product. Canvas bg `--snow-canvas` with dot-grid (`--hairline` 1px dots, 24px pitch). Selected node: cobalt pulse ring.

### 10.5 Empty states
Centered, max-w 400px: a sparse 5-node Antler fragment (static, ice-stroke) → serif `--text-title` headline → one sentence `--ink-3` → one Primary action. Copy per `00 §8`. Never illustration mascots.

### 10.6 Skeletons
Bars of `--snow-3`, radius 6px, aurora shimmer sweep (G2 @10%) 1.6s. Skeleton shapes must match the real layout's geometry exactly.

## 11. Component QA checklist

- [ ] Radius matches the class table in §1
- [ ] Every state defined: hover, focus-visible, active, disabled, loading
- [ ] Focus ring per `01 §8` present and unclipped
- [ ] Numbers in mono; labels in sans; nothing serif below 18px
- [ ] No colored left-border cards, no icon-circles, no emoji, no glass (except condensed nav)
- [ ] Hit targets ≥ 44px marketing / ≥ 36px app; touch spacing ≥ 8px
