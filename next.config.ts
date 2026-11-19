import type { NextConfig } from 'next';

// A static site for GitHub Pages (halodial.github.io): `next build` writes plain files to out/.
const config: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default config;
