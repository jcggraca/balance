import type { FC } from 'react'
import { type Budget, db } from '@/db'
import { Button, Group, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useIntl } from 'react-intl'

interface DeleteBudgetProps {
  budget: Budget
  onClose: () => void
}

const DeleteBudget: FC<DeleteBudgetProps> = ({ budget, onClose }) => {
  const intl = useIntl()
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    if (!budget)
      return console.error('Budget not found')

    await db.budget.delete(budget.id)

    onClose()
    close()
  }

  return (
    <>
      <Button variant="light" color="red" onClick={open}>{intl.formatMessage({ id: 'delete' })}</Button>

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'deleteBudget' })}>
        <Text>
          <strong>
            {intl.formatMessage({ id: 'attention' })}
            :
          </strong>
          {' '}
          {intl.formatMessage({ id: 'everythingAssociatedWithThisBudgetWillLoseItsTargetBudget' })}
        </Text>

        <Text>
          {intl.formatMessage({ id: 'areYouSureYouWantToDelete' })}
          {' '}
          <strong>{budget.name}</strong>
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

export default DeleteBudget
