import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  site: 'https://www.qingdao-shi-china.com',
});
