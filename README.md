# HF Software Services — one-page site

Static, single-page consultant site for Hamza Faidi (HF Software Services).
Plain HTML/CSS with one small inline script. No build step.

## Local preview

```sh
npx serve .
# or
python3 -m http.server 5173
```

## Deploy to Vercel

This repo is a zero-config static site. Vercel will serve `index.html` directly.

### Option A — Vercel CLI

```sh
npm i -g vercel
vercel        # first run: link/create project
vercel --prod # production deploy
```

### Option B — Git import

1. Push to GitHub.
2. In Vercel, **Add New… → Project → Import** this repo.
3. Framework preset: **Other** (no build command, no output dir).
4. Deploy. Then add the custom domain (`hfsoftware.dev`) in **Settings → Domains**.

`vercel.json` adds security headers and light caching.

## Things to swap before publishing

Edit `index.html` and replace the placeholder values:

- `mailto:hamza@hfsoftware.dev` — replace with your real domain email (do not ship a gmail address).
- Calendly / booking link — currently the "Book a call" buttons fall back to the email; replace with your Calendly URL once you have one.
- LinkedIn URL (`https://www.linkedin.com/in/hamzaelfaidi`) — verify it's current.
- Credly profile URL (`https://www.credly.com/users/hamza-faidi.c38f32e3`) — ideally deep-link each badge to its individual verification page.
- Canonical / OG URL (`https://hfsoftware.dev/`) — change if the live domain differs.

## Files

- `index.html` — page markup + structured data + inline reveal-on-scroll script
- `styles.css` — all styles (dark theme, Inter + JetBrains Mono)
- `og.svg` — Open Graph image (1200×630)
- `vercel.json` — security headers + cache rules
- `robots.txt`, `sitemap.xml` — SEO basics
