import type { FC } from 'react'
import { db, type Income } from '@/db'
import { Button, Group, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'

interface DeleteIncomeProps {
  income: Income
  onClose: () => void
}

const DeleteIncome: FC<DeleteIncomeProps> = ({ income, onClose }) => {
  const intl = useIntl()
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

    onClose()
    close()
  }

  return (
    <>
      <Button variant="light" color="red" onClick={open}>{intl.formatMessage({ id: 'delete' })}</Button>

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'deleteIncome' })}>
        <Text>
          <strong>
            {intl.formatMessage({ id: 'attention' })}
            :
          </strong>
          {' '}
          {intl.formatMessage({ id: 'deletingThisIncomeWillRemoveTheCorrespondingAccountSValue' })}
        </Text>

        <Text>
          {intl.formatMessage({ id: 'areYouSureYouWantToDelete' })}
          {' '}
          <strong>{income.name}</strong>
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

export default DeleteIncome
