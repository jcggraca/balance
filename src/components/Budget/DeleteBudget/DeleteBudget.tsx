import type { FC } from 'react'
import { type Budget, db } from '@/db'
import { Button, Group, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import classes from './DeleteBudget.module.css'

interface DeleteBudgetProps {
  budget: Budget
  icon?: boolean
}

const DeleteBudget: FC<DeleteBudgetProps> = ({ budget, icon = false }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    if (!budget)
      return console.error('Budget not found')

    await db.budget.delete(budget.id)

    close()
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" color="red" onClick={open}><IconTrash /></Button>
        : <Button variant="light" color="red" onClick={open}>Delete</Button>}

      <Modal centered opened={opened} onClose={close} title="Delete Budget">
        <p>
          <strong>Attention:</strong>
          {' '}
          Everything associated with this budget will lose its target budget.
          <br />
          Are you sure you want to delete
          {' '}
          <strong>{budget.name}</strong>
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

export default DeleteBudget
