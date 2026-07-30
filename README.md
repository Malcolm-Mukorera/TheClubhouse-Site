# The Clubhouse Website

Static website for The Clubhouse, a premium events and promotions agency led by Smillo.

## Stack

- Static HTML
- CSS
- Vanilla JavaScript
- No backend, no database, no secrets

## Local Preview

From this folder:

```bash
python3 -m http.server 8090
```

Then open:

```text
http://127.0.0.1:8090
```

## GitHub Pages

This repo includes `.github/workflows/pages.yml`, which publishes the folder contents as a static GitHub Pages site.

For a standalone repository:

1. Push this folder as the repository root.
2. Go to GitHub repository settings.
3. Enable GitHub Pages from GitHub Actions.
4. Push to `main`.

## Vercel

This project can be imported into Vercel as a static site.

- Framework preset: Other
- Build command: leave empty
- Output directory: `.`
- Install command: leave empty

Security headers are configured in `vercel.json`.

## Content Notes

- CEO portrait: `assets/images/smillo-ceo.jpg`
- Hero image: `assets/images/hero-event.png`
- Smillo WhatsApp: `+27 61 402 6217`
- Social feed data: `assets/data/social-feed.json`

Instagram and TikTok can be connected later through their official APIs. WhatsApp Status cannot be embedded publicly through the official WhatsApp platform.
