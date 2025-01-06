import type { FC } from 'react'
import { type Account, db } from '@/db'
import { Button, Group, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useIntl } from 'react-intl'

interface DeleteAccountProps {
  account: Account
  onClose: () => void
}

const DeleteAccount: FC<DeleteAccountProps> = ({ account, onClose }) => {
  const intl = useIntl()
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    if (!account)
      return console.error('Account not found')

    await db.account.delete(account.id)

    onClose()
    close()
  }

  return (
    <>
      <Button variant="light" color="red" onClick={open}>{intl.formatMessage({ id: 'delete' })}</Button>

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'deleteAccount' })}>
        <Text>
          <strong>
            {intl.formatMessage({ id: 'attention' })}
            :
          </strong>
          {' '}
          {intl.formatMessage({ id: 'everythingAssociateToThisAccountWillLoseTheTargetAccount' })}
        </Text>

        <Text>
          {intl.formatMessage({ id: 'areYouSureYouWantToDelete' })}
          {' '}
          <strong>{account.name}</strong>
          ?
        </Text>

        <Text c="red" mt="md" fw="bold">
          {intl.formatMessage({ id: 'thisActionIsIrreversible' })}
          !
        </Text>

        <Group mt="xl">
          <Button onClick={handleDelete}>{intl.formatMessage({ id: 'confirm' })}</Button>
          <Button variant="outline" onClick={close}>{intl.formatMessage({ id: 'cancel' })}</Button>
        </Group>
      </Modal>
    </>
  )
}

export default DeleteAccount
