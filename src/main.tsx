import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import LanguageProvider from './lang/LanguageProvider'
import './styles/global.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'
import './index.css'
import 'dayjs/locale/pt'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
        <App />
      </MantineProvider>
    </LanguageProvider>
  </StrictMode>,
)
