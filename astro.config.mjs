import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://policy-lens-ai-app.vercel.app',
  output: 'static',
  adapter: vercel({
    runtime: 'nodejs22.x'
  })
});
