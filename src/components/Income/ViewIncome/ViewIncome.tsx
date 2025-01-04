import type { Income } from '@/db'
import type { selectorState } from '@/utils/interfaces'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconEye } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import classes from './ViewIncome.module.css'

interface ViewIncomeProps {
  income: Income
  icon?: boolean
}

const ViewIncome: FC<ViewIncomeProps> = ({ income, icon = false }) => {
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

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
      account: income.accountId.toString(),
      actionDate: dayjs(income.actionTimestamp).valueOf(),
    },
    validate: {
      name: value => !value ? 'Name is required' : null,
      amount: value => !value ? 'Amount is required' : null,
      account: value => !value ? 'Account is required' : null,
      actionDate: value => !value ? 'Action date is required' : null,
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

      close()
    }
    catch (error) {
      console.error('Error updating income:', error)
    }
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" onClick={open}><IconEye /></Button>
        : <Button variant="light" onClick={open}>Details</Button>}

      <Modal centered opened={opened} onClose={close} title="View Income">
        {editMode
          ? (
              <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                  label="Name"
                  required
                  {...form.getInputProps('name')}
                />

                <NumberInput
                  label="Amount"
                  prefix={currency}
                  hideControls
                  decimalScale={2}
                  required
                  {...form.getInputProps('amount')}
                />

                <TextInput
                  label="Description"
                  {...form.getInputProps('description')}
                />

                <Select
                  label="Account"
                  placeholder="Pick value"
                  data={accountList}
                  required
                  {...form.getInputProps('account')}
                />

                <DatePickerInput
                  label="Action date"
                  placeholder="Pick action date"
                  required
                  {...form.getInputProps('actionDate')}
                />

                <Group>
                  <Button type="submit">Update</Button>
                  <Button onClick={() => setEditMode(false)}>Cancel</Button>
                </Group>
              </form>
            )
          : (
              <>
                <ul>
                  <li>
                    <b>Name:</b>
                    {' '}
                    {income.name}
                  </li>
                  <li>
                    <b>Description:</b>
                    {' '}
                    {income.description}
                  </li>
                  <li>
                    <b>Amount:</b>
                    {' '}
                    {income.amount}
                  </li>
                  <li>
                    <b>Account:</b>
                    {' '}
                    {income.accountId}
                  </li>
                  <li>
                    <b>Created at:</b>
                    {' '}
                    {income.createdTimestamp}
                  </li>
                  <li>
                    <b>Updated at:</b>
                    {' '}
                    {income.updatedTimestamp}
                  </li>
                </ul>

                <Group>
                  <Button onClick={() => setEditMode(true)}>Edit</Button>
                  <Button onClick={close}>Close</Button>
                </Group>
              </>
            )}
      </Modal>
    </>
  )
}

export default ViewIncome
