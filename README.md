<p align="center"><img src="public/assets/icon-256.png" width="96" alt="Halodial"></p>
<h1 align="center">halodial.github.io</h1>
<p align="center">The website for <a href="https://halodial.github.io">Halodial</a>, a dial for your Mac that opens under your pointer.</p>

Next.js (App Router, TypeScript), exported as a static site, with GSAP for motion and Lenis for smooth scrolling.
The hero dial (`components/HeroDial.tsx`) is an animation of the real flow, drawn in SVG with the app's own geometry
(`lib/dial.ts`) and Softstroke icons (`lib/icons.ts`). The Try it section (`components/Playground.tsx`) is the real,
interactive dial with its click sounds (`lib/playground.js`, ported from the first site). Pages: home, /formats,
/help, /changelog (update it with each release), /privacy. `public/install.sh` is the one-line installer.

- `npm install`, then `npm run dev` and visit http://localhost:3000
- `npm run build` writes the site to `out/`; pushing to `main` deploys it to GitHub Pages (`.github/workflows/deploy.yml`)

© 2026 Sarthak Kamble. All rights reserved.
