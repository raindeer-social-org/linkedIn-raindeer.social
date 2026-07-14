# 00 — Brand Foundation: The Raindeer Design Language

> **Product:** raindeer.social — an AI-powered social media + digital marketing platform.
> **Surfaces:** marketing site (raindeer.social), product app (linkedin.raindeer.social), blog, emails.
> **Read this file first.** Every other guide (`01`–`05`) derives from the decisions here. When two rules conflict, this file wins.

---

## 1. The one-line direction

**"An arctic broadsheet with a living network inside it."**

Raindeer looks like a premium editorial publication — serif mastheads, generous margins, confident ink — printed on cold, bright, snow-white paper, with the brand's cobalt node-graph (the antlers of the logo) as the single living, animated element that carries all the "AI" energy.

Three words to test every screen against: **Editorial. Arctic. Alive.**

- **Editorial** — type-led hierarchy, newspaper craft, real copy, no decoration without meaning.
- **Arctic** — cool snow surfaces, cobalt ink, brass warmth used like gold foil: rare and deliberate.
- **Alive** — cinematic, physics-based motion; the node-graph motif breathes; nothing is static, nothing is frantic.

## 2. Why this direction (so the agent doesn't drift)

1. The logo is a deer head whose antlers are a **node-and-edge network graph**. That is a literal picture of what the product does: it grows your social network. The graph motif is therefore the brand's signature graphic device — not an arbitrary decoration.
2. The founders want "premium newspaper editorial" typography. Newspapers = warm authority + information density + serif display. We take the *craft* of newspapers (mastheads, eyebrows, rules, folios, pull quotes) without cosplaying as one (no fake paper texture, no zero-radius brutalism, no dense hairline column grids everywhere).
3. "Raindeer" evokes arctic light: snow, ice, ultramarine night sky, aurora, and the brass glow of a lantern. That gives us a **subject-grounded palette** instead of a template one.

## 3. Reference DNA — what we take from each inspiration (and what we don't)

| Reference | Steal this | Leave this |
|---|---|---|
| **ElevenLabs** | Whisper-weight display type at huge sizes; hairline 1px borders instead of shadows for flat separation; accent colors reserved for "product visuals" only, never UI chrome; warm restraint | Their cream/stone palette (we are arctic-cool); their pill-everything geometry |
| **Notion** | Warm-feeling minimalism achieved through *tone*, not clutter; a single functional action color; soft multi-layer shadows under floating product mockups; 4px spacing discipline | Playful hand-drawn illustration style (too casual for us) |
| **Lenis / darkroom.engineering** | Butter-smooth inertial scroll as a brand feeling; type-as-hero layouts; the belief that *how the page moves* is part of the identity | Their stark black/red developer aesthetic |
| **Railway** | Deeply technical product surfaces that still feel designed; the canvas/graph view where architecture "communicates without saying a word" — our analytics and network views should do the same; live-updating data as ambience | Their dark theme (we are light) |
| **Premium print (FT, The Economist, Monocle)** | Eyebrows/kickers, folios, pull quotes, drop caps in long-form, hairline rules that *mean* something, confident white space | Literal newsprint texture, cluttered column density |

## 4. The signature device: **The Antler Graph**

Every memorable design system has one element it is known for. Ours is the node-and-edge motif lifted directly from the logo's antlers.

**Anatomy:** a node is a 6–10px circle, 1.5–2px cobalt stroke, white or ice fill; an edge is a 1.5px cobalt line connecting nodes. Exactly like the logo.

**Where it appears (and only where):**
- **Hero constellation** — on the marketing home, a sparse antler-graph draws itself in behind/around the headline (see `03-motion.md §4`).
- **AI presence marker** — wherever AI is acting (generating a post, scoring a hook, suggesting a reply), a single pulsing node with a soft cobalt ring marks it. This replaces all "✨ sparkle" iconography, which is banned.
- **Data visualization** — line charts use node-dots on data points; the network/audience graph view is literally the antler aesthetic.
- **Section connectors** — on long marketing pages, a thin vertical edge with occasional nodes can run in the margin, connecting chapters (one per page, max).
- **Loading states** — nodes lighting up in sequence along an edge, instead of generic spinners.

**Rules:** never more than one Antler Graph instance per viewport. It is always cobalt on light (or ice on midnight plates). It never becomes a background wallpaper pattern.

## 5. Surface temperature: light theme, two plates

The product is **fully light-themed**. Two "plates" exist:

1. **Snow plate (default, ~95% of every page):** near-white cool canvas, white cards, navy ink. Defined in `01-color-system.md`.
2. **Midnight plate (accent, max one band per page):** deep ultramarine section — used only for the final CTA band or footer on marketing pages, and for nothing in the app. It exists so the light theme has one cinematic "night sky" moment where the ice-colored Antler Graph and brass accents glow. It is a *plate within a light theme*, not a dark mode.

## 6. Hard bans — the anti-slop laws

These are non-negotiable. If generated output contains any of these, it is wrong regardless of how it looks:

1. **No Inter, Roboto, Arial, Poppins, Space Grotesk, Playfair Display, or Instrument Serif.** Fonts are specified in `02-typography.md` and nowhere else.
2. **No purple.** No indigo-500 `#6366F1`, no violet `#8B5CF6`, no purple-to-blue or purple-to-pink gradients, ever. Our blue is cobalt/ultramarine (logo-derived), which reads clearly different.
3. **No glassmorphism** (frosted translucent cards with backdrop-blur) except the sticky nav bar, where a subtle blur is permitted.
4. **No emoji in UI.** Icons come from the icon spec in `04-components.md`; AI presence uses the node marker.
5. **No "badge above headline + centered hero + three icon cards"** template. Feature sections must be asymmetric or editorial (see `05-layout.md`).
6. **No uniform fade-up-on-scroll on every section.** Motion variety rules live in `03-motion.md §7`.
7. **No cards inside cards.** One container level; separate with space and hairlines.
8. **No uniform border radius.** The radius scale is intentional and mixed (`04-components.md §1`).
9. **No gradient text** except the single permitted hero treatment (`01-color-system.md §6`).
10. **No vague copy** — "Build the future", "Supercharge your workflow", "Unleash the power of AI" are all banned. See §8 below.
11. **No stock photography of people pointing at laptops.** Imagery is product UI, abstract arctic-light renders, or the Antler Graph.
12. **No pure black `#000` and no pure gray neutrals** — every neutral carries the cool ink undertone from `01-color-system.md`.

## 7. Quality floor (always, without being asked)

- Responsive from 360px to 1920px; the editorial type scale is fluid (`clamp()`), never a hard desktop/mobile jump.
- Visible keyboard focus on every interactive element: 2px cobalt ring, 2px offset (`01-color-system.md §8`).
- `prefers-reduced-motion` fully respected — every animation in `03-motion.md` has a reduced variant.
- WCAG AA contrast minimum; body ink on snow canvas is ~15:1 by design.
- Real content over lorem ipsum: if copy is missing, write plausible raindeer copy per §8 rather than placeholder text.

## 8. Voice & microcopy

Raindeer writes like a sharp editor, not a hype account.

- **Sentence case everywhere** — headlines, buttons, labels. Never Title Case Marketing Speak. ALL-CAPS is reserved for mono eyebrows only.
- **Verbs on buttons, outcomes in headlines.** Button: "Schedule post", "Generate 5 hooks", "Connect LinkedIn". Never "Submit", "Get started" alone, or "Learn more" without an object.
- **Specific beats clever.** "Write a week of LinkedIn posts in 20 minutes" beats "Content creation, reimagined."
- **Numbers are typeset in mono** (see `02-typography.md §6`) and are real: "3.2× more profile views", not "10x growth 🚀".
- The product speaks about **the user's audience, posts, and pipeline** — never about "leveraging AI capabilities."
- Errors state what happened and the next action: "LinkedIn declined the connection. Reconnect your account to keep scheduling." No apologies, no exclamation marks.
- Empty states are invitations with one clear action: "No posts scheduled this week. Draft one from an idea, or let Raindeer propose three."

## 9. File map for agents

| File | Owns |
|---|---|
| `00-brand-foundation.md` | Direction, signature device, bans, voice (this file) |
| `01-color-system.md` | All color tokens, gradients, grain, shadows, data-viz palette |
| `02-typography.md` | Font families, loading, fluid scale, editorial devices |
| `03-motion.md` | Lenis, GSAP patterns, easing/duration tokens, micro-interactions |
| `04-components.md` | Every component spec: buttons → dashboard modules |
| `05-layout.md` | Grid, spacing, section rhythm, page templates, responsive |

When generating any UI, load this file plus the relevant specialist file(s). Never invent a color, font, easing, spacing value, or radius that is not tokenized in these guides.
