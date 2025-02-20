import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import LanguageProvider from './lang/LanguageProvider'
import { useAlertsStore } from './stores/useAlertsStore'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'
import './index.css'
import 'dayjs/locale/pt'

const updateSW = registerSW({
  onNeedRefresh() {
    useAlertsStore.getState().setShowChangelog(true)
    updateSW(true)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <MantineProvider defaultColorScheme="dark">
        <Notifications position="top-right" zIndex={1000} />
        <App />
      </MantineProvider>
    </LanguageProvider>
  </StrictMode>,
)
