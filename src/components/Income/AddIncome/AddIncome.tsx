import type { Income } from '@/db'
import type { selectorState } from '@/utils/interfaces'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import classes from './AddIncome.module.css'

const AddIncome: FC = () => {
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

  const [accountList, setAccountList] = useState<selectorState[]>([])

  const form = useForm({
    initialValues: {
      name: '',
      amount: '',
      description: '',
      account: '',
      actionDate: null as Date | null,
    },
    validate: {
      name: value => !value ? 'Name is required' : null,
      amount: value => !value ? 'Amount is required' : null,
      account: value => !value ? 'Account is required' : null,
      actionDate: value => !value ? 'Date is required' : null,
    },
  })

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

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const account = await db.account.get({ id: values.account })
      if (!account) {
        throw new Error(`Account with ID ${values.account} not found.`)
      }

      const amount = Number(values.amount)
      const date = dayjs().valueOf()

      const income: Income = {
        id: uuidv4(),
        name: values.name,
        amount,
        accountId: values.account,
        description: values.description || null,
        actionTimestamp: dayjs(values.actionDate).valueOf(),
        createdTimestamp: date,
        updatedTimestamp: date,
      }

      await db.income.add(income)

      account.amount += amount
      account.updatedTimestamp = date
      await db.account.put(account)

      form.reset()
      close()
    }
    catch (error) {
      console.error('Error adding income:', error)
    }
  }

  return (
    <>
      <Button onClick={open}>Add Income</Button>

      <Modal opened={opened} onClose={close} title="Add Income">
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
            <Button type="submit">Add Income</Button>
            <Button onClick={close}>Cancel</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddIncome
