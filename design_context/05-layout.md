# 05 — Layout, Spacing & Page Architecture

> White space is raindeer's most expensive-looking material. This file defines the grid, the rhythm, and the page templates so generated layouts feel *edited*, not assembled.

---

## 1. Spacing scale (4px base — no off-scale values)

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 · 160
```

| Token | Value | Use |
|---|---|---|
| `--space-section` | `clamp(96px, 7vw + 40px, 160px)` | between marketing sections |
| `--space-section-sm` | `clamp(64px, 5vw + 24px, 96px)` | sub-sections, blog |
| `--space-stack-lg` | 32–40px | heading block → content |
| `--space-stack` | 16–24px | intra-component |
| `--space-app-gutter` | 24px | app page padding, card gaps |

Vertical rhythm law: eyebrow →8px→ heading →20px→ standfirst →40px→ content. Keep this exact triad everywhere it appears.

## 2. Containers & grid

```css
.container      { max-width: 1200px; margin-inline: auto; padding-inline: clamp(20px, 4vw, 48px); }
.container-wide { max-width: 1360px; }  /* hero figures, the network view, footer */
.container-prose{ max-width: 68ch;   }  /* blog & legal */
```

- Marketing composes on a **12-column grid, 24px gutters**. Text blocks occupy 5–7 columns, never 12; media may bleed to `container-wide` or full-bleed with `--snow-2` backing.
- App content area: fluid, max 1440px, `--space-app-gutter` padding; dashboards use a 12-col card grid with 20px gaps (stat cards span 3, main chart 8, side rail 4).

## 3. Asymmetry doctrine (marketing)

Centered-everything is the template look. Raindeer defaults to **editorial asymmetry**:

- Hero: text left-aligned in cols 1–7; hero figure occupies cols 6–13 (overlapping, layered above the atmosphere), creating a diagonal reading line. Center a hero only on the pricing page.
- Feature "spreads": alternate 5/7 and 7/5 text–media splits. Text column includes eyebrow+rule, display-3, body, and one inline text-link — no button per spread.
- Every page includes **one full-width typographic interlude**: a single serif statement at display-2 spanning cols 2–12, no media (e.g. "Your audience reads at 8:40am. So do we."). This is the broadsheet breath.
- Rules (1px hairlines) may structure a section *only* when they separate real content zones — never as decoration frames.

## 4. Marketing page templates

### 4.1 Home (raindeer.social)
1. **Nav** (`04 §7`)
2. **Hero** — atmosphere (dawn G3 + 2 blooms + grain) → eyebrow → display-1 (one italic serif word; optional single G1 keyword) → standfirst → Primary + Secondary CTA → hero figure: the app's calendar/composer in a stage-radius frame, `--shadow-lg`, slight −2° … 0° rotation settle on entrance. The Antler Graph draws itself sparsely behind the figure (`03 §4.2`).
3. **Logo strip** — "Trusted by teams posting daily", 6 grayscale-ink logos at 60% opacity, mono caption. No carousel.
4. **Feature spreads ×3** (§3) — each demonstrated with a real product crop as figure + mono caption (`02 §4.5`).
5. **Typographic interlude** (§3).
6. **Workflow chapter** — the pinned 01/02/03 scene (`03 §4.3`): Idea → Draft with AI → Schedule & learn.
7. **Proof** — one large pull-quote testimonial (`02 §4.3`) + a stat trio in mono (real numbers).
8. **Pricing teaser or integrations row** — LinkedIn-first; upcoming networks as ice-tint chips marked `SOON` in mono.
9. **Midnight CTA band** — G4 night sky, ice Antler constellation, serif display-2 in `--midnight-ink`, cobalt-600 primary CTA, one brass rule detail. Stage radius 24px inset within the canvas (a "plate", not an edge-to-edge slab).
10. **Footer** (`04 §7`).

### 4.2 linkedin.raindeer.social landing
Same skeleton, but: hero figure = composer with live LinkedIn preview; feature spreads = Hooks & rewriting · Best-time scheduling · Analytics that explain themselves; add a comparison table (secondary card, hairline rows) vs "posting natively". Keep LinkedIn's name in serif italic in the H1 per `02 §8`.

### 4.3 Pricing
Centered header (the exception) on dawn atmosphere → 3 plan cards (`04 §5`, brass-featured middle) → hairline feature matrix table → FAQ as an accordion of hairline rows (serif question 18px, chevron rotates 200ms) → midnight CTA.

### 4.4 Blog / editorial
This is where the newspaper fully expresses: prose container, serif display headline with drop cap (`02 §4.4`), mono dateline `DELHI — 14 JUL 2026`, figures with FIG. captions, pull quotes, and a hairline-ruled "More from the ledger" footer of 3 text-only links.

## 5. App shell (linkedin.raindeer.social)

```
┌──────────┬──────────────────────────────────────────┐
│ sidebar  │ topbar (56px)                            │
│ 264px    ├──────────────────────────────────────────┤
│          │ content — max 1440px, 24px padding       │
│          │   page title (serif) + actions row       │
│          │   card grid / table / composer stage     │
└──────────┴──────────────────────────────────────────┘
```

- Density: app line-height and paddings run one step tighter than marketing (`02 §3`, `04` compact sizes). No atmosphere blooms, no grain, no Lenis.
- The only serif on screen is the page title + big empty states — the brand whisper inside a working tool.
- Persistent "Raindeer is watching your queue" status: a small node marker in the topbar that pulses only while jobs run.

## 6. Breakpoints & responsive law

```
sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536
```

- Type is fluid (clamp) — breakpoints reflow *layout* only.
- <lg: feature spreads stack media-first; hero figure moves below text at full width; the 12-col grid collapses to 4.
- <md: nav → sheet menu (stage radius, from top, 320ms `--ease-cinema`); app sidebar → bottom tab bar (5 items, node-dot active indicator); tables → stacked "ledger rows" (entity + mono metrics right-aligned), calendar month → agenda list.
- Pinned scenes and magnetic hover are disabled <lg (touch); the hero timeline shortens to .8s total.
- Nothing horizontal-scrolls except the calendar week view and an optional testimonial rail — both with visible affordance.

## 7. Page-assembly checklist

- [ ] Section spacing uses `--space-section`; no ad-hoc margins between bands
- [ ] At least one asymmetric spread and one typographic interlude per marketing page
- [ ] Exactly one midnight plate, at the end; zero in the app
- [ ] Hero follows eyebrow→H1→standfirst→CTA order with the §1 rhythm triad
- [ ] Max two motion set-pieces per page (`03 §4`); at least one section is intentionally still
- [ ] 360px-wide render checked: no clipped serif headlines, no cramped chips
