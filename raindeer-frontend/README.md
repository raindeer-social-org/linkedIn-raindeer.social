# Raindeer Social — AI-Powered Content Creation Platform

> A premium, VC-ready frontend demo for **raindeer.social** — an AI-driven platform that plans, scripts, and generates social media content in minutes.

![Version](https://img.shields.io/badge/version-0.0.1-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38BDF8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=flat-square)

---

## Overview

Raindeer Social is a **9-screen AI content creation platform** that guides brands through a fully automated content workflow — from brand identity setup all the way to publishing across multiple social platforms. Built as a high-fidelity frontend demo with polished UI, smooth animations, and realistic data flows.

The platform simulates how an AI agent would:
- Understand a brand's voice, goals, and audience
- Generate a tailored content strategy
- Plan individual campaigns and scripts
- Output ready-to-publish video content with captions and hashtags
- Track performance analytics across all platforms

---

## Key Features

### AI-Guided Content Workflow
- **9-step guided flow** from brand setup to published content
- Each step builds context carried forward to the next
- Simulated AI processing states with realistic timing

### Brand Setup & Identity
- Brand name, industry, and tone-of-voice configuration
- Target audience and content goal definition
- Brand persona stored globally via Zustand state

### Strategy Generation
- AI-generated content strategy cards
- Platform-specific recommendations (Instagram, Twitter, LinkedIn, YouTube)
- Pillar-based content planning

### Campaign Planner
- Multi-step campaign builder with format selection
- Hook, script structure, and visual style configuration
- Cost estimator for AI generation

### Content Calendar
- Full interactive calendar powered by FullCalendar
- Day/Week/Month views with scheduled content events
- Drag-and-drop event management

### Final Review & Content Output
- Video preview player with mock reel thumbnail
- Editable caption with character counter
- Hashtag manager with animated tag removal
- **Per-platform publish buttons** with connect-account flow:
  - `Not connected` → `Connecting…` → `Connected` → `Posted!`
  - Supports Instagram, Twitter, LinkedIn, YouTube independently
- Publish modes: Post Now / Schedule / Save to Drafts

### Analytics Dashboard
- Recharts-powered performance graphs
- Engagement rate, reach, impressions, and follower growth metrics
- Platform breakdown with per-channel stats
- Top-performing content cards

### Premium UI/UX
- Dark glassmorphism design system
- Framer Motion page transitions and micro-animations
- Radix UI accessible primitives (Dialog, Dropdown, Select, Tooltip)
- Fully responsive layout

---

## Screen Flow

```
/ Landing
    └── /setup      Brand Setup
        └── /strategy   Content Strategy
            └── /campaign   Campaign Planner
                └── /planning   Content Planning
                    └── /calendar   Content Calendar
                        └── /review     Final Review
                            └── /output     Generated Output ← publish here
                                └── /analytics  Analytics Dashboard
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite 5 |
| **Routing** | React Router DOM v6 |
| **State Management** | Zustand |
| **Animations** | Framer Motion 11 |
| **Styling** | Tailwind CSS 3 + Vanilla CSS |
| **UI Primitives** | Radix UI (Dialog, Dropdown, Select, Tooltip, Progress) |
| **Charts** | Recharts |
| **Calendar** | FullCalendar (React) |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Data Fetching** | TanStack React Query |
| **Notifications** | React Hot Toast |
| **Utilities** | clsx, tailwind-merge, date-fns |
| **AI SDK** | @anthropic-ai/sdk |

---

## Project Structure

```
raindeer/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                  # App entry point
    ├── App.jsx                   # Router + global providers
    ├── pages/
    │   ├── Landing.jsx           # Hero / marketing landing page
    │   ├── BrandSetup.jsx        # Brand identity configuration
    │   ├── Strategy.jsx          # AI content strategy generation
    │   ├── CampaignPlanner.jsx   # Campaign builder wizard
    │   ├── Planning.jsx          # Content planning & scripting
    │   ├── ContentCalendar.jsx   # Interactive scheduling calendar
    │   ├── FinalReview.jsx       # Pre-publish content review
    │   ├── GeneratedOutput.jsx   # Output viewer + multi-platform publish
    │   └── Analytics.jsx         # Performance analytics dashboard
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx        # Top navigation bar
    │   │   └── AnimatedPage.jsx  # Page transition wrapper
    │   ├── shared/
    │   │   ├── PlatformBadge.jsx # Platform chip (Instagram/Twitter/etc.)
    │   │   ├── AgentCard.jsx     # AI agent display card
    │   │   └── CostEstimator.jsx # Generation cost estimator
    │   └── ui/
    │       ├── Button.jsx        # Primary button primitive
    │       ├── Input.jsx         # Form input primitive
    │       ├── Badge.jsx         # Status badge primitive
    │       ├── Card.jsx          # Glass card primitive
    │       ├── Modal.jsx         # Dialog/modal primitive
    │       └── Progress.jsx      # Progress bar primitive
    ├── store/
    │   └── index.js              # Zustand stores (brand + campaign state)
    ├── lib/
    │   └── utils.js              # cn(), platformColors, formatters
    ├── data/                     # Static mock data
    └── styles/                   # Global CSS / design tokens
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher → [Download](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)

Verify your setup:
```bash
node --version   # v18.x.x or higher
npm --version    # 9.x.x or higher
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-org/raindeer.git
cd raindeer
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm run dev
```

**4. Open in browser**
```
http://localhost:5173
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with HMR at `localhost:5173` |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all JS/JSX files |

---

## Design System

The project uses a custom dark design system built on top of Tailwind CSS.

### Color Tokens
| Token | Value | Usage |
|---|---|---|
| `brand-bg` | `#060D1A` | Page backgrounds |
| `brand-surface` | `#0B1320` | Card surfaces |
| `brand-blue` | `#1E6BFF` | Primary accent |
| `brand-white` | `#F5F7FA` | Primary text |
| `brand-muted` | `#64748B` | Secondary text |

### Platform Brand Colors
| Platform | Color |
|---|---|
| Instagram | `#E1306C` → `#F77737` gradient |
| Twitter | `#1D9BF0` |
| LinkedIn | `#0A66C2` |
| YouTube | `#FF0000` |

### Key UI Patterns
- **Glass cards**: `backdrop-blur` + semi-transparent borders
- **Glow effects**: `box-shadow` with brand color at low opacity
- **Micro-animations**: Framer Motion `whileHover`, `whileTap`, `layout`
- **Page transitions**: `AnimatePresence` with `mode="wait"` + slide/fade

---

## Platform Publish Flow

The Generated Output screen implements a realistic **connect-account flow** for each social platform:

```
[Not Connected]  →  click  →  [Connecting… 1.6s]  →  [Connected]  →  click  →  [Posted! ✓]
```

- Each platform (Instagram, Twitter, LinkedIn, YouTube) is **independent**
- All start as "Not connected" — no accounts are linked by default
- Simulates an OAuth handshake with a loading spinner
- Once connected, the button becomes a branded gradient "Post on X" button
- Clicking posts and shows a green animated success state

---

## State Management

Global state is handled by **Zustand** with two stores:

```js
// Brand store — persists brand identity across the flow
useBrandStore() → { name, industry, tone, audience, goals, ... }

// Campaign store — persists campaign config across steps
useCampaignStore() → { format, hook, platform, script, duration, ... }
```

State flows one-way through the 9-screen wizard: each screen reads from and writes to these stores, so context is preserved as the user progresses.

---

## Dependencies Overview

### Core
- `react` + `react-dom` — UI rendering
- `react-router-dom` — client-side routing
- `zustand` — lightweight global state

### UI & Animation
- `framer-motion` — animations and page transitions
- `@radix-ui/*` — accessible headless UI primitives
- `lucide-react` — icon library
- `react-hot-toast` — toast notifications

### Data & Charts
- `recharts` — analytics charts
- `@fullcalendar/*` — content calendar
- `@tanstack/react-query` — async data management
- `axios` — HTTP client

### Styling
- `tailwindcss` + `postcss` + `autoprefixer`
- `clsx` + `tailwind-merge` — conditional class merging
- `date-fns` — date formatting utilities

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow the existing code style — components are functional, use hooks, and follow the established design token system.

---

## License

This project is private and proprietary to **raindeer.social**.

---

<div align="center">
  <p>Built with ❤️ for <strong>raindeer.social</strong></p>
  <p><em>AI-powered content creation for modern brands</em></p>
</div>
