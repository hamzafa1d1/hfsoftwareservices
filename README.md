# HF Software Services

A static, accessible portfolio for Hamza Faidi. The site is plain HTML/CSS with a tiny script for the footer year; all content and navigation work without JavaScript.

[Visit the portfolio](https://www.hfsoftwareservices.com/)

Professional portfolio and contact site. Case studies summarize commercial work; this repository contains the website, not the source code of employer systems.

## Preview

```sh
python3 -m http.server 5173
```

Open `http://localhost:5173`. The live domain is `https://www.hfsoftwareservices.com/`.

## Content and evidence

Public copy follows the private `hamza-career-skills` evidence library. Employer names appear only in the chronology strip. Client case studies are anonymized, and the legacy performance case distinguishes the shipped SQL indexes from an application change that was rolled back. The 100+ card count is scoped to one monitored rollout. Claims added from the Jun–Oct 2026 work summary are CC17–CC28 (source P1). The page design and its rationale live in `design/storybook/` (storybook, implementation plan, design system). Motion (GSAP) lives in `src/main.js` and the 3D scene (Three.js) in `src/scene.js`. Both are bundled into `assets/js/`: `main.js` loads first, and `scene.js` is fetched once the page is idle. After editing either, run `cd tools && npm ci && npm run build:scene`. The site itself still has no build step. Design rules: `design/storybook/DESIGN.md`. Update claims from the evidence library before publishing new results.

`/upwork/` is a generated, noindex variant without direct contact links. Regenerate it after changing `index.html`:

```sh
python3 scripts/build-upwork.py
```

## Deployment

Vercel’s GitHub integration deploys `main` to production and pull requests to preview. `.github/workflows/deploy.yml` validates the static pages and generated Upwork variant without a deployment secret. `vercel.json` supplies security headers. The site has no framework build step.
