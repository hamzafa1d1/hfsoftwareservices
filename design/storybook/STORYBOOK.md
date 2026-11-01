# Portfolio storybook — "From ticket to production"

Status: draft v0.1 (2026-11-01). Waiting on the ClearCo contributions PDF. Anything marked `[PDF]` gets filled or replaced from that document.

## 1. The story in one line

> I take messy production problems through a gated, AI-assisted delivery loop and ship fixes you can check.

The whole page is that loop. Each section is one stage of the pipeline, and each case study shows the loop working on a real problem. The visitor scrolls through the same pipeline the work goes through.

Why this story: the PDF focuses on AI SDLC work. The evidence library supports *AI-assisted engineering with quality gates* (CC12, CC13, CC10). It does **not** support "I build customer-facing AI agents" as a shipped product line. So the story sells a delivery method with proof, not an agent product.

## 2. Who reads it, and what they decide

| Reader | Arrives from | Has ~10 s to decide | Fear the story must answer |
|---|---|---|---|
| Engineering manager / CTO at a SaaS | Upwork proposal, LinkedIn | "Can this person own a module alone?" | AI code nobody checked |
| Founder / ops lead | Referral | "Will this ship, and will it still work in month six?" | Demo that never reaches production |
| Recruiter for contract roles | LinkedIn | "Senior enough? Remote-ready?" | Vague claims |

## 3. Visual idea (one idea, used everywhere)

**The Loop.** An 8-node ring: Gather → Explore → Plan → Code → Test → Review → Cleanup → Ship. A failed Test sends a short amber pulse back to Code. That ring is:

- the 3D hero object,
- the progress indicator down the left edge on desktop,
- the stage label on every case study ("this case lived mostly in **Test → Review**"),
- the favicon and OG image.

One idea, repeated, reads as confidence. No second 3D object anywhere else.

### Look

- Base: deep ink `#0B0F14` for the 3D hero and one dark "production" chapter. The rest stays warm paper `#F6F3EE` with ink text. The page goes dark → light → one dark band → light. Production is shown as night; documentation as daylight.
- Accent: one signal teal `#14B8A6` (pass), one amber `#F59E0B` (failed check, used only for that meaning). Both checked at ≥ 4.5:1 against their background, or used only for non-text marks.
- Type: a display grotesk with character (e.g. *Space Grotesk* → swap for *Geist* or *Instrument Sans* if it feels generic), body *Inter Tight* or system, mono *JetBrains Mono* for stage labels and numbers only.
- Texture: hairline grid, numbered stages in mono, real numbers set large.

## 4. Chapters (scroll order)

Each chapter: **beat** (what the reader should feel), **content**, **motion**, **evidence**.

### Ch 0 — Hero: the Loop at rest
- **Beat:** "This person ships things, and checks them."
- **Content:** H1 option A "Software that holds up in production." / option B "AI-assisted delivery, with every change checked." Sub: "I'm Hamza, a software engineer working on .NET, React and SQL systems for remote SaaS teams. I use AI agents to investigate and build, and tests, review and runtime checks to prove the result." CTA: Book a call · See the work. Chips: *20 min → ~20 s on a legacy screen* · *16 production signals every 15 min* · *AWS & Terraform certified*.
- **Motion:** 3D ring slowly rotates (≈ 0.05 rad/s). On load one token travels the ring once; at Test it flashes amber, returns to Code, then passes. Pointer tilt ±6°. Paused when tab hidden or out of view.
- **Fallback:** the same ring as inline SVG, static, with the stage labels. This is what loads first; WebGL replaces it only after idle.
- **Evidence:** CC01, CC10, credentials.

### Ch 1 — The problem, in the reader's words
- **Beat:** "He has seen my situation."
- **Content:** three short cards. "A legacy screen times out and nobody knows why." "Incidents are reported by customers first." "AI writes code fast, and nobody trusts it."
- **Motion:** cards rise 12 px and fade in, staggered 60 ms (CSS `animation-timeline: view()`, visible by default in browsers without support).
- **Evidence:** framing only; each card links to the case that answers it.

### Ch 2 — The Loop, explained (the AI SDLC chapter)
- **Beat:** "There is a method, and it has gates."
- **Content:** the eight stages, each one line. Three gates under the ring: *Automated tests*, *Engineering review*, *Runtime verification*. Scope strip: "8 stages · 10+ custom skills · 4 coding tools". `[PDF]` add concrete stage examples, hooks and subagents named in the PDF.
- **Motion:** sticky ring on the left (CSS `position: sticky`, no scroll-jacking). As each stage paragraph enters view, its node lights teal. The Test stage shows the amber loop-back once.
- **Copy rule:** say "AI-assisted engineering workflow used for production fixes". No speed-up percentage, no "autonomous", no "zero defects".
- **Evidence:** CC12, CC13.

### Ch 3 — Case: 20 minutes to 20 seconds
- **Stage tag:** Explore → Test.
- **Beat:** "He measures before he changes things."
- **Content:** Problem → What I did → Result → Stack. Two separate result cards: *Worst review screen: up to 20 min / timeouts → ~20 s* and *Representative query: 7,845 → 4 logical reads*. Note they are two different measurements.
- **Motion:** a timer counts from 20:00 down to 0:20 once when the card enters view (reduced motion: shows the final value). The two cards never share an axis.
- **Evidence:** CC01.

### Ch 4 — Night shift: watching production (dark band)
- **Stage tag:** Ship → (back to) Gather.
- **Beat:** "He looks after things after release."
- **Content:** "16 signals · every 15 minutes", read-only health scan → Slack summary. SSO certificate expiry check that flagged a shared certificate before it expired. Deployment race reproduced and fixed. `[PDF]` incident timeline details if approved for public use.
- **Motion:** a 4×4 grid of 16 dots blinking in a slow 15-step cycle (an abstract heartbeat, not real data, labelled "illustration"). Page background goes dark through a scroll-linked colour transition.
- **Evidence:** CC10, CC08, CC09.

### Ch 5 — Case: review that runs on a schedule
- **Stage tag:** Review.
- **Beat:** "AI is in the loop, and so are checks."
- **Content:** scheduled cross-repo PR review every 15 minutes in working hours, deduplicated against GitHub state; Playwright characterization baselines for legacy behaviour. `[PDF]` more detail.
- **Motion:** a stacked list of PR cards, each gets a "reviewed" tick as it enters view.
- **Copy rule:** do not claim manual approval on every automated review.
- **Evidence:** CC13.

### Ch 6 — Earlier: payments that kept running
- **Stage tag:** Ship.
- **Beat:** "He did this before AI tools, in money systems."
- **Content:** compact 2×2 grid. *100+ virtual cards renewed before expiry* (EX01). *Live schema migration, reported 0 downtime and < 2% CPU overhead at peak* (EX04). *Card suspension policies for 1,000+ corporate users* (EX05). *Contributed to a provider-agnostic payments refactor, idempotent webhooks* (EX03). LLM-assisted fraud screening, described without the 79% figure (EX02).
- **Motion:** none beyond the shared reveal. This chapter is calm on purpose.

### Ch 7 — What I'm building now
- **Stage tag:** Plan.
- **Content:** "I lead the technical direction of an ongoing compensation-platform rebuild: architecture decisions, data model, calculation-engine strategy." The word *ongoing* is required.
- **Evidence:** CC14, CC15.

### Ch 8 — People who worked with me
- Verbatim LinkedIn recommendations only (Eric Guba plus any others readable in full). No paraphrases.

### Ch 9 — How we'd work together
- Audit call → fixed-scope proposal → build in short cycles with the Loop → handover with tests and runbooks. Reply time "within one business day, UTC+1".

### Ch 10 — Close
- The ring completes its last node (Ship) and stops. CTA: "Tell me what's slow, fragile or stuck." Scheduler + email. `/upwork` variant keeps the single "Message me on Upwork" CTA.

## 5. Motion and 3D rules

1. **Content first.** All text renders in HTML without JavaScript. Motion adds, never reveals.
2. **One WebGL canvas, hero only.** Three.js (pinned version, tree-shaken ES module) or a hand-written WebGL/OGL scene. Budget: ≤ 60 KB gzipped JS for the 3D, no textures, procedural geometry (tubes + spheres), ≤ 1 draw call per material. Load with `requestIdleCallback` after LCP. If WebGL is unavailable, or `prefers-reduced-motion: reduce` is set, or `navigator.connection.saveData` is true, keep the SVG.
3. **Scroll effects in CSS.** Use scroll-driven animations (`animation-timeline: view()` / `scroll()`), wrapped in `@supports (animation-timeline: view())`. Chrome/Edge and Safari 26+ support them. Firefox stable still has them behind a flag, so Firefox users get the static layout. A tiny IntersectionObserver fallback is optional.
4. **No scroll-jacking**, no pinned sections taller than one viewport, no auto-advancing carousels, no cursor followers.
5. **Durations:** reveals 400–600 ms, `cubic-bezier(.2,.7,.2,1)`; counters ≤ 1.2 s; nothing loops in the reading area except the 16-dot heartbeat, which stops after 3 cycles.
6. **Budgets:** LCP < 2.5 s, CLS < 0.1, INP < 200 ms on a mid-range phone; Lighthouse mobile Perf ≥ 90, A11y ≥ 95.

## 6. Evidence guardrails (bind every chapter)

- Employer names appear only in the chronology/about strip. Case studies say "US HR SaaS platform" / "corporate payments platform".
- Never publish: the ~79% fraud accuracy, the ~60% faster delivery claim, "rebuilt platform", Blauwtrust, MT940, ticket IDs, hosts, exploit or auth mechanics.
- Keep qualifiers: "reported", "about", "up to", "during the rollout", "ongoing".
- Internal development agents ≠ customer-facing AI agents. Say which one each time.
- New facts from the PDF need a claim ID added to `hamza-career-skills` before they go on the page.

## 7. Open items

| Item | Needed from |
|---|---|
| ClearCo contributions PDF, to fill `[PDF]` slots and add claims | Hamza |
| Choose H1 A or B (or let the PDF decide) | Hamza |
| Scheduler URL, sprint/retainer price floor | Hamza (still open from the September pass) |
| OK to show the 3D hero on `/upwork` (Upwork reviewers are often on mobile) | Hamza |
