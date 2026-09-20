# Claude design prompt — rework hfsoftwareservices.com

Paste everything below the line into Claude (Claude Code in this repo is ideal, because the prompt references the skills under `.agents/skills/`). Replace the `{{PLACEHOLDER}}` values first. Anything left as a placeholder must be rendered as an obvious placeholder in the output, never invented.

---

## Role

You are a senior product designer and front-end engineer redesigning a one-page freelance portfolio so it converts Upwork prospects and direct referrals into booked calls. You write production HTML/CSS/JS, not mockups. You follow the skills in this repo in this order: `hf-portfolio-redesign` → `ai-agent-dev-positioning` → `upwork-portfolio-conversion` → `landing-page-ux-conversion` → `frontend-design`. Read `.agents/skills/hf-portfolio-redesign/references/current-site-audit.md` before touching anything.

## Who this is for

**Owner:** Hamza Faidi, software engineer in Tunis, trading as HF Software Services (registered SUARL, exports services, clean invoicing, MSA-friendly). 4 years in fintech and SaaS. Stack: .NET/C#, AWS, Azure, Terraform, TypeScript/Node, SQL Server, React/Angular. Since 2025: AI agents, MCP servers, spec-driven development, Jira/Confluence automation via MCP, LLM pipelines in production (fraud detection), test-automation background. Certifications: AWS Solutions Architect Associate, AWS Cloud Practitioner, HashiCorp Terraform Associate, TOEIC C1. Engineering degree from Sup'Com (EUR-ACE, EU Master's-equivalent). Works EU hours (UTC+1), English C1 and French. Formerly at Clearco (US HR software), Expensya (SaaS expense management, now Medius), Blauwtrust Groep (Dutch financial services).

**Buyer:** founders, ops leads and engineering managers at SMB and startup product companies. They want AI agents and automations that survive production, integrated with their existing tools. They have been burned by demos. They fear a freelancer disappearing, template work, and no accountability. They arrive from an Upwork profile, a LinkedIn share, or a referral, usually on a phone, and decide in under 10 seconds whether to keep reading.

**Goal of the page:** one action, "book a 30-minute reliability audit". Secondary: "see case studies". Target 8–15% of visitors reaching the scheduler.

## Positioning (fixed, do not drift)

Position Hamza as **the engineer who makes AI agents work in production**: tested, measured, integrated, owned by the client. The differentiator is reliability engineering (evals, regression gates, monitoring, zero-downtime migrations) applied to agentic systems, backed by fintech-grade backend experience. Do **not** position as "senior backend engineer for hire" or "full-stack developer"; those are supporting evidence, not the headline.

Headline direction (write 3 options in this spirit, pick the strongest for the build):
- "AI agents that survive production. Not just the demo."
- "Automations your team can trust in month six, not just in the pitch."
- "I build and test AI agents for teams that can't afford a flaky one."

Subhead names the mechanism as reassurance: MCP integrations with the tools they already run (Jira, Confluence, CRMs, payment providers), eval suites, monitoring, .NET/TypeScript/AWS delivery.

Words allowed in the hero: production, tested, measured, integrated, owned, hours, tickets, manual steps. Words banned from the hero: RAG, LLM, vector, LangGraph, orchestration, multi-agent, tokens, prompt engineering, "AI wizard", "passionate".

## Required structure (in this order, no auto-advancing carousels anywhere)

1. **Nav** — wordmark "HF Software Services", anchors (Work · Offers · Process · FAQ), live availability pill with text ("Taking 1 new build in {{MONTH}}"), primary CTA button. On mobile the CTA collapses into a sticky bottom bar.
2. **Hero** — H1 (outcome), subhead, primary CTA → scheduler, secondary CTA → #work, three proof chips (e.g. "6 production systems in fintech", "AWS & Terraform certified", "Registered company · EU hours"). One real visual: a restrained diagram or screenshot of an agent pipeline with an eval gate, not a fake terminal.
3. **Trust strip** — Clearco · Expensya · Blauwtrust Groep · Mastercard/Adyen integrations (as "worked with" tech, not clients) · Credly badge links · `{{UPWORK_BADGE_OR_JSS}}` if available.
4. **Who this is for / what's broken** — 3–4 pain statements in the buyer's words (an agent that answers wrong 1 in 20 times; tickets synced by hand; a pilot nobody dares to ship; a payment flow tied to one vendor).
5. **Offers (bento grid, 3 cards)** —
   - *Reliability Audit* — 30-minute call + written one-page report the client keeps. Free. Names one prioritized build with a price.
   - *Agent Sprint* — 2 weeks, fixed scope, one workflow, eval suite + monitoring dashboard + handoff docs, client owns the code. "From {{SPRINT_PRICE}}".
   - *Fractional AI Engineer* — 8–20 h/week retainer, monitoring, improvements, named backup. "From {{RETAINER_PRICE}}/month".
   Each card: outcome line, deliverables list, timeline, a "not for you if" line.
6. **Case studies (4 cards, static grid)** — rewrite these from the audit with the format *Problem → What shipped → Measured result → Stack*. Titles carry the number:
   - "Legacy comp platform rebuilt with AI agents: Jira & Confluence kept in sync by MCP, zero manual ticket work" (delivery-speed metric `{{VERIFIED_DELIVERY_METRIC}}`)
   - "Fraud detection on Mastercard corporate spend: LLM pipeline, manual reviews halved, €3,000+ recovered" (use one accuracy/precision figure only; the current site shows both 94% and 79% — pick the one Hamza can defend)
   - "SWIFT MT940 reconciliation: daily manual bank reconciliation eliminated across multiple banks"
   - "Provider-agnostic payments layer with Adyen: ~30% faster feature delivery"
   Optional 5th/6th (card renewal automation, card suspension) collapse under "More work".
   Every number on the page must appear in exactly one case study with the same value.
7. **How an engagement runs** — 4 steps: Audit call → Scoped proposal (fixed price) → Build in 2-week sprints with evals and demos → Deploy, monitor, hand over. State response time ("replies within one business day, UTC+1") and communication norms.
8. **Testimonials** — 2–3 slots. Use `{{TESTIMONIAL_1}}` style placeholders rendered as visibly unfilled cards with a "collect from past clients" note; never fabricate quotes.
9. **About** — 3 sentences, buyer-oriented, real photo (convert `hamza.png` to AVIF/WebP ≤ 60 KB, ~400px, explicit dimensions). Compact facts strip: Registered SUARL · UTC+1 · EN C1 / FR · Milestone-based contracts · AWS/Terraform certified.
10. **FAQ (6 items, visible, `<details>`)** — Who owns the code? What happens if you're unavailable? How do you measure whether the agent works? What does it cost? Which stack/models? Do you work through Upwork or direct?
11. **Final CTA** — headline echo, inline Cal.com/Calendly embed (`{{SCHEDULER_URL}}`), a 4-field intake form (problem, budget range radio, timeline, email) posting to `{{FORM_ENDPOINT}}`, `mailto:{{CONTACT_EMAIL}}` and `https://wa.me/{{E164_NUMBER}}` fallbacks, LinkedIn, Credly, GitHub.
12. **Footer** — legal name, Tunis, © year, "Built as a static site, no trackers".

Also produce a **contact-free variant** at `/upwork/index.html`: identical page minus scheduler, form, email, phone and WhatsApp; its only CTA is "Message me on Upwork" → `{{UPWORK_PROFILE_URL}}`. This satisfies Upwork's rule against off-platform contact before a contract.

## Aesthetic direction

Keep the calm, light, technical character the current site has; raise the contrast, the hierarchy and the confidence. Think "engineering notebook meets editorial one-pager": warm off-white paper, deep ink text, generous margins, hairline rules, numbered sections, monospace only for data and labels. One saturated accent used **only** for the primary CTA and the live availability dot. Typography: a characterful grotesk or a modern serif for display, a quiet sans for body, one mono. No Inter, no purple gradients, no glassmorphism outside the nav, no 3D, no cursor glow, no scroll progress bar, no marquees. Bento grid for offers and results. Motion is opt-in: a single staggered reveal on load and subtle hover states, all inside `@media (prefers-reduced-motion: no-preference)`; content is fully visible with JavaScript disabled.

## Technical constraints

- Static HTML/CSS/vanilla JS, no build step, deployable on Vercel as-is. Keep `vercel.json` headers.
- Self-host fonts (WOFF2, ≤ 2 files, `font-display: swap`, `size-adjust` fallback) or use Google Fonts with a system fallback stack. Pin any CDN dependency to an exact version; prefer none.
- All text ≥ 4.5:1 contrast, focus rings visible, touch targets ≥ 44px, one `<h1>`, landmarks, skip link, `lang="en"`.
- Images: AVIF/WebP with explicit width/height; hero visual `fetchpriority="high"`, never lazy.
- JSON-LD: `Person` + `ProfilePage`, `Organization` (HF Software Services SUARL), one `Service` with three `Offer`s, `FAQPage` mirroring the visible FAQ.
- Canonical, OG (`og:image` 1200×630 < 300 KB, regenerate `og.svg` → PNG/WebP), Twitter card, sitemap, robots all on `https://www.hfsoftwareservices.com/`.
- Lighthouse mobile targets: Performance ≥ 90, Accessibility ≥ 95, LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- No tracking scripts. If analytics are wanted later, leave a commented slot for a privacy-friendly one.

## Deliverables

1. `index.html`, `styles.css`, minimal `script.js`, `/upwork/index.html`, optimized images, updated `og` image, `sitemap.xml`, `robots.txt`.
2. A `CHANGELOG.md` entry listing what moved, what was cut and why, mapped to findings in the audit.
3. A short `COPY.md` with the three headline options, the final copy per section, and the list of `{{PLACEHOLDER}}` values still to fill.
4. Screenshots at 375px and 1440px, and the result of the 38-point checklist in `.agents/skills/landing-page-ux-conversion/references/audit-checklist.md` with each item ticked or explained.

## Acceptance criteria

- With JavaScript disabled, at 375px, the H1, subhead and primary CTA are visible without scrolling.
- Wheel and touch scrolling is never captured by a component.
- The primary CTA is reachable in one click from the hero, the nav and the sticky mobile bar, and it opens the scheduler.
- Every metric is traceable to one case study with the same value.
- No banned hero words; "you/your" outnumber "I/my" on the page.
- No invented testimonials, clients, prices or numbers; placeholders are visibly placeholders.
- The `/upwork` variant contains no email, phone, form or scheduler.
