import type { EntityTable } from 'dexie'
import type iconsMap from './components/IconRenderer/iconsMap'
import Dexie from 'dexie'

interface Account {
  id: string
  name: string
  amount: number
  description: string
  createdTimestamp: number
  updatedTimestamp: number
}

interface Expense {
  id: string
  name: string
  amount: number
  accountId: string
  rating: 'necessary' | 'avoidable' | 'not-necessary'
  category: string
  budget: string
  description: string
  actionTimestamp: number
  createdTimestamp: number
  updatedTimestamp: number
}

interface Income {
  id: string
  name: string
  amount: number
  accountId: string
  description: string | null
  actionTimestamp: number
  createdTimestamp: number
  updatedTimestamp: number
}

interface Category {
  id: string
  name: string
  description: string
  icon: keyof typeof iconsMap
  color: string
  createdTimestamp: number
  updatedTimestamp: number
}

interface Budget {
  id: string
  name: string
  amount: number
  description: string
  createdTimestamp: number
  updatedTimestamp: number
}

interface Debt {
  id: string
  name: string
  amount: number
  description: string
  createdTimestamp: number
  updatedTimestamp: number
}

const db = new Dexie('Balance') as Dexie & {
  account: EntityTable<Account, 'id'>
  expenses: EntityTable<Expense, 'id'>
  categories: EntityTable<Category, 'id'>
  budget: EntityTable<Budget, 'id'>
  income: EntityTable<Income, 'id'>
  debts: EntityTable<Debt, 'id'>
}

db.version(6).stores({
  account: '++id, name, amount, description, createdTimestamp, updatedTimestamp',
  expenses: '++id, name, description, accountId, rating, amount, category, actionTimestamp, createdTimestamp, updatedTimestamp',
  categories: '++id, name, description, createdTimestamp, updatedTimestamp',
  budget: '++id, name, amount, description, createdTimestamp, updatedTimestamp',
  income: '++id, name, amount, accountId, description, actionTimestamp, createdTimestamp, updatedTimestamp',
  debts: '++id, name, amount, description, createdTimestamp, updatedTimestamp',
})

export { db }
export type { Account, Budget, Category, Debt, Expense, Income }
