import type { Types } from './db'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { db } from './db'
import Layout from './layout/Layout'
import Accounts from './pages/Accounts'
import Budget from './pages/Budget'
import Dashboard from './pages/Dashboard'
import Debts from './pages/Debts'
import ErrorNotFoundPage from './pages/ErrorNotFound'
import Expenses from './pages/Expenses'
import Income from './pages/Income'
import Privacy from './pages/Privacy'
import Settings from './pages/Settings'
import Terms from './pages/Terms'
import TypesPage from './pages/Types'

dayjs.extend(relativeTime)

function App() {
  useEffect(() => {
    const checkTypes = async () => {
      const types = await db.types.toArray()
      if (types?.length === 0) {
        const defaultTypes: Types[] = [
          { id: uuidv4(), name: 'Housing', description: 'Rent, mortgage, property taxes, homeowners insurance.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Utilities', description: 'Electricity, gas, water, internet, phone.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Transportation', description: 'Gas, car insurance, car maintenance, public transportation.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Education', description: 'Tuition, books, supplies.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Loans', description: 'Loan payments, credit card payments.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Food', description: 'Groceries, restaurants, snacks.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Entertainment', description: 'Movies, concerts, travel, hobbies.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Clothing', description: 'Clothes, shoes, accessories.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Gifts', description: 'Birthdays, holidays.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Pets', description: 'Food, vet bills, supplies.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Personal care', description: 'Haircuts, beauty products.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Taxes', description: 'Income tax, property tax.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Maintenance', description: 'Home repairs, car repairs.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Investments', description: 'Stocks, bonds, retirement savings.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Donations', description: 'Charities.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
          { id: uuidv4(), name: 'Other', description: 'Any expenses that don\'t fit into the above categories.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        ]

        db.types.bulkAdd(defaultTypes)
      }
    }

    checkTypes()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="income" element={<Income />} />
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
  )
}

export default App
