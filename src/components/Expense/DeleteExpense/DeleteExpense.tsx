import type { FC } from 'react'
import { db, type Expense } from '@/db'
import { Button, Group, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'

interface DeleteExpenseProps {
  expense: Expense
  onClose: () => void
}

const DeleteExpense: FC<DeleteExpenseProps> = ({ expense, onClose }) => {
  const intl = useIntl()
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

    onClose()
    close()
  }

  return (
    <>
      <Button variant="light" color="red" onClick={open}>{intl.formatMessage({ id: 'delete' })}</Button>

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'deleteExpense' })}>
        <Text>
          {intl.formatMessage({ id: 'areYouSureYouWantToDelete' })}
          {' '}
          <strong>{expense.name}</strong>
          ?
        </Text>

        <Text c="red" mt="md" fw="bold">{intl.formatMessage({ id: 'thisActionIsIrreversible' })}</Text>

        <Group mt="xl">
          <Button onClick={handleDelete}>{intl.formatMessage({ id: 'confirm' })}</Button>
          <Button variant="outline" onClick={close}>{intl.formatMessage({ id: 'cancel' })}</Button>
        </Group>
      </Modal>
    </>
  )
}

export default DeleteExpense
