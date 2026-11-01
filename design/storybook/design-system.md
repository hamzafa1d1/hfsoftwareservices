# Design system — "The Loop"

## Tokens

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0F14` | dark sections, body text on paper |
| `--ink-2` | `#131A23` | raised surfaces on dark |
| `--ink-line` | `#263241` | hairlines on dark |
| `--paper` | `#F4F1EA` | light sections |
| `--paper-2` | `#ECE7DC` | raised surfaces on paper |
| `--line` | `#D6CFC0` | hairlines on paper |
| `--muted-dark` | `#9AA7B6` | secondary text on dark (7.4:1 on ink) |
| `--muted` | `#55606C` | secondary text on paper (5.9:1) |
| `--pass` | `#2DD4BF` | passed checks, primary CTA on dark (10.9:1 on ink) |
| `--pass-ink` | `#0F6B62` | teal text on paper (5.8:1) |
| `--fail` | `#F5A524` | failed check / "concerns → back to build" only (9.9:1 on ink) |
| `--fail-ink` | `#9A5A00` | amber text on paper (5.2:1) |
| `--gate` | `#E8E2D4` | human-gate ring marker on dark |

Amber means exactly one thing: a check said no and work went back. It is never decoration.

## Type

- Display: **Bricolage Grotesque** 600–800, tight tracking (−0.03em), `clamp(2.6rem, 6.4vw, 5.6rem)` for H1.
- Body: **Geist** 400/500, 1.0625rem, line-height 1.6, max 66ch.
- Mono: **Geist Mono** 400/500 for stage labels, tags, numbers, eyebrows (uppercase, 0.08em tracking, 0.75rem).
- Big numbers: Bricolage 700, tabular figures where available.

## Grid and spacing

Container 1200 px, 24 px gutters (16 px under 600 px). Section padding `clamp(72px, 10vw, 140px)`. Spacing scale 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72.

## Components

- **Loop (3D)** — 9 nodes on a ring, the scene tilted `rotateX(62deg)`, the ring spinning on Z (40 s per turn). Labels counter-rotate, so they always face the viewer. Human gates (Approve, Human review) get a double outline. A token orbits the ring; on its first pass at Review it flashes amber and drops back to Build. Pointer tilt ±6°.
- **Mini loop (sticky)** — flat SVG ring, 9 dots; the active step is filled teal. Desktop only, left column of the Method section.
- **Step card** — mono index `03 / 09`, step name, one-line action, "Output:" line, optional "Gate" pill.
- **Stage tag** — mono pill `LOOP · REVIEW → QA`, appears at the top of each case.
- **Case chapter** — eyebrow (sector, anonymised), H3 outcome title, three columns (Problem · What I did · Result) collapsing to one, result cards with big numbers, stack tags, a limits line in small mono ("Staging measurement", "In review").
- **PR exhibit** — a code-review-style card: title, status chips, body sections (Problem / Root cause / Scope / Tests / Evidence), checks list with ticks. Labelled "Reconstructed from a real PR · names removed".
- **Signal grid** — 16 dots, 4×4, a slow staggered pulse (illustration only, labelled).
- **Buttons** — primary: teal fill on dark / ink fill on paper, 48 px tall, 14 px radius. Secondary: text link with an arrow.

## Motion

| Element | Motion | Duration / easing | Reduced motion |
|---|---|---|---|
| Hero ring | continuous Z rotation | 40 s linear | static |
| Token | orbit, one amber detour | 9 s loop | hidden |
| Reveal | translateY(16px) + opacity, scroll-driven | `view()` entry 0–30% | none |
| Night band | background ink fade-in, scroll-driven | entry range | static dark |
| Counters | count up once on view | 1.1 s, ease-out | final value |
| Mini loop | active step change | 250 ms colour | instant |
| Signal grid | staggered pulse | 3 s, 3 cycles | static |

Easing: `cubic-bezier(.2,.7,.2,1)`.
