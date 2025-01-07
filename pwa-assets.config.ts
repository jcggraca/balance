import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: 'minimal',
  images: [
    'public/favicon.svg',
    'public/favicon-96x96.png',
    'public/apple-touch-icon.png',
    'public/web-app-manifest-192x192.png',
    'public/web-app-manifest-512x512.png',
  ],
})
