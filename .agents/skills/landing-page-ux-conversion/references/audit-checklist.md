# Landing page conversion audit — 38 checks

Tick every item before shipping a services landing page. Sources for each rule are in `research-report.md`.

## Hero and messaging
- [ ] Headline passes the "read only this" test: what you do, for whom, with what outcome
- [ ] Subhead (≤ 2 sentences) explains how + why it's believable
- [ ] One primary CTA above the fold; same CTA repeated after each proof/objection block
- [ ] At least one proof element visible above the fold (client count, named client, quantified result)
- [ ] Copy reads at grade 5–7 (Hemingway / readable.com); no 3+ syllable jargon in headline or subhead
- [ ] "You/your" outnumber "I/we" across the page
- [ ] No conversion-competing links above the fold (only anchor nav + CTA)

## Trust
- [ ] Testimonials include specific outcome, full name, role/company, real photo
- [ ] At least one link to a third-party review/profile (Google, Clutch, Upwork, LinkedIn, GitHub)
- [ ] Logos shown are recognisable to the buyer, or replaced with a numeric claim
- [ ] Real headshot and real work screenshots; no stock imagery
- [ ] Response-time promise stated and operationally true
- [ ] Availability/capacity statement is current and truthful
- [ ] Only recognisable certifications/partner marks shown
- [ ] Pricing packages or "from $X" published; a scoped guarantee/risk reversal exists
- [ ] Contact details (email, location/timezone) visible in header or footer

## Visual design
- [ ] Body text ≥ 16px; line length 50–75 ch (`max-width` set)
- [ ] All text ≥ 4.5:1 contrast (3:1 large text/UI) in both light and dark themes
- [ ] Single accent colour reserved for the primary CTA
- [ ] Touch targets ≥ 44×44 CSS px on mobile (anchor nav, social icons included)
- [ ] Light mode default; dark mode via toggle or `prefers-color-scheme`
- [ ] All non-essential motion gated behind `prefers-reduced-motion: no-preference`
- [ ] Any marquee/carousel pauses on hover/focus and stops for reduced-motion users; none auto-plays on mobile
- [ ] No scroll hijacking, no autoplay hero video

## Performance and SEO
- [ ] LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 (PageSpeed Insights, mobile)
- [ ] Hero image has `fetchpriority="high"`, explicit dimensions, AVIF/WebP + `srcset`, not lazy-loaded
- [ ] Fonts: WOFF2, ≤ 2 files, `font-display: swap/optional`, fallback `size-adjust`
- [ ] JSON-LD present and valid: `Person` + `ProfilePage`, `Service`/`Offer`, optional `Organization`
- [ ] FAQPage schema (if present) matches visible FAQ content exactly
- [ ] `og:image` 1200×630 < 1 MB, `og:title`/`og:description`, `twitter:card=summary_large_image`

## Booking / contact
- [ ] Inline scheduling embed (not popup-only) reachable within one click from the hero CTA
- [ ] Booking/intake asks 3–5 qualification questions (problem, budget range, timeline)
- [ ] Fallbacks present: `mailto:` and `wa.me` / `t.me` links, all monitored
- [ ] Nothing gated behind account creation

## Accessibility and i18n
- [ ] axe/Lighthouse: zero contrast, alt, label, empty-link/button errors
- [ ] Visible focus styles on all interactive elements; full Tab-only walkthrough works, including embeds
- [ ] `<html lang>` set; single `<h1>`; landmarks and skip link present
- [ ] Timezone, working hours and currency stated explicitly; scheduler auto-detects visitor timezone
