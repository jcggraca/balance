import type { FC } from 'react'
import { db, type Expense } from '@/db'
import { Button, Group, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import dayjs from 'dayjs'
import classes from './DeleteExpense.module.css'

interface DeleteExpenseProps {
  expense: Expense
  icon?: boolean
}

const DeleteExpense: FC<DeleteExpenseProps> = ({ expense, icon = false }) => {
  const [opened, { open, close }] = useDisclosure(false)

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

    close()
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" color="red" onClick={open}><IconTrash /></Button>
        : <Button variant="light" color="red" onClick={open}>Delete</Button>}

      <Modal centered opened={opened} onClose={close} title="Delete Details">
        <p>
          Are you sure you want to delete
          {' '}
          <strong>{expense.name}</strong>
          ?
        </p>

        <p className={classes.warning}>This action is irreversible!</p>

        <Group>
          <Button onClick={handleDelete}>Confirm</Button>
          <Button onClick={close}>Cancel</Button>
        </Group>
      </Modal>
    </>
  )
}

export default DeleteExpense
