# HF Software Services portfolio

A static, accessible portfolio for Hamza Faidi. The site is plain HTML/CSS with a tiny script for the footer year; all content and navigation work without JavaScript.

## Preview

```sh
python3 -m http.server 5173
```

Open `http://localhost:5173`. The live domain is `https://www.hfsoftwareservices.com/`.

## Content and evidence

Public copy follows the private `hamza-career-skills` evidence library. Employer names appear only in the chronology strip. Client case studies are anonymized, and the legacy performance case distinguishes the shipped SQL indexes from an application change that was rolled back. The 100+ card count is scoped to one monitored rollout. Update claims from the evidence library before publishing new results.

`/upwork/` is a generated, noindex variant without direct contact links. Regenerate it after changing `index.html`:

```sh
python3 scripts/build-upwork.py
```

## Deployment

Pushes to `main` deploy through `.github/workflows/deploy.yml` to Vercel. Pull requests create preview deployments. `vercel.json` supplies security headers. The site has no framework build step.
