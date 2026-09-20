---
name: hf-portfolio-redesign
description: Orchestrates a conversion-focused redesign of hfsoftwareservices.com (Hamza Faidi's freelance portfolio) so it wins AI-agent / agentic-dev clients from Upwork and direct referrals. Use when asked to redesign, rewrite, re-position, audit, or add sections to the portfolio site, or when generating a design prompt for it. Pulls in the sibling skills upwork-portfolio-conversion, ai-agent-dev-positioning, landing-page-ux-conversion and frontend-design, and carries the audit of the current site plus the ready-to-run Claude design prompt.
---

# HF Portfolio Redesign

Single entry point for any work on the portfolio site in this repo. The goal is not "a prettier site"; it is a page that turns an Upwork prospect or referral into a booked call with an AI-agent / automation engineer they trust.

## When this fires

- "redesign / rework / refresh the portfolio"
- "rewrite the hero / services / case studies"
- "make the site convert" / "position me as an AI agent dev"
- "audit the site" / "what's wrong with the current page"
- "give me a design prompt for the site"

## Read first (in this order)

1. `references/current-site-audit.md` — inventory of the live site, ranked findings, what to keep. Do not re-derive; extend it if you find something new.
2. `../ai-agent-dev-positioning/SKILL.md` — who the buyer is, headline formulas, offer ladder, jargon to avoid.
3. `../upwork-portfolio-conversion/SKILL.md` — section blueprint, proof elements, Upwork-specific behaviour and ToS constraints.
4. `../landing-page-ux-conversion/SKILL.md` — UI/UX + CRO rules and the 40-point audit checklist.
5. `../frontend-design/SKILL.md` — aesthetic craft once the structure and copy are fixed.
6. `references/design-prompt.md` — the assembled Claude design prompt (also published at `.github/prompts/portfolio-redesign/PROMPT.md`).

## Workflow

### 1. Confirm the target buyer and offer
Default (from the owner's stated goal): founders, ops leads and engineering managers at SMB/startup product companies who want production-grade AI agents, MCP servers and workflow automation, hired via Upwork or referral. The offer ladder is Audit → Sprint → Build/Retainer. Do not drift back to "senior backend engineer for hire" framing; that is the current site's main failure.

### 2. Fix structure before pixels
Section order that converts for this profile (see upwork-portfolio-conversion for the rationale):

1. Hero: outcome headline · one-line who/what · primary CTA (scheduler) · secondary CTA (see work) · 3 proof chips
2. Trust strip: employer/client logos + Upwork badge + certs
3. What I build: 3 offers as static cards, each with outcome, deliverables, "starts at" or timeline
4. Case studies: 3–4 in problem → approach → result format, real numbers, stack tags, one visual each
5. How an engagement runs: 3–4 steps, what the client does, what they get, timeline
6. Testimonials / quotes (add placeholders with a note to collect real ones)
7. About: short, buyer-oriented, with the legal/ops facts as a compact strip
8. FAQ: 5–7 objections (cost, timezone, IP, stack, how AI is evaluated, maintenance)
9. Final CTA: scheduler + form + email fallback

### 3. Copy rules
- H1 states the outcome, not the name. Name lives in nav and footer.
- "You" language, concrete nouns, numbers tied to a named case.
- Every metric appears once in the hero/proof and once in its case study with the same value.
- Lead with business outcome, then the mechanism (MCP, evals, .NET, AWS) as reassurance.

### 4. Non-negotiable technical rules
- Content is visible with JavaScript disabled. Motion adds; it never reveals.
- No scroll hijacking, no auto-advancing carousels for primary content.
- Primary CTA opens Cal.com/Calendly. Secondary: form with ≤ 4 fields, plus mailto fallback.
- Pin all third-party versions. Self-host fonts or use `font-display: swap` with a system fallback stack.
- Images: AVIF/WebP, sized to slot, explicit width/height.
- WCAG 2.2 AA contrast for all text (≥ 4.5:1), visible focus, `prefers-reduced-motion` honoured.
- Canonical, OG, sitemap, robots, JSON-LD all on `https://www.hfsoftwareservices.com/`. Add `ProfessionalService` + `Person` schema.
- Lighthouse mobile targets: Performance ≥ 90, Accessibility ≥ 95, LCP < 2.5 s, INP < 200 ms, CLS < 0.1.

### 5. Verify
Run the checklist in `../landing-page-ux-conversion/references/audit-checklist.md`. Screenshot at 375px and 1440px. Confirm the hero renders with JS off (`chrome://settings` or a `<noscript>` test). Confirm the scheduler opens.

## Outputs this skill produces

- Updated `index.html` / `styles.css` (or a rebuilt static site) in this repo.
- A refreshed `references/current-site-audit.md` if the live site changed.
- When asked for a prompt instead of code: hand over `references/design-prompt.md` verbatim, adjusting only the facts that changed.
