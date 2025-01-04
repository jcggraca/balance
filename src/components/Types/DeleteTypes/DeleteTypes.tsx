import type { FC } from 'react'
import { db, type Types } from '@/db'
import { Button, Group, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import classes from './DeleteTypes.module.css'

interface DeleteTypesProps {
  type: Types
  icon?: boolean
}

const DeleteTypes: FC<DeleteTypesProps> = ({ type, icon = false }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    if (!type)
      return console.error('Type not found')

    await db.types.delete(type.id)

    close()
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" color="red" onClick={open}><IconTrash /></Button>
        : <Button variant="light" color="red" onClick={open}>Delete</Button>}

      <Modal centered opened={opened} onClose={close} title="Delete Type">
        <p>
          <strong>Attention:</strong>
          {' '}
          Everything associated with this type will lose its target type.
          <br />
          Are you sure you want to delete
          {' '}
          <strong>{type.name}</strong>
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

export default DeleteTypes
