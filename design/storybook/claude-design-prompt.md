# Claude Design prompt — "From ticket to production" (v0.2)

Use this to explore visual variations in Claude Design. The coded version on branch `design/storybook` is the baseline. Attach `STORYBOOK.md`, `design-system.md`, `loop.svg` and `hamza-400.webp`. Paste one round at a time. Export with **Hand off to Claude Code**, so every claim gets checked against the evidence library before it ships.

---

## Round 1 — hero and the 3D loop

Design the hero of a one-page portfolio for Hamza Faidi, a software engineer in Tunis who works on .NET, React and SQL systems for remote SaaS teams. The page's story: **every change goes through a gated, AI-assisted loop before it reaches production.**

Visual: **the Loop**, nine nodes on a ring, rendered in 3D with CSS transforms (no WebGL library): Brainstorm, Plan, Approve, Build, Review, QA, Ship, Human review, Retro. Approve and Human review are human gates (double outline). A dashed amber (#F5A524) arc runs from Review back to Build, labelled "concerns → back to build". The ring is tilted about 62°, spins slowly (40 s per turn), and labels always face the viewer. A teal (#2DD4BF) token orbits; on its first pass it flashes amber at Review and drops back to Build. Pointer tilt ±6°. With reduced motion, everything is static.

Copy:
- Eyebrow (mono): "Software engineer · Tunis · EU hours"
- H1: "Software that holds up in production."
- Sub: "AI agents do the legwork in my process. Frozen plans, read-only reviewers, a separate QA agent and a human sign-off decide what ships."
- Buttons: "Start a conversation" (teal) · "See how I ship"
- Strip (Jun–Oct 2026): "45+ tickets shipped to production · 15 epics owned · 35+ technical documents · 3 product modules in ~7 weeks"

Palette: ink #0B0F14, paper #F4F1EA, teal pass #2DD4BF, amber fail #F5A524 (amber only means a check failed). Type: Bricolage Grotesque (display), Geist (body), Geist Mono (labels and numbers). Avoid: purple gradients, glassmorphism, particles, robots, neon circuits, fake terminals, company logos.

## Round 2 — the chapters

Build chapters 2–7 from `STORYBOOK.md` §4 exactly as written: Method with a sticky mini-ring, the PR exhibit, four case chapters with loop-stage tags (the fourth is a dark "night shift" band), three modules, "also on the bench", earlier payments work. Keep every qualifier ("staging", "in review", "on dev", "shadow mode", "reported"). Use no names of customers, colleagues, vendors, repos or tickets.

## Round 3 — trust and close

Recommendation (verbatim): "Within a short time, he'd learned the codebase well enough to troubleshoot and resolve issues efficiently and independently." — Eric Guba, Senior Product Leader, LinkedIn recommendation, September 2026. About with photo and a chronology strip (ClearCo, HR technology, since Dec 2025 · Expensya, corporate payments, 2022–2025 · SUP'COM, programming instructor, 2024–2025). Four-step engagement. Closing CTA "Tell me what's slow, fragile or stuck.", where the loop's token lands on Ship and stops.

Responsive at 375 and 1440 px; content complete without JavaScript; WCAG AA contrast.
