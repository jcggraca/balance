import type { Income } from '@/db'
import type { selectorState } from '@/utils/interfaces'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, Select, Table, Textarea, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import DeleteIncome from '../DeleteIncome'

interface ViewIncomeProps {
  income: Income
  onClose: () => void
}

const ViewIncome: FC<ViewIncomeProps> = ({ income, onClose }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [editMode, setEditMode] = useState(false)
  const [accountList, setAccountList] = useState<selectorState[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAccounts = await db.account.toArray()
        setAccountList(fetchedAccounts.map((item) => {
          return {
            value: item.id?.toString() || '',
            label: item.name,
          }
        }))
      }
      catch (error) {
        console.error('Error fetching:', error)
      }
    }

    fetchData()
  }, [])

  const form = useForm({
    initialValues: {
      name: income.name,
      amount: income.amount,
      description: income.description || '',
      account: income.accountId,
      actionDate: income.actionTimestamp ? new Date(income.actionTimestamp) : null,
    },
    validate: {
      name: value => !value ? intl.formatMessage({ id: 'nameIsRequired' }) : null,
      amount: value => !value ? intl.formatMessage({ id: 'amountIsRequired' }) : null,
      account: value => !value ? intl.formatMessage({ id: 'accountIsRequired' }) : null,
      actionDate: value => !value ? intl.formatMessage({ id: 'actionDateIsRequired' }) : null,
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const account = await db.account.get({ id: values.account })
      if (!account) {
        throw new Error(`Account with ID ${values.account} not found.`)
      }

      const amount = Number(values.amount)
      const date = dayjs().valueOf()

      const data: Income = {
        ...income,
        name: values.name,
        accountId: values.account,
        description: values.description,
        amount,
        actionTimestamp: dayjs(values.actionDate).valueOf(),
        updatedTimestamp: date,
      }

      await db.income.put(data)

      if (income.amount !== amount) {
        account.amount += amount - income.amount
        account.updatedTimestamp = date
        await db.account.put(account)
      }

      onClose()
    }
    catch (error) {
      console.error('Error updating income:', error)
    }
  }

  const getAccountName = (id: string) => {
    const findAccount = accountList?.find(o => o.value === id)
    if (findAccount)
      return findAccount.label
    return <WarningNotFound>{intl.formatMessage({ id: 'account' })}</WarningNotFound>
  }

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'viewIncome' })}>
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

              <Select
                label={intl.formatMessage({ id: 'account' })}
                placeholder={intl.formatMessage({ id: 'pickValue' })}
                data={accountList}
                required
                mt="md"
                {...form.getInputProps('account')}
              />

              <DatePickerInput
                label={intl.formatMessage({ id: 'actionDate' })}
                placeholder={intl.formatMessage({ id: 'pickActionDate' })}
                required
                mt="md"
                {...form.getInputProps('actionDate')}
              />

              <Textarea
                label={intl.formatMessage({ id: 'description' })}
                mt="md"
                placeholder={intl.formatMessage({ id: 'enterDescription' })}
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
                    <Table.Td>{income.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'amount' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {currency}
                      {income.amount}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'account' })}
                      :
                    </Table.Th>
                    <Table.Td>{getAccountName(income.accountId)}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'actionDate' })}
                      :
                    </Table.Th>
                    <Table.Td>{dayjs(income.actionTimestamp).format('DD/MM/YYYY')}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'createdAt' })}
                      :
                    </Table.Th>
                    <Table.Td>{dayjs(income.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'updatedAt' })}
                      :
                    </Table.Th>
                    <Table.Td>{dayjs(income.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'description' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {income.description || 'N/A'}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Group mt="xl">
                <Button onClick={() => setEditMode(true)}>{intl.formatMessage({ id: 'edit' })}</Button>
                <DeleteIncome onClose={onClose} income={income} />
                <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'close' })}</Button>
              </Group>
            </>
          )}
    </Modal>
  )
}

export default ViewIncome
