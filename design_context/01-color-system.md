# 01 — Color System: Arctic Ink

> Every value below is final. Do not substitute Tailwind defaults, do not eyeball "close enough" hexes, do not add hues.
> The cobalt scale is sampled directly from the raindeer logo (`#00208A → #0342A3 → #0053CC → #DDECFE`).

---

## 1. Palette philosophy

Three families, one job each:

1. **Snow + Ink (neutrals)** — cool, blue-undertoned paper and text. They do 90% of the work. The light theme's "premium" feeling comes from these being *slightly* cool and *never* pure `#FFF`-on-`#000` clinical.
2. **Cobalt (brand)** — the logo's ultramarine→azure ramp. Actions, links, the Antler Graph, data. This is the only saturated family allowed in UI chrome.
3. **Glacier teal + Brass (accents)** — teal is the aurora companion for gradients and secondary data series; brass is "gold foil" — premium badges, plan highlights, editorial italic accents. Both are rationed like luxury materials.

## 2. Core tokens (CSS custom properties)

```css
:root {
  /* ---------- SNOW (surfaces) ---------- */
  --snow-canvas:   #FAFBFD;  /* page background — barely-cool white       */
  --snow-card:     #FFFFFF;  /* cards, panels, inputs                     */
  --snow-2:        #F3F5F9;  /* alt sections, table header, hover wash    */
  --snow-3:        #E9EDF4;  /* inset wells, pressed, selected row        */
  --hairline:      #E2E6EE;  /* default 1px borders                       */
  --hairline-bold: #CBD2DF;  /* emphasized rules, input borders           */

  /* ---------- INK (text) ---------- */
  --ink:           #0E1B3A;  /* headings, primary text (navy-black)       */
  --ink-2:         #3E4C6B;  /* body-secondary, subheads                  */
  --ink-3:         #66748F;  /* meta, captions, placeholders              */
  --ink-4:         #9AA4BA;  /* disabled, faint labels                    */

  /* ---------- COBALT (brand, logo-derived) ---------- */
  --cobalt-50:  #F0F6FF;
  --cobalt-100: #DDECFE;   /* exact logo ice tint                         */
  --cobalt-200: #B9D5FD;
  --cobalt-300: #8AB6FA;
  --cobalt-400: #5590F3;
  --cobalt-500: #2470EA;   /* azure — bright antler tips                  */
  --cobalt-600: #0053CC;   /* exact logo core — PRIMARY ACTION            */
  --cobalt-700: #0342A3;   /* exact logo mid — hover / pressed            */
  --cobalt-800: #04338A;   /* logo deep                                   */
  --cobalt-900: #0A2568;
  --cobalt-950: #0B1B47;   /* midnight plate base                         */

  /* ---------- ACCENTS ---------- */
  --glacier-300: #7FD8CE;
  --glacier-500: #159A8C;  /* aurora teal — gradients, data series 2      */
  --glacier-700: #0C6B62;
  --brass-300:  #E3C88C;
  --brass-500:  #A87B2E;   /* gold foil — premium badges, ★ moments       */
  --brass-700:  #7A5417;

  /* ---------- SEMANTIC ---------- */
  --positive:      #1F8A5B;  /* growth, success                           */
  --positive-wash: #E7F5EE;
  --caution:       #B07818;  /* warnings (brass-adjacent, stays on-brand) */
  --caution-wash:  #FBF3E2;
  --negative:      #C6473D;  /* errors, declines                          */
  --negative-wash: #FBECEA;
  --info:          var(--cobalt-600);
  --info-wash:     var(--cobalt-50);

  /* ---------- MIDNIGHT PLATE (max one band/page, marketing only) ---------- */
  --midnight:        #0A1435;  /* deeper than cobalt-950; night sky        */
  --midnight-card:   #111E4A;
  --midnight-ink:    #EDF2FB;  /* text on midnight                         */
  --midnight-ink-2:  #A9B6D6;
  --midnight-line:   #24336B;
}
```

## 3. Role mapping — never bypass this table

| Role | Token | Notes |
|---|---|---|
| Page background | `--snow-canvas` | Never `#FFFFFF` as the page itself — cards must read *above* the page |
| Card / panel / popover | `--snow-card` | + `--hairline` border, shadow per §7 |
| Primary button bg | `--cobalt-600` | hover `--cobalt-700`, pressed `--cobalt-800` |
| Links & interactive text | `--cobalt-600` | hover: underline draws in (see `03-motion.md §6`), color stays |
| Selected / active nav item | `--cobalt-50` bg + `--cobalt-700` text | never a solid cobalt fill for nav states |
| Focus ring | `--cobalt-500` | see §8 |
| Headings | `--ink` | |
| Body | `--ink-2` on marketing, `--ink` at app density | |
| Chart series 1 | `--cobalt-600` | series 2 `--glacier-500`, 3 `--cobalt-300`, 4 `--brass-500`, 5 `--ink-3` |
| "Pro / Premium" markers | `--brass-500` | the ONLY use of brass in the app |
| AI-presence node | `--cobalt-500` fill, `--cobalt-200` pulse ring | per `00 §4` |

**Ratio discipline:** on any given screen ≈ 92% snow/ink, ≤ 6% cobalt, ≤ 2% glacier+brass+semantic combined. If a screen feels bland, fix hierarchy and type — do not add color.

## 4. Signature gradients

Gradients are atmosphere and brand moments — never fills for random cards. Exactly five exist:

```css
:root {
  /* G1 — ANTLER: the logo's own ramp. Primary CTAs on marketing,
     hero keyword, the drawn Antler Graph strokes. */
  --grad-antler: linear-gradient(133deg, #04338A 0%, #0053CC 52%, #2E7CF0 100%);

  /* G2 — AURORA: cobalt→glacier sweep. Section atmosphere, chart area fills
     (at 8–14% alpha), the AI-generation shimmer. */
  --grad-aurora: linear-gradient(110deg, #0053CC 0%, #2470EA 45%, #159A8C 100%);

  /* G3 — ARCTIC DAWN: near-invisible sky wash for hero backgrounds.
     Ice blue melting into pale gold at the horizon. */
  --grad-dawn: linear-gradient(180deg, #EAF1FD 0%, #FAFBFD 58%, #FBF5E9 100%);

  /* G4 — NIGHT SKY: midnight plate background. Radial, light source top-center. */
  --grad-night: radial-gradient(120% 90% at 50% 0%, #14245C 0%, #0A1435 62%);

  /* G5 — BRASS FOIL: premium badge / plan-highlight stroke only. */
  --grad-brass: linear-gradient(120deg, #7A5417 0%, #C99B4A 45%, #E9D8A8 60%, #A87B2E 100%);
}
```

**Usage laws:**
- G1 on at most: the primary hero CTA, one hero keyword, the logo lockup. Nowhere else.
- G2 never appears at full opacity behind text. As atmosphere it renders as *blooms* (§5), as chart fill it fades to transparent at the baseline.
- G3 may sit behind the marketing hero and the pricing header. It should be almost subliminal — if a screenshot obviously "has a gradient background," it's too strong.
- G4 + ice-tinted Antler Graph + one brass detail = the entire recipe for the midnight CTA band.
- Buttons besides the hero CTA use flat `--cobalt-600`, not gradients.

## 5. Atmosphere technique: blooms + grain (the anti-AI finish)

Flat CSS gradients are the #1 "AI-generated" tell. Raindeer atmospheres are built in three layers:

```html
<div class="atmosphere">        <!-- position:relative wrapper on hero/section -->
  <div class="bloom bloom-a"></div>
  <div class="bloom bloom-b"></div>
  <div class="grain"></div>
</div>
```

```css
.bloom {
  position: absolute; border-radius: 50%; filter: blur(90px);
  pointer-events: none; will-change: transform;
}
.bloom-a { width: 640px; height: 640px; top: -180px; right: -120px;
  background: radial-gradient(closest-side, rgba(36,112,234,.16), transparent 70%); }
.bloom-b { width: 520px; height: 520px; bottom: -200px; left: -140px;
  background: radial-gradient(closest-side, rgba(21,154,140,.10), transparent 70%); }

/* Film grain kills banding and digital flatness. ~3% opacity, always on top of blooms. */
.grain {
  position: absolute; inset: 0; pointer-events: none; opacity: .035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}
```

Rules: max two blooms per section; blooms drift ±20px on scroll (parallax, `03-motion.md §5`); grain sits on hero + midnight plate only, never on dense app screens.

## 6. Text gradient — the single exception

One word or short phrase in the marketing H1 may carry G1:

```css
.h1-keyword {
  background: var(--grad-antler);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
```
Never on body text, never in the app, never on more than one element per page.

## 7. Elevation: ink-tinted shadow scale

Shadows are tinted with `--ink` (never neutral black), layered, and soft:

```css
:root {
  --shadow-xs: 0 1px 2px rgba(14,27,58,.05);
  --shadow-sm: 0 1px 2px rgba(14,27,58,.05), 0 3px 10px -2px rgba(14,27,58,.06);
  --shadow-md: 0 2px 4px rgba(14,27,58,.04), 0 10px 28px -6px rgba(14,27,58,.10);
  --shadow-lg: 0 4px 8px rgba(14,27,58,.04), 0 28px 56px -12px rgba(14,27,58,.14);
  --shadow-cta: 0 10px 28px -8px rgba(0,83,204,.38);   /* primary CTA hover only */
}
```

Elevation ladder: flat + hairline (most things) → `--shadow-sm` (cards) → `--shadow-md` (popovers, hovering cards) → `--shadow-lg` (modals, the hero product mockup). Prefer hairlines over shadows for separation, ElevenLabs-style; shadows communicate *floating*, not *existing*.

## 8. Focus, selection, and states

```css
:focus-visible { outline: 2px solid var(--cobalt-500); outline-offset: 2px; border-radius: inherit; }
::selection { background: var(--cobalt-100); color: var(--cobalt-900); }
```
- Disabled: `--snow-3` bg, `--ink-4` text, no borders removed (keep hairline).
- Destructive confirm buttons: `--negative` bg; hover darkens 8%. Never red outlines on idle elements.

## 9. Tailwind v4 theme bridge

```css
@theme {
  --color-canvas: #FAFBFD;   --color-card: #FFFFFF;
  --color-snow-2: #F3F5F9;   --color-snow-3: #E9EDF4;
  --color-hairline: #E2E6EE; --color-hairline-bold: #CBD2DF;
  --color-ink: #0E1B3A;      --color-ink-2: #3E4C6B;
  --color-ink-3: #66748F;    --color-ink-4: #9AA4BA;
  --color-cobalt-50: #F0F6FF;  --color-cobalt-100: #DDECFE;
  --color-cobalt-200: #B9D5FD; --color-cobalt-300: #8AB6FA;
  --color-cobalt-400: #5590F3; --color-cobalt-500: #2470EA;
  --color-cobalt-600: #0053CC; --color-cobalt-700: #0342A3;
  --color-cobalt-800: #04338A; --color-cobalt-900: #0A2568;
  --color-cobalt-950: #0B1B47;
  --color-glacier-300: #7FD8CE; --color-glacier-500: #159A8C; --color-glacier-700: #0C6B62;
  --color-brass-300: #E3C88C;  --color-brass-500: #A87B2E;   --color-brass-700: #7A5417;
  --color-positive: #1F8A5B;   --color-caution: #B07818;     --color-negative: #C6473D;
  --color-midnight: #0A1435;   --color-midnight-card: #111E4A;
  --color-midnight-ink: #EDF2FB; --color-midnight-line: #24336B;
}
```

## 10. Quick self-check before shipping a screen

- [ ] Page bg is `--snow-canvas`, not white; cards are white above it
- [ ] Zero purples/indigos; the only saturates are cobalt (+ rationed glacier/brass)
- [ ] Gradients used only per §4 laws; blooms have grain; nothing banded
- [ ] Shadows are ink-tinted and from the scale — no `rgba(0,0,0,.1)` anywhere
- [ ] Cobalt covers ≤ ~6% of the screen
- [ ] Every semantic color has its wash pair when used as a background
