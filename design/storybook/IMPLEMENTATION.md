# Implementation plan — storybook redesign

Version 1.0 · 2026-11-01 · branch `design/storybook`

Inputs: [STORYBOOK.md](STORYBOOK.md) (narrative and motion), [design-system.md](design-system.md) (tokens and components), and the work summary PDF for Jun–Oct 2026. The PDF is stored privately as source **P1** in `hamza-career-skills`, with claims **CC17–CC28**.

## 1. Goal

Rebuild `index.html` as a scroll story about **how Hamza ships**: a gated, AI-assisted delivery loop, shown working on real anonymised cases. It should be tangible (numbers, a real PR shape, real constraints), modern (one 3D object, scroll-linked motion) and still pass every rule in `hf-portfolio-redesign`.

## 2. Decisions

| Decision | Choice | Why |
|---|---|---|
| 3D technique | **CSS 3D transforms** (`preserve-3d`, `rotateX/rotateY`), no WebGL library | 0 KB of dependencies (Three.js is ~160 KB gzipped). Renders without JavaScript, works in every engine including Firefox, and is easy to freeze for reduced motion. JS only adds pointer tilt (< 2 KB). |
| Scroll motion | CSS scroll-driven animations in `@supports (animation-timeline: view())`, plus an IntersectionObserver for the sticky loop's active stage | Chrome, Edge and Safari 26+ get it natively. Firefox stable gets the static page, which is complete. |
| Loop content | The real nine-step ASDLC from P1 (Brainstorm → Plan → Approve → Build → Review → QA → Ship → Human review → Retro) | Replaces the guessed 8-stage ring from v0.1. Two human gates are marked. |
| Lead metrics | P1 measured figures (CC17–CC26) | P1 is newer and more specific than D1. The "20 min → 20 s" headline is retired; see the conflict note in CC20. |
| Anonymisation | Case studies say "US HR SaaS platform" and "corporate payments platform"; no customer, colleague, vendor, repo or ticket names | Library rule. Employers appear only in the chronology strip. |
| Framework | None. Static HTML/CSS/vanilla JS | Existing Vercel deploy, CI checks and the `/upwork` generator keep working. |
| Fonts | Google Fonts, `display=swap`: Bricolage Grotesque (display), Geist (body), Geist Mono (labels/numbers) | Distinct from the old DM Sans/Instrument Serif; avoids Inter. |

## 3. Page map (ids are anchor targets)

| # | Section | id | Theme | Claims |
|---|---|---|---|---|
| 0 | Hero + 3D loop | `top` | dark | CC17, CC24 |
| 1 | Numbers strip (Jun–Oct 2026) | — | dark | CC17, CC26 |
| 2 | The Loop, step by step (sticky ring) | `method` | paper | CC24 |
| 3 | Exhibit: what a PR looks like | `evidence` | paper | CC25 |
| 4 | Cases (4 chapters with stage tags) | `work` | paper → dark band → paper | CC20, CC21, CC18/19, CC22 + CC10 |
| 5 | Built with the loop: three modules in ~7 weeks | `modules` | paper | CC26 |
| 6 | Also: rebuild discovery, triage agent, toolchain | — | paper | CC23, CC27, CC28 |
| 7 | Earlier: payments | — | paper | EX01, EX03, EX04, EX05 |
| 8 | Recommendation | — | paper | L1 |
| 9 | About + chronology | `about` | paper | profile, ED01 |
| 10 | How we'd work | `process` | paper | offer |
| 11 | Contact + loop finale | `contact` | dark | — |

## 4. Files

| File | Change |
|---|---|
| `index.html` | Rewritten. Keeps the `<!--@public-->` / `<!--@upwork … @upwork-->` markers, `.inline-link` and `.contact-social` hooks used by `scripts/build-upwork.py`. JSON-LD updated. |
| `styles.css` | Rewritten from the tokens in `design-system.md`. |
| `script.js` | Year, pointer tilt on the 3D loop, active-stage observer, counters. Each feature exits early on reduced motion. |
| `upwork/index.html` | Regenerated with `python3 scripts/build-upwork.py`. |
| `design/storybook/loop.svg` | The loop as a standalone design asset; also inlined in the page as the no-3D fallback. |
| `README.md` | Content section mentions P1/CC17–CC28. |

## 5. Tasks

1. Evidence: add P1 and CC17–CC28 to `hamza-career-skills` (done, branch `claims/work-summary-2026-10`).
2. Design files: STORYBOOK v0.2, design-system.md, loop.svg, updated Claude Design prompt.
3. Markup: write every section in semantic HTML, with all copy present with no JS.
4. Styles: tokens, layout, the CSS 3D loop, chapter components, the dark "night shift" band, responsive 375 → 1440.
5. Motion: hero loop rotation and token, reveal-on-view, sticky stage highlight, counters; all gated by `prefers-reduced-motion: no-preference`.
6. Regenerate `/upwork`, run `scripts/check-site.py`.
7. Verify in Chromium (Playwright): screenshots at 375 and 1440, JS disabled, reduced motion, no console errors, no horizontal overflow, contrast spot checks.

## 6. Acceptance criteria

- Every number on the page maps to a claim ID (see the table in §3), keeps its qualifier, and appears with the same value everywhere.
- No customer, colleague, vendor, repo or ticket names; no security mechanics beyond "tenant isolation"; no targets presented as results (daily releases, cost savings, cycle time).
- Page complete and readable with JavaScript off; 3D ring visible as a static object.
- `prefers-reduced-motion: reduce` → no rotation, no counters, no reveal offsets.
- No horizontal scroll at 375 px; tap targets ≥ 44 px; one `<h1>`; skip link; visible focus.
- `scripts/check-site.py` passes and `/upwork` has no direct contact details.
- No new third-party scripts. Total JS < 5 KB.

## 7. Open items for Hamza

- Approve dropping "20 min → 20 s" in favour of the P1 measured figures (CC20).
- Scheduler URL and price floors (still open).
- Confirm it's OK to describe the security audit at the level in CC21.
- OG image still shows the old design; regenerate after sign-off.
