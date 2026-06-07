// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.GITHUB_PAGES ? 'https://satinderpahwa.github.io' : 'https://pivotmc.com',
  base: process.env.GITHUB_PAGES ? '/pivotmc/' : '/',
  integrations: [react(), mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});