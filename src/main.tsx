import type { FC } from 'react'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import App from './App'
import { messages } from './lang'
import { useSettingsStore } from './stores/useSettingsStore'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'
import './index.css'
import 'dayjs/locale/pt'

interface LanguageProviderProps {
  children: React.ReactNode
}

const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const language = useSettingsStore(state => state.language)

  useMemo(() => {
    document.documentElement.lang = language
    dayjs.locale(language)
  }, [language])

  return (
    <IntlProvider locale={language} messages={messages[language as keyof typeof messages]}>
      {children}
    </IntlProvider>
  )
}

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
