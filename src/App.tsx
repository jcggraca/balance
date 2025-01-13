import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WelcomeModal from './components/WelcomeModal'
import Layout from './layout/Layout'
import Accounts from './pages/Accounts'
import Budget from './pages/Budget'
import Categories from './pages/Categories'
import Dashboard from './pages/Dashboard'
import Debts from './pages/Debts'
import ErrorNotFoundPage from './pages/ErrorNotFound'
import Expenses from './pages/Expenses'
import Income from './pages/Income'
import Privacy from './pages/Privacy'
import Settings from './pages/Settings'
import Terms from './pages/Terms'
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
            <Route path="income" element={<Income />} />
            <Route path="budget" element={<Budget />} />
            <Route path="debts" element={<Debts />} />
            <Route path="categories" element={<Categories />} />
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
