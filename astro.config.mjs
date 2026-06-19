/**
 * @ts-check
 */
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://kohchangsolarcell.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'th'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
