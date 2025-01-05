import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  images: [
    'public/favicon.svg',
    'public/favicon.ico',
    'public/apple-touch-icon.png',
    'public/pwa-192x192.png',
    'public/pwa-512x512.png',
  ],
})
