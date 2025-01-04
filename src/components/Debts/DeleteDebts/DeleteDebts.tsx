import type { Debts } from '@/db'
import type { FC } from 'react'
import { db } from '@/db'
import { Button, Group, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import classes from './DeleteDebts.module.css'

interface DeleteDebtsProps {
  debt: Debts
  icon?: boolean
}

const DeleteDebts: FC<DeleteDebtsProps> = ({ debt, icon = false }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    if (!debt)
      return console.error('Budget not found')

    await db.debts.delete(debt.id)

    close()
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" color="red" onClick={open}><IconTrash /></Button>
        : <Button variant="light" color="red" onClick={open}>Delete</Button>}

      <Modal centered opened={opened} onClose={close} title="Delete Debt">
        <p>
          Are you sure you want to delete
          {' '}
          <strong>{debt.name}</strong>
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

export default DeleteDebts
