// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The publishing address is supplied at build time so the same source works for
// either a <user>.github.io repository (BASE_PATH "/") or a project repository
// (BASE_PATH "/<repo>"). The GitHub Actions workflow sets both values.
// Local builds leave SITE_URL unset, so no canonical URLs or sitemap are generated
// until the real address is known.
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: site ? [sitemap()] : [],
  image: {
    responsiveStyles: false,
  },
  devToolbar: { enabled: false },
});
