# HF Software Services — one-page site

Static, single-page consultant site for Hamza Faidi (HF Software Services), built from the Claude Design file in `design/HF Software Services.dc.html`. Plain HTML/CSS with one small progressive-enhancement script. No build step; every piece of content renders with JavaScript disabled.

## Local preview

```sh
python3 -m http.server 5173
```

## Deploy

Pushes to `main` deploy to Vercel through `.github/workflows/deploy.yml`. `vercel.json` adds security headers and light caching.

## Things to fill in

Search the source for `TODO`:

- `script.js` → `CONFIG.SCHEDULER_URL` (Cal.com / Calendly). Until set, the "Pick a slot" panel shows an email fallback.
- `script.js` → `CONFIG.FORM_ENDPOINT` (Formspree, Basin, …). Until set, "Send the brief" opens a prefilled email.
- `index.html` → offer cards: replace "quoted after the audit" with a price floor once decided.
- `index.html` → WhatsApp link (commented out until a business number exists).
- `index.html` → testimonials section is `hidden`; unhide and fill with real quotes only.
- `scripts/build-upwork.py` → `UPWORK_PROFILE_URL`, then re-run the script.
- Nav pill / sticky bar month ("October") — update as availability changes.

## Upwork variant

`upwork/index.html` is generated from `index.html` by `scripts/build-upwork.py`. It carries no email, phone, form or scheduler (Upwork forbids off-platform contact before a contract) and points every CTA at the Upwork profile. It is `noindex` and disallowed in `robots.txt`. Link **this** URL from the Upwork profile, never the root.

```sh
python3 scripts/build-upwork.py
```

## Files

- `index.html` — page markup + JSON-LD (Organization, Person, ProfilePage, Service/Offers, FAQPage)
- `styles.css` — all styles; palette and type lifted from the design file (Archivo · Public Sans · IBM Plex Mono, paper `#FAF8F3`, ink `#1C1A17`, accent `#B8330F`)
- `script.js` — footer year, optional scheduler embed, brief form handoff
- `upwork/index.html` — generated contact-free variant
- `hamza.webp`, `hamza-400.webp` — portrait (source in `design/hamza-source.png`)
- `og.png` — 1200×630 Open Graph image
- `design/` — the Claude Design export and its extracted template, kept as the design source of truth
- `vercel.json`, `robots.txt`, `sitemap.xml`

## Redesign research & skills

Research for the conversion-focused redesign (goal: win AI-agent / agentic-dev clients via Upwork and referrals) lives as agent skills under `.agents/skills/` and is mirrored into `.claude/skills/` via symlinks so Claude Code picks them up automatically.

| Skill | What it holds |
| --- | --- |
| `hf-portfolio-redesign` | Entry point. Audit of the live site (`references/current-site-audit.md`) and the ready-to-run design prompt (`references/design-prompt.md`). |
| `ai-agent-dev-positioning` | Buyer psychology, headline formulas, offer ladder, pricing bands and 2026 Upwork demand data for AI-agent freelancers. |
| `upwork-portfolio-conversion` | Section blueprint, case-study format, proof ranking, booking flow, Upwork ToS rules for linked sites. |
| `landing-page-ux-conversion` | UI/UX + CRO rules with sources and a 38-point audit checklist. |
| `frontend-design` | Anthropic's aesthetic craft skill (vendored). |

The design prompt is also published at `.github/prompts/portfolio-redesign/PROMPT.md`. Fill the `{{PLACEHOLDER}}` values (scheduler URL, prices, Upwork profile, contact) before running it.
