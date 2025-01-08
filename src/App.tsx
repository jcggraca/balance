import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WelcomeModal from './components/WelcomeModal'
import Layout from './layout/Layout'
import Accounts from './pages/Accounts'
import Budget from './pages/Budget'
import Dashboard from './pages/Dashboard'
import Debts from './pages/Debts'
import ErrorNotFoundPage from './pages/ErrorNotFound'
import Expenses from './pages/Expenses'
import Incomes from './pages/Incomes'
import Privacy from './pages/Privacy'
import Settings from './pages/Settings'
import Terms from './pages/Terms'
import TypesPage from './pages/Types'
import { useSettingsStore } from './stores/useSettingsStore'

dayjs.extend(relativeTime)
dayjs.extend(localeData)

function App() {
  const { newUser } = useSettingsStore()

  return (
    <>
      {!newUser && <WelcomeModal />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="incomes" element={<Incomes />} />
            <Route path="budget" element={<Budget />} />
            <Route path="debts" element={<Debts />} />
            <Route path="types" element={<TypesPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="*" element={<ErrorNotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
