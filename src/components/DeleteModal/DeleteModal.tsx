import type { FC } from 'react'
import { Button, Group, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useIntl } from 'react-intl'

interface DeleteModalProps {
  title: string
  itemName: string
  onDelete: () => Promise<void>
  warningMessage?: string
}

const DeleteModal: FC<DeleteModalProps> = ({
  title,
  itemName,
  onDelete,
  warningMessage,
}) => {
  const intl = useIntl()
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    await onDelete()
    close()
  }

  return (
    <>
      <Button variant="light" color="red" onClick={open}>
        {intl.formatMessage({ id: 'delete' })}
      </Button>

      <Modal centered opened={opened} onClose={close} title={title}>
        {warningMessage && (
          <Text>
            <strong>
              {intl.formatMessage({ id: 'attention' })}
              :
            </strong>
            {' '}
            {warningMessage}
          </Text>
        )}

        <Text>
          {intl.formatMessage({ id: 'confirmDelete' })}
          {' '}
          <strong>{itemName}</strong>
          ?
        </Text>

        <Text c="red" mt="md" fw="bold">
          {intl.formatMessage({ id: 'isIrreversible' })}
          !
        </Text>

        <Group mt="xl">
          <Button onClick={handleDelete}>
            {intl.formatMessage({ id: 'confirm' })}
          </Button>
          <Button variant="outline" onClick={close}>
            {intl.formatMessage({ id: 'cancel' })}
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default DeleteModal
