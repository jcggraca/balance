import type { ManifestOptions } from 'vite-plugin-pwa'
import babel from '@rolldown/plugin-babel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const manifest: Partial<ManifestOptions> = {
  name: 'Balance',
  short_name: 'Balance',
  description: 'Balance your money and time',
  theme_color: '#242424',
  background_color: '#242424',
  display: 'standalone',
  scope: '/',
  start_url: '/',
  icons: [
    {
      src: 'favicon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any monochrome',
    },
    {
      src: 'favicon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
    },
    {
      src: 'favicon.ico',
      sizes: '96x96',
      type: 'image/x-icon',
    },
    {
      src: 'apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
    {
      src: '/web-app-manifest-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/web-app-manifest-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
  screenshots: [
    {
      src: 'screen-capture.png',
      sizes: '640x320',
      type: 'image/png',
      form_factor: 'wide',
      label: 'Screenshot',
    },
    {
      src: 'screen-capture-expenses.png',
      sizes: '640x320',
      type: 'image/png',
      form_factor: 'wide',
      label: 'Screenshot Expenses',
    },
  ],
}

export default defineConfig({
  plugins: [tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
  }), react(), babel({ presets: [reactCompilerPreset()] }), VitePWA({
    registerType: 'autoUpdate',
    manifest,
    includeAssets: ['**/*'],
    // switch to "true" to enable sw on development
    devOptions: {
      enabled: true,
    },
    workbox: {
      globPatterns: ['**/*'],
      cleanupOutdatedCaches: true,
    },
    selfDestroying: true,
  })],
  resolve: {
    alias: {
      // https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
})
