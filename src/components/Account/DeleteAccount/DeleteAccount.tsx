import type { FC } from 'react'
import { type Account, db } from '@/db'
import { Button, Group, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import classes from './DeleteAccount.module.css'

interface DeleteAccountProps {
  account: Account
  icon?: boolean
}

const DeleteAccount: FC<DeleteAccountProps> = ({ account, icon = false }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    if (!account)
      return console.error('Account not found')

    await db.account.delete(account.id)

    close()
  }

  return (
    <>
      <Button variant="transparent" color="red" onClick={open}>{icon ? <IconTrash /> : 'Delete'}</Button>

      <Modal centered opened={opened} onClose={close} title="Delete Account">
        <p>
          <strong>Attention:</strong>
          {' '}
          Everything associate expenses will lost the target account
          <br />
          Are you sure you want to delete
          {' '}
          <strong>{account.name}</strong>
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

export default DeleteAccount
