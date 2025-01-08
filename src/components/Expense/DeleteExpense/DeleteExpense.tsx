import type { FC } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { db, type Expense } from '@/db'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'

interface DeleteExpenseProps {
  expense: Expense
  onClose: () => void
}

const DeleteExpense: FC<DeleteExpenseProps> = ({ expense, onClose }) => {
  const intl = useIntl()

  const handleDelete = async () => {
    if (!expense)
      return console.error('Expense not found')

    const date = dayjs().valueOf()

    await db.expenses.delete(expense.id)

    if (expense.accountId) {
      const account = await db.account.get({ id: expense.accountId })
      if (!account) {
        return console.error(`Account with ID ${expense.accountId} not found.`)
      }
      else {
        account.amount += expense.amount
        account.updatedTimestamp = date
        await db.account.put(account)
      }
    }

    if (expense.budget) {
      const budgetAccount = await db.budget.get({ id: expense.budget })
      if (!budgetAccount) {
        return console.error(`Account with ID ${expense.budget} not found.`)
      }
      else {
        budgetAccount.amount += expense.amount
        budgetAccount.updatedTimestamp = date
        await db.budget.put(budgetAccount)
      }
    }

    onClose()
  }

  return (
    <DeleteModal
      title={intl.formatMessage({ id: 'deleteExpense' })}
      itemName={expense.name}
      onDelete={handleDelete}
    />
  )
}

export default DeleteExpense
