import type { FC } from 'react'
import { db, type Income } from '@/db'
import { Button, Group, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import dayjs from 'dayjs'
import classes from './DeleteIncome.module.css'

interface DeleteIncomeProps {
  income: Income
  icon?: boolean
}

const DeleteIncome: FC<DeleteIncomeProps> = ({ income, icon = false }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    if (!income)
      return console.error('Income not found')

    await db.income.delete(income.id)

    const date = dayjs().valueOf()

    if (income.accountId) {
      const account = await db.account.get({ id: income.accountId })
      if (!account) {
        return console.error(`An account with the ID ${income.accountId} was not found.`)
      }
      else {
        account.amount -= income.amount
        account.updatedTimestamp = date

        await db.account.put(account)
      }
    }

    close()
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" color="red" onClick={open}><IconTrash /></Button>
        : <Button variant="light" color="red" onClick={open}>Delete</Button>}

      <Modal centered opened={opened} onClose={close} title="Delete Income">
        <p>
          <strong>Attention:</strong>
          {' '}
          Deleting this income will remove the corresponding account's value!
          <br />
          Are you sure you want to delete
          {' '}
          <strong>{income.name}</strong>
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

export default DeleteIncome
