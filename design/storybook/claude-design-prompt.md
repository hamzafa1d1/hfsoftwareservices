# Claude Design prompt — "From ticket to production"

Paste into Claude Design in three rounds (guides recommend narrow prompts: build one section, then the next). Attach `design/storybook/STORYBOOK.md` and `hamza-400.webp`. Fill the `[PDF]` slots after the ClearCo PDF is processed. When happy, export with **Hand off to Claude Code** so the result lands back in this repo for the evidence check.

---

## Round 1 — system, hero and the Loop

You are designing a one-page portfolio for Hamza Faidi, a software engineer in Tunis who works with remote SaaS teams on .NET, React and SQL systems and uses an AI-assisted delivery workflow with quality gates. The page tells one story: **work goes through a gated loop before it reaches production.**

The visual idea is **the Loop**: a ring of 8 nodes labelled Gather, Explore, Plan, Code, Test, Review, Cleanup, Ship. Build it as a lightweight 3D object (Three.js, procedural geometry only: thin tube ring + 8 small spheres + mono text labels in HTML overlay; no textures, no models, no bloom). It rotates slowly. On load a single glowing token travels the ring once; at Test it flashes amber (#F59E0B), travels back to Code, then passes through teal (#14B8A6) to Ship. Pointer moves tilt the ring at most 6°. Provide an SVG version of the same ring as the default; the 3D replaces it only when WebGL is available and the user hasn't asked for reduced motion.

Hero (dark ink #0B0F14, ring right on desktop, below the text on mobile):
- Eyebrow (mono): "Software engineer · Tunis · EU hours"
- H1: "Software that holds up in production."
- Sub: "I work on .NET, React and SQL systems for remote SaaS teams. I use AI agents to investigate and build, then tests, review and runtime checks to prove the result."
- Buttons: "Book a call" (primary, teal) · "See the work"
- Three proof chips: "20 min → ~20 s on a legacy screen" · "16 production signals every 15 min" · "AWS & Terraform certified"

Type: characterful grotesk for display (try Geist or Instrument Sans), Inter Tight for body, JetBrains Mono for labels and numbers. Colours: ink #0B0F14, paper #F6F3EE, teal pass #14B8A6, amber fail #F59E0B (amber only means "failed check"). All text ≥ 4.5:1 contrast.

Do not use: purple gradients, glassmorphism, particle fields, cursor followers, robots, neon circuits, logos of companies, fake terminals or fake dashboards.

## Round 2 — the chapters

Continue the page on warm paper. A small copy of the ring sticks to the left edge on desktop and lights the stage each chapter belongs to (CSS `position: sticky`, no scroll hijacking).

1. **The problem** — three cards: "A legacy screen times out and nobody knows why." / "Customers find incidents before you do." / "AI writes code fast, and nobody trusts it."
2. **The Loop, explained** — one line per stage, three gates underneath: Automated tests · Engineering review · Runtime verification. Scope strip: "8 stages · 10+ custom skills · 4 coding tools". `[PDF: stage examples]`
3. **Case — 20 minutes to 20 seconds** (tag Explore → Test). Problem → What I did → Result → Stack. Two separate result cards: "Worst review screen: up to 20 min / timeouts → ~20 s" and "Representative query: 7,845 → 4 logical reads". A timer counts 20:00 → 0:20 once on entry.
4. **Night shift** (dark band; background transitions to ink as it scrolls in). "16 signals · every 15 minutes". Read-only health scan → team Slack summary. Certificate-expiry checks that flagged a shared certificate before it expired. A 4×4 dot grid pulses as an illustration, labelled "illustration".
5. **Review on a schedule** (tag Review). Cross-repository PR review every 15 minutes in working hours, deduplicated against GitHub state; Playwright characterization baselines for legacy behaviour.
6. **Earlier: payments that kept running** — 2×2 calm grid: "100+ virtual cards renewed before expiry" · "Live schema migration: reported 0 downtime, < 2% CPU overhead at peak" · "Card-suspension policies for 1,000+ corporate users" · "Contributed to a provider-agnostic payments refactor with idempotent webhooks".
7. **Now** — "I lead the technical direction of an ongoing compensation-platform rebuild."

Case studies say "US HR SaaS platform" or "corporate payments platform", never an employer name. Motion: reveals of 12 px + fade, 400–600 ms, staggered 60 ms, using CSS scroll-driven animations inside `@supports (animation-timeline: view())`. Everything is visible without the animation.

## Round 3 — trust and close

- Recommendation from Eric Guba (Senior Product Leader, LinkedIn, Sept 2026), verbatim: "Within a short time, he'd learned the codebase well enough to troubleshoot and resolve issues efficiently and independently."
- About: photo, three sentences, facts strip (Engineering degree · SUP'COM; AWS Solutions Architect – Associate; Terraform Associate; taught C/C++/OOP to ~80 students; Tunis, remote).
- How we'd work: Audit call → Fixed-scope proposal → Build in short cycles through the Loop → Handover with tests and runbooks. "Replies within one business day, UTC+1."
- Close: the ring lights its last node, Ship, and stops. Headline "Tell me what's slow, fragile or stuck." Book a call + email hamza.faidi.software.eng@gmail.com.

Responsive at 375 px and 1440 px. Honour `prefers-reduced-motion` (no rotation, no counters, final values shown). Keep the 3D bundle under ~60 KB gzipped and load it after the page is interactive.
