import type { Account } from '@/db'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, Table, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import DeleteAccount from '../DeleteAccount'

interface ViewAccountProps {
  account: Account
  onClose: () => void
}

const ViewAccount: FC<ViewAccountProps> = ({ account, onClose }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [editMode, setEditMode] = useState(false)

  const form = useForm({
    initialValues: {
      name: account.name,
      description: account.description,
      amount: account.amount,
    },
    validate: {
      name: value => (!value ? 'Name is required' : null),
      amount: (value) => {
        if (value === undefined || value === null)
          return 'Amount is required'
        if (value < 0)
          return 'Amount must be positive'
        return null
      },
    },
  })

  useEffect(() => {
    return () => {
      form.reset()
      setEditMode(false)
    }
  }, [])

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const data: Account = {
      ...account,
      ...values,
      updatedTimestamp: date,
    }

    await db.account.put(data)
    onClose()
  }

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'viewAccount' })}>
      {editMode
        ? (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label={intl.formatMessage({ id: 'name' })}
                placeholder={intl.formatMessage({ id: 'enterName' })}
                required
                mt="md"
                {...form.getInputProps('name')}
              />

              <NumberInput
                label={intl.formatMessage({ id: 'amount' })}
                prefix={currency}
                hideControls
                decimalScale={2}
                placeholder={intl.formatMessage({ id: 'enterAmount' })}
                required
                mt="md"
                {...form.getInputProps('amount')}
              />

              <Textarea
                label={intl.formatMessage({ id: 'description' })}
                placeholder={intl.formatMessage({ id: 'enterDescription' })}
                mt="md"
                {...form.getInputProps('description')}
              />

              <Group mt="xl">
                <Button type="submit">{intl.formatMessage({ id: 'update' })}</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>{intl.formatMessage({ id: 'cancel' })}</Button>
              </Group>
            </form>
          )
        : (
            <>
              <Table variant="vertical" layout="fixed" withTableBorder>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'name' })}
                      :
                    </Table.Th>
                    <Table.Td>{account.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'amount' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {currency}
                      {account.amount}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'createdAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(account.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'updatedAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(account.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'description' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {account.description || 'N/A'}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Group mt="xl">
                <Button onClick={() => setEditMode(true)}>{intl.formatMessage({ id: 'edit' })}</Button>
                <DeleteAccount account={account} onClose={close} />
                <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'close' })}</Button>
              </Group>
            </>
          )}
    </Modal>
  )
}

export default ViewAccount
