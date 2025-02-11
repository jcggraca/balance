import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite(), tsconfigPaths(), VitePWA({
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
