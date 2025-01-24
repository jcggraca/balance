export interface selectorState {
  value: string
  label: string
}

export interface AccountForm {
  name: string
  amount: number
  description: string
}

export interface IncomeForm {
  name: string
  amount: number
  description: string
  account: string
  actionDate: Date | null
}

export interface ExpenseForm {
  name: string
  amount: number
  account: string
  rating: 'necessary' | 'avoidable' | 'not-necessary'
  category: string
  budget?: string
  actionDate: Date | null
  description: string
}

export interface BudgetForm {
  name: string
  amount: number
  description: string
}

export interface DebtForm {
  name: string
  amount: number
  description: string
}

export interface CategoryForm {
  name: string
  description: string
  color: string
  icon: string
}

interface Table {
  name: string
  schema: string
  rowCount: number
}

interface TableData {
  tableName: string
  inbound: boolean
  rows: Row[]
}

interface Row {
  id: string
  name: string
  description?: string
  amount?: number
  accountId?: string
  rating?: string
  category?: string
  budget?: string
  actionTimestamp?: number
  createdTimestamp: number
  updatedTimestamp: number
  color?: string
  icon?: string
}

export interface ExpenseData {
  formatName: string
  formatVersion: number
  data: {
    databaseName: string
    databaseVersion: number
    tables: Table[]
    data: TableData[]
  }
}
