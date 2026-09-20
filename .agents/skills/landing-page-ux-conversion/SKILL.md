---
name: landing-page-ux-conversion
description: Evidence-based UI/UX and conversion-rate-optimization rules for a one-page services or portfolio site (hero, trust, typography, contrast, motion, Core Web Vitals, structured data, booking flow, copy, accessibility), each traceable to NN/G, Baymard, CXL, Unbounce, W3C or web.dev. Use when designing, building, reviewing or auditing any landing page, personal site or consultant site, choosing CTA/booking patterns, or when someone asks "why isn't my site converting". Ships a 38-point audit checklist in references/audit-checklist.md.
---

# Landing Page UX Conversion

Rules that move a services landing page from "looks nice" to "books calls". Full rationale and URLs in `references/research-report.md`; the tick-list in `references/audit-checklist.md`.

## Benchmarks to aim at

| Metric | Target | Why |
|---|---|---|
| Page conversion (lead-gen) | 8–15% | Unbounce all-industry median is 6.6%; services pages sit in the upper half |
| Reading level | Grade 5–7 | 11.1% vs 5.3% conversion for "professional" copy |
| Links competing with the CTA | 1 | 13.5% with one link vs 10.5% with 5+ |
| Form fields | 3–5 | Completion drops from ~23% at 3 to ~11% at 7 |
| LCP / INP / CLS (mobile p75) | ≤ 2.5 s / ≤ 200 ms / ≤ 0.1 | Core Web Vitals thresholds |
| Text contrast | ≥ 4.5:1 (3:1 large/UI) | WCAG 2.2 AA; low contrast is the #1 web failure |

## Above the fold (users spend ~57% of attention here)

1. **Headline** passes the "read only this" test: what, for whom, outcome. 6–10 words. Specific enough that a competitor couldn't reuse it.
2. **Subhead** (≤ 2 sentences): how it works + why it's believable.
3. **One primary CTA**, verb + outcome ("Book a 20-minute fit call"), never "Submit" or "Contact". Repeat it after every proof/objection block. On mobile, a sticky bottom CTA bar is worth +15–25%.
4. **One proof element**: named client, number, or badge.
5. Nothing else that links away.

## Page order that converts

nav → hero → trust strip → CTA → 3–6 value/objection blocks (each: blunt header, paragraph answering an objection, image of real work) → repeat CTA → FAQ → footer with contact and timezone.

## Trust rules

- Testimonials: specific outcome + full name + role/company + photo. Specific anonymous beats vague attributed.
- Link out to third-party proof (Upwork, LinkedIn, GitHub, Google). On-site quotes alone are discounted.
- Logos only if the buyer recognises them; otherwise a number ("12 SMBs shipped").
- Real headshot, real screenshots. Decorative stock imagery is ignored.
- Publish 2–3 packages or "from $X". Upfront disclosure is a core credibility factor.
- Response-time promise and availability line, both true.
- One scoped guarantee ("paid discovery sprint, refundable if no working prototype").

## Visual design rules

- Body 16–18px, 50–75 characters per line, `max-width: 70ch`.
- One accent colour, used only for the primary action (isolation effect beats any "best colour").
- Touch targets ≥ 44×44 CSS px.
- Light mode default; dark hero acceptable, long copy never light-on-black at small sizes.
- Motion opt-in: gate behind `prefers-reduced-motion: no-preference`. No scroll hijacking, no autoplay video, no auto-advancing carousels or marquees without pause, none on mobile.
- Fits a technical consultant in 2026: bento grid for services/results, editorial type, glass only on nav/cards. Skip kinetic type, brutalist anti-grid, heavy 3D, gradients behind text.
- Don't cite "whitespace = 20% comprehension"; it's a misattribution. Use whitespace because people scan in an F-pattern.

## Performance and SEO rules

- Hero image: `fetchpriority="high"`, explicit width/height, AVIF/WebP + `srcset`, never lazy.
- Fonts: WOFF2, ≤ 2 files, `font-display: swap` or `optional`, preload the critical one, `size-adjust` fallback. Self-host if possible. Pin every CDN dependency.
- JSON-LD: `Person` + `ProfilePage`, `Service`/`Offer` per package, `Organization` if trading as a company. FAQPage only if it mirrors visible FAQ (no rich result expected).
- OG image 1200×630 under 1 MB, key text in the central 1080×600; `twitter:card=summary_large_image`.

## Booking flow

- Primary: inline Cal.com/Calendly embed reachable in one click. Inline beats popup by 30–40%.
- Qualification on the booking page: problem, budget range, timeline (3–5 questions).
- Fallbacks: `mailto:` and `wa.me/<E.164>` (60%+ reply rates for international buyers, only if answered fast). `t.me` for MENA/Eastern Europe.
- Never gate content behind sign-up.
- AI chat widget optional; for an AI developer it's also a demo, but it must not compete with the CTA or hurt INP.

## Copy rules

Outcome-first headline; "you" outnumbers "I"; objections answered in blocks and a 5–7 item FAQ (who owns the code, what if you disappear, timezone, cost, how AI quality is measured); every claim quantified or rounded down to something provable.

## Accessibility floor

Fix the WebAIM top six: contrast, alt text, form labels, empty links, empty buttons, missing `lang`. Visible focus (≥ 3:1, 2px), one `<h1>`, landmarks, skip link, Tab-only walkthrough including embeds. State timezone, hours and currency.

## How to use

1. Run `references/audit-checklist.md` against the page.
2. Fix hero and CTA first, then trust, then performance. Design polish last.
3. Re-run PageSpeed Insights (mobile) and axe before declaring done.
