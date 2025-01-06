import type { FC } from 'react'
import { db, type Types } from '@/db'
import { Button, Group, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useIntl } from 'react-intl'

interface DeleteTypesProps {
  type: Types
  onClose: () => void
}

const DeleteTypes: FC<DeleteTypesProps> = ({ type, onClose }) => {
  const intl = useIntl()
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    if (!type)
      return console.error('Type not found')

    await db.types.delete(type.id)

    onClose()
    close()
  }

  return (
    <>
      <Button variant="light" color="red" onClick={open}>{intl.formatMessage({ id: 'delete' })}</Button>

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'deleteType' })}>
        <Text>
          <strong>
            {intl.formatMessage({ id: 'attention' })}
            :
          </strong>
          {' '}
          {intl.formatMessage({ id: 'everythingAssociatedWithThisTypeWillLoseItsTargetType' })}
        </Text>

        <Text>
          {intl.formatMessage({ id: 'areYouSureYouWantToDelete' })}
          {' '}
          <strong>{type.name}</strong>
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

export default DeleteTypes
