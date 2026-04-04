// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // adapter: node({
  //   mode: 'standalone',
  // }),
  site: 'https://example.com',

  adapter: cloudflare(),
  integrations: [mdx(), sitemap()],
});