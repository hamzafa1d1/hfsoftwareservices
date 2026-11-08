# DESIGN.md — "Dispatch" (v2, 2026-11-01)

The single source for how the portfolio looks and moves. v1 ("The Loop", cream paper + mono labels + one teal signal) was rejected for looking AI-made. v2 follows the rules of the most-used anti-slop design skills; the rule sources are listed at the end.

## Direction in one sentence

A real ticket travels through a real delivery line: the page is a dispatch floor where one physical object, the ticket, passes through nine gates in 3D as you scroll, and every claim on the page is something that ticket picked up on the way.

## What v1 did that we no longer do

| v1 tell | Rule source | v2 instead |
|---|---|---|
| Geist + Geist Mono + Bricolage (three "tasteful free fonts") | avoid-ai-design, taste-skill (max 2 families, no mono outside code) | One family: **Archivo** (variable width + weight) |
| Cream paper ground, near-black + one teal signal | avoid-ai-design ("Claude look", "acid signal") | Concrete grey ground, ink, **signal orange** used on the action and the "concerns" moment only |
| Tracked uppercase mono eyebrows, `01 ·` numbering, `A · B · C` meta strings | hallmark, taste-skill, avoid-ai-design | Plain sentences. Headings carry the structure |
| One coloured word in every headline | all three | Solid headlines |
| Card grids, rounded-2xl, hairlines, shadows, glass nav | taste-skill, avoid-ai-design | Field colours, tone steps between surfaces, square corners, solid nav |
| Same fade-up on every section; count-up numbers; arrows on CTAs | avoid-ai-design | A different entrance per section, scrubbed scenes, static numbers set huge, plain labels |
| SVG ring standing in for "media" | taste-skill (hero media ≥ half the first screen) | Full-bleed WebGL scene |

## Palette (one ground, one ink, one accent)

| Role | Value | Notes |
|---|---|---|
| Ground | `#E4E6E8` concrete | page and 3D background |
| Ground step | `#D8DBDE` | the only way surfaces separate (tone step, no lines) |
| Paper | `#F6F7F8` | the PR document field |
| Ink | `#0E0F10` | text, ink field sections, gate frames |
| Ink step | `#1B1D20` | rows on the ink field |
| Signal | `#FF4F12` | primary action, Review-gate flash, ticket stamp, one field section. Ink on signal = 6.9:1 |
| Muted | `#4A4F55` on ground (7.0:1) · `#A9AFB6` on ink (8.3:1) | secondary text |

No gradients anywhere. No shadows on resting elements.

## Type — Archivo only

| Use | Settings |
|---|---|
| Display | wdth 62–68, wght 800, `clamp(3.4rem, 9vw, 9.5rem)`, leading .86, tracking −0.035em. Two lines max, ~32 characters |
| Giant numbers | wdth 62, wght 800, up to 24vw |
| Statement / quote | wdth 100, wght 500, ≤ 36px desktop / 24px phone, ≤ 25 words |
| Body | wdth 100, wght 400, 18–19px, leading 1.5, ≤ 70ch, full ink |
| Small | 15px, sentence case. Never uppercase-tracked |

## Layout

- Equal outer margins (24px phone, 32px desktop), 12-column grid, sections 160–240px apart.
- Each adjacent section uses a different composition: full-bleed 3D → pinned split → document → giant numbers on ink → kinetic lines on signal → two-column list → portrait + quote → closing action on ink.
- Buttons are square, decided once. Nav: wordmark, three links, one action, solid ground colour.

## Iteration 3 (2026-11-08): e2e audit fixes

A full scroll audit (desktop 1440 px, phone 390 px, a frame every half screen) found the "glitchy" feel came from structure, not bugs:

- The camera scraped past gate posts, so black or white bars filled half the screen. **Now:** a 30° lens from further out, level with the ticket.
- Step names appeared two or three times (3D label, HTML heading, the next step half-visible). **Now:** no 3D labels; each step is one solid card with a nine-segment progress rail, scrubbed in and out so only one card is ever on screen. Steps are 80% of a screen.
- Step and hero text sat on improvised grey highlight boxes and, on phones, ran over the ticket. **Now:** solid card and a solid hero panel on phones.
- Giant case numbers drifted sideways into each other and "15min" meant nothing. **Now:** they grow in place and carry a caption ("worst request in two days of logs"); the monitoring figure is 16 signals.
- The modules marquee repeated each name four times and cut words at both edges. **Now:** three rows, name, status, description.
- Anchor links land below the header; list items rise instead of entering from off-screen; on phones About shows its heading before the photo.

## Iteration 5 (2026-11-08): simpler page, one 3D object, high-level content

Feedback: still not smooth enough and hard to follow, with too much detail. This iteration supersedes the journey sections below.

- **3D:** one object in the hero only: a glossy ink ribbon shaped as an infinity loop (the delivery loop), with signal-orange arrows gliding along it. It runs on its own clock, sways gently, follows the pointer and tilts away as the hero scrolls out. Nothing is pinned, snapped or scroll-scrubbed.
- **Structure:** hero → How I can help (six use cases, one line and one proof each) → The flow (four steps with the two human gates) → When I join your project (four benefits) → Skills (six groups and credentials) → Selected results (four numbers) → About → Questions → Contact.
- **Length:** about 8,000 px on desktop instead of about 15,000.
- **Motion:** one reveal style (rise and fade, staggered within a group), a line that draws through the four flow steps, and a slow portrait zoom.

## Iteration 4 (2026-11-08): arrows instead of gates

The gate frames read as walls the ticket had to squeeze through. The process is flow, so the scene is now arrows:

- **Arrow road:** a stream of small chevrons flows along a curved route on the floor, seen from a high three-quarter camera, and speeds up while moving between phases.
- **Phase markers:** one big chevron per phase: light ahead, black once passed, lifted while current. Approve and Human review are double chevrons, the human sign-offs.
- **Review:** when the journey settles on Review, its arrow turns signal orange, an orange U-turn arrow grows out of it, and the ticket rides it back to Build before coming forward and passing ("Review pass").
- **Less scrolling:** the journey holds in place and each scroll settles on the next phase (GSAP snap). Nine phases take 100svh + 8 × 42svh instead of 740svh. A phase bar (desktop: names; phone: previous/next) jumps straight to any phase.
- **Fallbacks unchanged:** no JS or reduced motion keeps the plain list of nine cards.

## The 3D scene

Three.js (pinned 0.187.0), bundled and tree-shaken into `assets/js/ (main.js loads first; scene.js with three.js is fetched when the page is idle)` by esbuild. The bundle includes GSAP 3.15.0 + ScrollTrigger.

- **Gates**: nine door-like frames receding into fog along a gentle S-curve. Approve and Human review are double frames (human gates). Each gate carries its name.
- **Ticket**: a rounded slab with a printed face (canvas texture), the same ticket as the PR exhibit. Its stamp changes as it passes gates: *Plan frozen*, *Concerns*, *Pass*, *Evidence attached*, *PR open*, *Merged*, *Shipped*.
- **Events**: a clear shell closes around it at Approve (the frozen plan); the Review gate flashes signal orange and kicks it back toward Build, then it passes; a light plane scans it at QA; at Ship it accelerates through; at Retro it slows and settles.
- **Camera**: follows behind the ticket, with framing offset right on desktop so the step text has the left column.
- **Fallback**: `assets/poster.webp`, rendered from the scene, shows with no JS, no WebGL, or reduced motion.

## Motion inventory (≥ 16 moving elements; taste-skill fails pages under 8)

| # | Element | Move |
|---|---|---|
| 1 | Hero headline lines | mask reveal, 90ms stagger, expo.out 1.2s |
| 2 | Hero text + action | rise 24px, after the headline |
| 3 | Ticket idle | float + pointer parallax |
| 4 | Gates | fog depth, slight sway |
| 5–9 | Journey (pinned) | ticket travel, camera follow, shell close, Review flash + kick-back, QA scan |
| 10 | Step text | name slides in from the left, sentence follows (60–90ms) |
| 11 | PR document | lines unmask top to bottom, checks stamp in |
| 12 | Case numbers | scrubbed scale + drift across each case |
| 13 | Module lines | scrubbed horizontal travel in opposite directions |
| 14 | Portrait | scrubbed scale 1.18 → 1 |
| 15 | Closing headline | mask reveal |
| 16 | Nav | hides on scroll down, returns on scroll up |
| 17 | Buttons | press (scale .97) and hover (ink ↔ signal) |

Only transform, opacity and clip-path animate. `prefers-reduced-motion: reduce` disables all of it, shows the poster, and keeps every word.

## Rule sources

- taste-skill: github.com/Leonxlnx/taste-skill (`skills/taste-skill/SKILL.md`)
- hallmark: github.com/nutlope/hallmark
- avoid-ai-design: github.com/funboy322/avoid-ai-design
- impeccable: github.com/pbakaus/impeccable
