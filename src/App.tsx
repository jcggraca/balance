import { createRouter, RouterProvider } from '@tanstack/react-router'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import WelcomeModal from './components/WelcomeModal'
// import ErrorNotFoundPage from './pages/ErrorNotFound'
// import Privacy from './pages/Privacy'
// import Terms from './pages/Terms'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { useSettingsStore } from './stores/useSettingsStore'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

dayjs.extend(relativeTime)
dayjs.extend(localeData)

function App() {
  const { newUser } = useSettingsStore()

  return (
    <>
      {newUser && <WelcomeModal />}
      <RouterProvider router={router} />
    </>
  )
}

export default App
