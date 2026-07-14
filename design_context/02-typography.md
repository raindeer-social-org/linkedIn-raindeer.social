# 02 — Typography: The Editorial Voice

> Type carries more of raindeer's personality than any other layer. The pairing below was chosen specifically; substituting "similar" fonts breaks the system.

---

## 1. The three faces

| Role | Face | Source | Why this one |
|---|---|---|---|
| **Display serif** — headlines, editorial moments | **Newsreader** (variable: `opsz` 6–72, `wght` 200–800, italic) | Google Fonts, free | Genuinely designed for news reading — real broadsheet DNA, high contrast at display optical sizes, elegant italics. Crucially it is **not** yet an AI-tool default the way Playfair Display and Instrument Serif have become |
| **Text sans** — body, UI, everything else | **Switzer** (variable 100–900 + italics) | Fontshare (Indian Type Foundry), free for commercial use | A precise neo-grotesque in the Helvetica Now register: premium-neutral, superb from 12px UI to 40px subheads, and absent from AI training-data defaults |
| **Data mono** — eyebrows, metrics, timestamps, tags, code | **Fragment Mono** (400 + italic) | Google Fonts, free | A Helvetica-flavored mono — editorial-technical, not "developer terminal." Gives numbers and labels a typeset-by-hand feel |

**Paid upgrade path** (when budget allows, drop-in replacements — same rules apply): Newsreader → **Tiempos Headline / Tiempos Text** (Klim); Switzer → **Söhne** (Klim). Do this only as a coordinated swap, never mixed.

**Explicitly banned:** Inter, Roboto, Arial, Helvetica (as a chosen face), Poppins, Montserrat, Space Grotesk, Playfair Display, Instrument Serif, Lora, DM Sans. If any of these appear in generated code, it is a defect.

## 2. Loading

```html
<!-- Newsreader + Fragment Mono (Google) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Fragment+Mono:ital@0;1&display=swap" rel="stylesheet">
<!-- Switzer (Fontshare) -->
<link href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700&display=swap" rel="stylesheet">
```

```css
:root {
  --font-serif: "Newsreader", "Tiempos Headline", Georgia, serif;
  --font-sans:  "Switzer", "Söhne", -apple-system, "Segoe UI", sans-serif;
  --font-mono:  "Fragment Mono", "Geist Mono", ui-monospace, monospace;
}
```

Next.js: load Newsreader + Fragment Mono via `next/font/google`; self-host Switzer via `next/font/local` (download the variable woff2 from Fontshare). Always `display: swap`, preload only the serif display weight used above the fold.

## 3. Fluid type scale (tokens — never freestyle sizes)

All sizes are `clamp()` so the editorial feel survives every viewport. Rem-based, 16px root.

```css
:root {
  /* MARKETING DISPLAY — Newsreader, opsz auto (variable) */
  --text-display-1: clamp(2.85rem, 1.6rem + 4.6vw, 6rem);      /* hero H1        */
  --text-display-2: clamp(2.2rem, 1.4rem + 2.6vw, 3.75rem);    /* section H2     */
  --text-display-3: clamp(1.65rem, 1.3rem + 1.2vw, 2.375rem);  /* feature H3     */

  /* WORKHORSE — Switzer */
  --text-title:    1.375rem;   /* app page titles (serif, see §5), card titles   */
  --text-subtitle: 1.125rem;   /* card headers, modal titles — sans 600          */
  --text-lede:     clamp(1.125rem, 1rem + .5vw, 1.375rem);  /* hero standfirst   */
  --text-body:     1rem;       /* marketing body                                  */
  --text-body-app: .9375rem;   /* app body (15px)                                 */
  --text-small:    .8125rem;   /* meta, captions (13px)                           */
  --text-micro:    .6875rem;   /* table headers, fine print (11px)                */

  /* DATA — Fragment Mono */
  --text-metric-lg: clamp(2rem, 1.5rem + 2vw, 3.25rem);  /* dashboard hero stat  */
  --text-eyebrow:  .75rem;                                /* kickers, uppercase   */
}
```

### Setting rules per role

| Role | Face / weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|
| display-1 | Serif 400 (opsz ≥ 60) | 1.02 | −0.015em | `--ink` |
| display-2 | Serif 400 | 1.08 | −0.012em | `--ink` |
| display-3 | Serif 450 | 1.15 | −0.008em | `--ink` |
| title (app) | Serif 500 | 1.2 | −0.005em | `--ink` |
| subtitle | Sans 600 | 1.3 | −0.005em | `--ink` |
| lede | Sans 400 | 1.5 | 0 | `--ink-2` |
| body | Sans 400 | 1.65 (marketing) / 1.55 (app) | 0 | `--ink-2` / `--ink` |
| small | Sans 400–500 | 1.5 | +0.002em | `--ink-3` |
| eyebrow | Mono 400 UPPERCASE | 1 | +0.14em | `--ink-3` or `--cobalt-600` |
| metric | Mono 400 | 1.05 | −0.01em | `--ink` |
| button | Sans 500 | 1 | +0.002em | per component |

**Weight law for the serif:** Newsreader lives at 300–500 only. Never bold the serif to 600+ — the whisper-weight display at large sizes *is* the luxury signal (the ElevenLabs lesson). Emphasis inside serif headlines uses *italic*, not weight.

## 4. Editorial devices (the "newspaper craft" layer)

Use these instead of generic section decoration. Each has one job:

1. **Eyebrow + rule** — every marketing section opens with a mono eyebrow above the H2, with a 24px, 1.5px cobalt rule to its left:
   ```html
   <p class="eyebrow"><span class="rule"></span>AUDIENCE GROWTH</p>
   <h2>Post like a newsroom, grow like a network</h2>
   ```
2. **Standfirst (lede)** — a 1-sentence `--text-lede` paragraph directly under display headings, `--ink-2`, max 60ch. Replaces the generic "subtitle paragraph".
3. **Pull quote** — testimonials render as editorial pull quotes: serif italic at `--text-display-3`, a hanging open-quote in `--cobalt-200` at 3em, attribution in mono small caps. Never a card with an avatar circle + star row.
4. **Drop cap** — long-form blog posts only: first letter, serif 400, spans 3 lines, `--cobalt-700`. (`initial-letter: 3;` with a float fallback.)
5. **Figure + caption** — every product screenshot is a `<figure>` with a mono caption below: `FIG. 02 — Scheduling a week of posts`, `--ink-3`. This single device makes screenshots feel documented, not pasted.
6. **Folio numbers** — only where content is genuinely sequential (onboarding steps, a how-it-works timeline): mono, `--cobalt-600`, format `01`, with a hairline connecting steps. Never decorate non-sequential feature grids with numbers.
7. **Hanging punctuation** — quotes and bullets hang into the margin where supported: `hanging-punctuation: first;`

## 5. Where the serif is allowed (boundary law)

- **Marketing:** display-1/2/3, pull quotes, blog headlines + drop caps, the standfirst may be serif italic for editorial pages.
- **App (linkedin.raindeer.social):** page titles (`--text-title`), the dashboard greeting line, big empty-state headlines, and *nothing else*. Cards, tables, buttons, nav, forms are 100% Switzer. This keeps the product crisp while the serif keeps it branded.
- **Never:** serif in buttons, inputs, table cells, tooltips, or below 18px anywhere.

## 6. Numbers are a material

- All data numerals use `--font-mono` (metrics, table figures, dates, percentages, follower counts).
- Switzer body text uses `font-variant-numeric: tabular-nums;` wherever numbers align vertically (tables, pricing).
- Big stats pair mono numeral + sans label: `12,408` (metric-lg, ink) over `PROFILE VIEWS · 30D` (eyebrow, ink-3). Delta chips: mono small, `--positive`/`--negative`, with `▲`/`▼` glyphs — not emoji arrows.

## 7. Paragraph & readability rules

- Measure: 60–72ch marketing prose, 55–65ch blog, no full-width text on wide screens ever.
- One `<h1>` per page; heading levels never skip.
- `text-wrap: balance` on all display headings; `text-wrap: pretty` on paragraphs.
- Font smoothing: `-webkit-font-smoothing: antialiased` on midnight plates only (light-on-dark), default elsewhere.
- Optical sizing: leave `font-optical-sizing: auto` (Newsreader's opsz axis is the point of choosing it).

## 8. Do / Don't reference

**Do** — hero:
```
[eyebrow]  RAINDEER FOR LINKEDIN
[display-1, serif 400]  The newsroom your ~LinkedIn~ deserves.   ← "LinkedIn" in italic serif
[lede]  Plan, write and schedule a week of posts in one sitting — with an AI editor that knows your voice.
```

**Don't:** Title Case Headlines That Capitalize Every Word · bold serif at 700 · Inter fallback stacks · gradient text outside the one permitted hero keyword · centered ALL-CAPS sans headlines · letter-spacing on body text.
