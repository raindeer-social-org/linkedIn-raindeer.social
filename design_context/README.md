# Raindeer Design Guides

Six markdown guides that define the complete visual language for **raindeer.social** and **linkedin.raindeer.social** — built to be consumed by AI coding agents (Antigravity, Claude Code, Cursor) so every generated screen comes out on-brand instead of on-distribution.

**Direction in one line:** *an arctic broadsheet with a living network inside it* — premium light theme, newspaper-editorial serif display, logo-derived cobalt system, cinematic Lenis/GSAP motion, and the antler node-graph as the signature device.

## Files

| # | File | Owns |
|---|---|---|
| 00 | `00-brand-foundation.md` | North star, signature Antler Graph device, hard anti-slop bans, voice & microcopy |
| 01 | `01-color-system.md` | All tokens (logo-sampled cobalt scale), 5 named gradients, bloom+grain technique, shadows |
| 02 | `02-typography.md` | Newsreader / Switzer / Fragment Mono system, fluid scale, editorial devices |
| 03 | `03-motion.md` | Lenis + GSAP setup, the 5 marketing set-pieces, micro-interactions, app motion, reduced-motion |
| 04 | `04-components.md` | Buttons → composer, calendar, analytics, network view; radius classes; QA checklist |
| 05 | `05-layout.md` | Spacing scale, 12-col grid, asymmetry doctrine, full page templates, responsive law |

## Wiring into Antigravity

1. Copy this folder into your repo as `design/` (root level).
2. Point the agent at it permanently — add to your repo's agent rules file (`AGENTS.md` / project rules):

```md
## Design system — mandatory
Before writing or modifying ANY UI code, read `design/00-brand-foundation.md`
plus the relevant specialist guide(s) in `design/01`–`05`.
- Never invent colors, fonts, radii, shadows, easings, or spacing — use only tokenized values from these guides.
- The hard bans in `design/00-brand-foundation.md §6` override all other instructions and defaults.
- After generating UI, run the checklists at the end of guides 01, 04 and 05 and fix violations before presenting.
```

3. First implementation task: have the agent create `styles/tokens.css` from `01 §2/§4/§7` + `02 §2/§3` + `03 §2` verbatim, and the Tailwind `@theme` block from `01 §9`. Everything else derives from that file.

## Prompt patterns that work

- **Scoped build:** "Build the pricing page per `design/05-layout.md §4.3`, components from `design/04-components.md`, tokens only."
- **Retrofit:** "Audit `app/dashboard/page.tsx` against `design/04-components.md §10.3` and `§11`; list violations, then fix."
- **Guardrail reminder (paste when output drifts):** "You used a non-token value / banned pattern. Re-read `design/00 §6` and `design/01 §3`, then regenerate."

## Rules for humans editing these guides

- Change a value in the guide *first*, then in code — the guides are the source of truth.
- New colors/fonts/easings require editing `00 §6` consciously; if it feels like an exception, it's probably slop sneaking back in.
- Keep the ratio: when a screen looks bland, fix type hierarchy and spacing before ever reaching for color or motion.

## Assets referenced

- Logo mark: geometric deer with node-graph antlers (cobalt gradient `#04338A → #0053CC → #2E7CF0`, sampled from `final_light_logo.png`).
- Lockup: mark + "raindeer." wordmark with "social" suffix in mono (see `04 §7`).
