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
  evaluation: 'necessary' | 'not-necessary' | 'wasteful'
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
