// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';


// https://astro.build/config
export default defineConfig({
  site: import.meta.env.VITE_APP_URL,
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },
    imageService: "cloudflare"
  }),

  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [vue()],
  devToolbar: {
    enabled: false
  },

});