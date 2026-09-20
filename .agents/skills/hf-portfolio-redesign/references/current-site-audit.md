# Current site audit — hfsoftwareservices.com (snapshot 2026-09-20)

Source of truth: `index.html` (1,410 lines) + `styles.css` (1,586 lines), static, no build step, deployed on Vercel via GitHub Actions. Motion.js loaded from jsDelivr `@latest`.

## 1. Inventory — what the site holds today

### Positioning & copy
- **Title tag:** "Hamza Faidi — Software Engineer · .NET · AWS · API Systems" (backend framing, not AI-agent framing).
- **Eyebrow:** BACKEND · AI AGENTS · MCP · .NET · AWS
- **H1:** "Hamza Faidi" (a name, not a promise).
- **Lede:** "I build the backend systems and AI agents that product teams ship with confidence — MCP servers, test automation pipelines, and Jira · Confluence integrations that actually stick."
- **Sub:** "4 years across fintech and SaaS — shipping .NET / C# and AWS infrastructure, building AI agents and MCP integrations for dev & test automation workflows, and running zero-downtime migrations on live production databases."
- **Hero tags:** MCP Servers · AI Agents · Dev/Test Automation · Jira/Confluence · .NET/C#/AWS
- **Hero CTAs:** "Book a call →" (→ `#contact`, not a scheduler) · "View selected work" (→ `#work`)
- **Nav:** Work · Stack · About · "Available" pill · "Book a call" button (→ `#contact`)

### Sections (in DOM order)
1. Hero (two-column: copy + animated terminal aside) + credential bullets + tech-icon marquee
2. Metrics "brain hub" — ~60% faster delivery · 94% fraud precision · 100+ cards renewed · 1,000+ accounts protected
3. 01 / SERVICES "What I do" — 3D auto-advancing carousel: Backend & API design · Cloud infra & reliability · Intelligent automation & risk systems
4. 02 / WORK "Selected work" — arc carousel, 6 cards: Comp-platform rebuild with AI agents · Fraud detection (Mastercard) · MT940 bank statement integration · Provider-agnostic payments layer · Virtual-card renewal automation · Automated card suspension
5. 03 / STACK — pill list: C#/ASP.NET Core, TypeScript/Node, AWS, Azure, Terraform, SQL Server, Distributed systems, Payments, React, Angular
6. 04 / ABOUT — photo (hamza.png, 1.8 MB PNG, 1024²) + bio (Tunis, SUARL, Sup'Com, teaching, UTC+1, EN C1 / FR) + "Previously at" Clearco (Dec 2025 — present) · Expensya + engagement facts
7. 05 / CREDENTIALS & CONTACT — cert marquee (AWS SAA, AWS CCP, Terraform Associate, TOEIC C1) → Credly links · closing CTA "Need a senior backend engineer?" · Email · Book a call (mailto) · LinkedIn · Credly
8. Company note band (SUARL legal name) + footer

### Assets & tech
- Fonts: Manrope (all text) + JetBrains Mono, Google Fonts.
- Palette: bg `#FAFAF7`, soft `#EDE9E5`, text `#1C2B35`, muted `#6B7A85`, rule `#D9D4CE`, accent `#8DAEBF` (soft blue), violet `#9B8EA8`.
- Max content width 780px. Light theme only.
- Motion.js CDN `@latest` for hero stagger, carousels, scroll effects. Custom cursor glow. Scroll progress bar.
- Tech icons from cdn.simpleicons.org + devicon CDN (external image requests, 9 of them).
- Structured data: `Person` schema only. Canonical + OG still point at `https://hfsoftware.dev/` (wrong domain — live is hfsoftwareservices.com). OG image is `hamza.png` 800×800 declared, actual 1024×1024, 1.8 MB.
- Contact: `mailto:hamza@hfsoftware.dev` in markup (README says to replace; a later commit changed the email to hamza.faidi.software.eng@gmail.com but markup still has the hfsoftware.dev address in 2 places). No Calendly/Cal.com. No form.
- Security headers via vercel.json are good. sitemap/robots exist but reference old domain.

## 2. Findings — what blocks conversion

### Critical
1. **Mobile hero is invisible.** `.hero__copy > *` and `.hero__terminal` start at `opacity: 0` in CSS and rely on Motion.js to animate them in. In a 375×812 mobile viewport the H1 measured `opacity: 0`, `translateY(18px)` five seconds after load. A phone visitor (the majority of Upwork clients checking a link) sees a blank first screen. Rule: never gate critical content on JS.
2. **Scroll hijacking.** Wheel events over the services/work carousels are consumed by the carousel; three successive wheel scrolls at page centre did not advance the page. Visitors feel stuck and leave.
3. **No scheduler, no form.** Both "Book a call" CTAs resolve to an anchor or `mailto:`. Mailto breaks on desktop without a configured mail client and gives zero qualification info. The single most important conversion path is broken.
4. **Wrong positioning for the goal.** Title, meta description, OG copy and closing CTA all say "senior backend engineer / .NET / AWS". The stated goal is winning AI-agent / agentic-dev clients. The AI work is buried as "Pillar 03" and one of six cards.
5. **Zero social proof from humans.** No testimonials, no client quotes, no Upwork Job Success badge, no logos beyond a text list of former employers.

### High
6. **H1 is the name.** The headline slot is spent on "Hamza Faidi" instead of the outcome a buyer gets. Name belongs in the nav/logo.
7. **Metrics are unanchored.** "94% fraud precision", "~60% faster delivery" appear without a project, client type or timeframe, and the same fraud project reads "~79% accuracy" in its own card. Inconsistent numbers erode trust.
8. **Case studies have no structure.** Cards are 2–3 sentences with an "Outcome" line, no problem → approach → result → stack, no visuals, no link to detail.
9. **No offer / no packages / no process / no FAQ / no pricing signal.** Buyers cannot tell what it costs to start, how an engagement runs, or what "AI agent" work concretely includes.
10. **Carousel-heavy layout hides content.** Services and work are only readable one card at a time; SEO and skim-readers lose everything off-slide. Carousels test poorly for conversion.
11. **Stale/incorrect metadata.** Canonical, OG URL, sitemap, and structured-data URL point at hfsoftware.dev. OG image is a 1.8 MB square PNG; LinkedIn/Slack previews will look wrong.

### Medium
12. Accent `#8DAEBF` on `#FAFAF7` fails WCAG AA for text (≈2.3:1). Eyebrows and links are low-contrast (a recent commit tried to fix eyebrows).
13. External dependencies on load: Google Fonts, jsDelivr `motion@latest` (unpinned), 9 icon CDN images. Any one failing degrades the page; `@latest` can break silently.
14. 1.8 MB portrait PNG, lazy-loaded but still shipped at 1024² for a ~200px slot. Convert to AVIF/WebP ≤ 60 KB.
15. Custom cursor glow, progress bar, terminal typewriter, 3D tilt, counting numbers, four marquees. Motion budget is spent on decoration rather than on guiding the eye to the CTA.
16. Nav CTA hidden or clipped on mobile; "Available" pill has no text on small screens (just a green dot).
17. Content width 780px is narrow for a two-column hero; the terminal aside competes with copy at the same visual weight.
18. About section is long and self-referential (teaching, TOEIC, SUARL details) before any client benefit. Move legal/entity facts into a compact "How we work" strip.

## 3. What to keep

- The legal/operational clarity (registered SUARL, invoicing, EU hours, EN/FR) — buyers on Upwork care about contract cleanliness. Keep it, compress it.
- Verifiable certifications with Credly deep links.
- The six case studies as raw material; they contain real numbers and recognisable brands (Mastercard, Adyen, SWIFT MT940, Jira/Confluence MCP).
- The "Previously at" employers as a logo/trust strip.
- vercel.json security headers, GitHub Actions deploy, static no-build architecture.
- The calm, light, technical aesthetic direction (it reads senior); refine rather than replace.

## 4. Measurement notes for the redesign

Verify after rebuild:
- Hero text visible with JS disabled and at 375px width.
- Page scrolls freely with wheel/touch at every vertical position.
- Primary CTA opens a scheduler (Cal.com/Calendly) in ≤ 1 click; secondary path is a 3–4 field form with an email fallback.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, LCP < 2.5 s, CLS < 0.1.
- Every metric on the page traceable to one case study with the same number in both places.
- Title/OG/canonical/sitemap all on `https://www.hfsoftwareservices.com/`.
