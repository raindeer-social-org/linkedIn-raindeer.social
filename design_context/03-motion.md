# 03 — Motion: Cinematic, Not Busy

> Raindeer's motion identity: **the page moves like a film edit, not a slideshow.** A few orchestrated moments with physics-grade easing, long silence between them. Motion is the "Alive" pillar from `00 §1` — and it is where most AI-generated sites fail, so the rules here are strict.

---

## 1. Stack

| Layer | Tool | Scope |
|---|---|---|
| Smooth scroll | **Lenis** | Marketing site + blog only. **Never in the app** — dashboards, tables and composers use native scroll |
| Scroll choreography | **GSAP + ScrollTrigger + SplitText** (all free since GSAP 3.13) | Marketing scroll scenes, hero timelines, the Antler Graph draw |
| App micro-interactions | **Motion for React** (or CSS transitions) | linkedin.raindeer.social product UI |
| Counters/ticks | GSAP or `CountUp`-style rAF | Metrics |

## 2. Tokens — every animation uses these, nothing ad-hoc

```css
:root {
  /* durations */
  --dur-1: 120ms;   /* hover feedback            */
  --dur-2: 200ms;   /* state changes, underlines */
  --dur-3: 320ms;   /* panels, dropdowns         */
  --dur-4: 600ms;   /* card/image reveals        */
  --dur-5: 900ms;   /* headline masks, hero      */

  /* easings                         GSAP equivalent      */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);      /* "power3.out" feel — default    */
  --ease-cinema: cubic-bezier(0.16, 1, 0.3, 1);       /* expo.out — reveals, masks      */
  --ease-inout:  cubic-bezier(0.65, 0, 0.35, 1);      /* power2.inOut — pinned scenes   */
  --ease-spring: linear(0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%,
                 0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50.1%, 1.015 55%, 1.017 63.9%,
                 1.001 100%);                          /* subtle overshoot — chips, nodes */
}
```

Law: exits are ~35% faster than entrances. Nothing animates slower than `--dur-5` except scroll-scrubbed scenes.

## 3. Lenis setup (marketing only)

```js
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, anchors: true })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```

- `lerp: 0.1` is the brand feel — heavier (0.06) feels syrupy, lighter (0.15+) feels untreated.
- Kill Lenis for `prefers-reduced-motion` users and on any route under the app shell.
- Modals/drawers call `lenis.stop()` / `lenis.start()`.

## 4. The five marketing set-pieces

Each page gets **at most two** of these. Variety across pages, restraint within one.

### 4.1 Hero entrance (home page — the one mandatory moment)
A single GSAP timeline, total ≤ 1.3s, runs once on load:

```js
const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
tl.from('.hero-eyebrow', { y: 12, autoAlpha: 0, duration: .5 })
  .from(new SplitText('.hero-h1', { type: 'lines', mask: 'lines' }).lines,
        { yPercent: 110, duration: .9, stagger: .09 }, '-=.25')   // masked line rise
  .from('.hero-lede',  { y: 16, autoAlpha: 0, duration: .6 }, '-=.5')
  .from('.hero-cta',   { y: 14, autoAlpha: 0, duration: .5, stagger: .07 }, '-=.4')
  .from('.hero-figure',{ y: 40, autoAlpha: 0, scale: .985, duration: 1 }, '-=.55')
```

Lines rise out of a mask (clip), serif intact — the signature "printing press" reveal.

### 4.2 The Antler Graph draw
The logo-derived constellation draws itself: SVG edges animate `stroke-dashoffset` → 0 (`--dur-5`, expo.out, stagger .06), then each node pops in with `--ease-spring` scale 0→1 and a one-time soft cobalt pulse ring. Scroll-triggered `once: true`. This is the brand's hero animation — never loop it, never autoplay more than one per page.

### 4.3 Pinned chapter (how-it-works)
Section pins for ~1.5 viewport-heights while three product states cross-fade/slide in sync with mono folio numbers (`01 → 02 → 03`). `scrub: 0.6`. Use only when steps are truly sequential.

### 4.4 Editorial image reveal
Screenshots/figures reveal with `clip-path: inset(12% 0 0 0)` → `inset(0)` + scale 1.04 → 1, `--dur-4`, expo.out, triggered at 75% viewport. Figure caption fades in 120ms after.

### 4.5 Metric counters
Dashboard-style numbers count up in Fragment Mono over 0.9s with expo.out, starting when 60% visible, `once: true`. Delta chips slide in after with `--ease-spring`.

## 5. Ambient layer (always-on, nearly invisible)

- **Bloom parallax:** the two atmosphere blooms (`01 §5`) drift at `yPercent: ±8` with `scrub: 1.2`.
- **Figure parallax:** large media moves `yPercent: -6` against scroll. Text never parallaxes.
- **Nav condensation:** after 80px scroll, header height 76→60px, hairline + blur fade in, logo scales .92 — 300ms `--ease-out`.

## 6. Micro-interactions (both surfaces)

| Element | Interaction |
|---|---|
| Primary button | hover: bg → `--cobalt-700`, translateY(−1px), `--shadow-cta` fades in (`--dur-1`); press: translateY(0), `--cobalt-800`. Arrow glyph nudges +3px |
| Text link | 1.5px underline **draws** left→right on hover (`background-size` trick, `--dur-2 --ease-out`); never fades opacity down |
| Card (interactive) | hover: border → `--hairline-bold`, shadow-sm→md, translateY(−2px), `--dur-2`. No scale-up on layout cards |
| Hero CTA only | magnetic: translates toward cursor max 6px, spring return. One element per page |
| Inputs | focus: border → `--cobalt-500` + 3px `--cobalt-100` ring growing from 0, 150ms |
| Nav items | active indicator is a small **node dot** (6px cobalt circle) that slides between items, 250ms `--ease-spring` |
| Checkbox/toggle | check-path draws in 200ms; toggle thumb uses `--ease-spring` |

## 7. Variety + restraint laws (anti-slop)

1. Never apply the same reveal to consecutive sections. Rotate: masked lines → image clip → counter → plain (yes, *no animation* is a valid and required choice for ≥1 section per page).
2. Reveals trigger once (`once: true`); nothing re-animates on scroll-up.
3. Stagger caps: 6 items max; beyond that, animate the container.
4. No scroll-jacking: pinned scenes ≤ 1.5 viewports, always skippable by continued scroll.
5. Nothing moves that the user isn't meant to look at.
6. Only `transform` + `opacity` (+ `clip-path` for reveals) are animated. Never top/left/width/height/box-shadow keyframes (shadow fades via a pseudo-element's opacity).

## 8. App motion (linkedin.raindeer.social)

The product is calmer — motion is feedback, not theatre:

- Route/panel transitions: 180ms fade + 8px rise. No page-level hero timelines.
- Lists/tables: first paint may stagger rows 30ms (cap 8 rows), then never again.
- **AI-generating state:** the signature product moment. While Raindeer writes, show the pulsing node marker (`00 §4`) + text streaming in with a subtle aurora shimmer sweeping the skeleton lines (G2 gradient at 10% alpha, 1.6s loop). When done, one gentle `--ease-spring` settle on the result card. No spinners, no bouncing dots.
- Toasts: rise 12px + fade, auto-dismiss slide right.
- Drag (calendar/kanban): lifted item gets shadow-md + scale 1.02; drop settles with `--ease-spring`.

## 9. Reduced motion (mandatory)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```
Plus: disable Lenis, replace masked/parallax/pinned scenes with static layouts + simple fades, keep counters as final values. The page must be fully designed, not broken, with motion off.

## 10. Performance floor

60fps or the effect is cut. `will-change` only during animation (add/remove via GSAP callbacks). Blooms are `filter: blur` on their own layer — never animate the blur radius. Test on a mid-range Android; if the hero timeline janks there, simplify it there via a `matchMedia` tier.
