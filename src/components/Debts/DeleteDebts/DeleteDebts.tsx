import type { Debts } from '@/db'
import type { FC } from 'react'
import { db } from '@/db'
import { Button, Group, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useIntl } from 'react-intl'

interface DeleteDebtsProps {
  debt: Debts
  onClose: () => void
}

const DeleteDebts: FC<DeleteDebtsProps> = ({ debt, onClose }) => {
  const intl = useIntl()
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    if (!debt)
      return console.error('Budget not found')

    await db.debts.delete(debt.id)

    onClose()
    close()
  }

  return (
    <>
      <Button variant="light" color="red" onClick={open}>{intl.formatMessage({ id: 'delete' })}</Button>

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'deleteDebt' })}>
        <Text>
          {intl.formatMessage({ id: 'areYouSureYouWantToDelete' })}
          {' '}
          <strong>{debt.name}</strong>
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

export default DeleteDebts
