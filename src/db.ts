import Dexie, { type EntityTable } from 'dexie'

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
  evaluation: 'necessary' | 'not-necessary' | 'wasteful'
  type: string
  budget: string
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

interface Types {
  id: string
  name: string
  description: string
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

interface Debts {
  id: string
  name: string
  amount: number
  description: string
  createdTimestamp: number
  updatedTimestamp: number
}

const db = new Dexie('MyPersonalFinance') as Dexie & {
  account: EntityTable<Account, 'id'>
  expenses: EntityTable<Expense, 'id'>
  types: EntityTable<Types, 'id'>
  budget: EntityTable<Budget, 'id'>
  income: EntityTable<Income, 'id'>
  debts: EntityTable<Debts, 'id'>
}

db.version(4).stores({
  account: '++id, name, amount, description, createdTimestamp, updatedTimestamp',
  expenses: '++id, name, accountId, amount, type, actionTimestamp, createdTimestamp, updatedTimestamp',
  types: '++id, name, description, createdTimestamp, updatedTimestamp',
  budget: '++id, name, amount, description, createdTimestamp, updatedTimestamp',
  income: '++id, name, amount, accountId, description, actionTimestamp, createdTimestamp, updatedTimestamp',
  debts: '++id, name, amount, description, createdTimestamp, updatedTimestamp',
})

export { db }
export type { Account, Budget, Debts, Expense, Income, Types }
