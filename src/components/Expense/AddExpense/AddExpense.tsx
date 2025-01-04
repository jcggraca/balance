import type { Expense } from '@/db'
import type { selectorState } from '@/utils/interfaces'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { EVALUATION } from '@/utils/values'
import { Button, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import classes from './AddExpense.module.css'

interface ExpenseForm {
  name: string
  amount: number
  account: string
  evaluation: 'necessary' | 'not-necessary' | 'wasteful'
  type: string
  budget?: string
  actionDate: Date | null
}

const AddExpense: FC = () => {
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

  const [typesList, setTypesList] = useState<selectorState[]>()
  const [accountList, setAccountList] = useState<selectorState[]>()
  const [budgetList, setBudgetList] = useState<selectorState[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTypes = await db.types.toArray()
        setTypesList(fetchedTypes.map((item) => {
          return {
            value: item.id?.toString() || '',
            label: item.name,
          }
        }))

        const fetchedAccounts = await db.account.toArray()
        setAccountList(fetchedAccounts.map((item) => {
          return {
            value: item.id?.toString() || '',
            label: item.name,
          }
        }))

        const fetchedBudget = await db.budget.toArray()
        setBudgetList(fetchedBudget.map((item) => {
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

  const form = useForm<ExpenseForm>({
    initialValues: {
      name: '',
      amount: 0,
      account: '',
      evaluation: 'necessary',
      type: '',
      budget: '',
      actionDate: null,
    },
    validate: {
      name: value => !value.trim() ? 'Name is required' : null,
      amount: (value) => {
        if (!value)
          return 'Amount is required'
        if (value <= 0)
          return 'Amount must be positive'
        return null
      },
      account: value => !value ? 'Account is required' : null,
      evaluation: value => !value ? 'Evaluation is required' : null,
      type: value => !value ? 'Type is required' : null,
      actionDate: value => !value ? 'Action date is required' : null,
    },
  })

  const handleSubmit = async (values: ExpenseForm) => {
    try {
      const date = dayjs().valueOf()

      const account = await db.account.get({ id: values.account })
      if (!account) {
        throw new Error(`Account with ID ${values.account} not found`)
      }

      if (account.amount < values.amount) {
        throw new Error('Insufficient account balance')
      }

      const expense: Expense = {
        id: uuidv4(),
        name: values.name,
        amount: values.amount,
        accountId: values.account,
        evaluation: values.evaluation,
        type: values.type,
        budget: values.budget || '',
        actionTimestamp: dayjs(values.actionDate).valueOf(),
        createdTimestamp: date,
        updatedTimestamp: date,
      }

      await db.expenses.add(expense)

      account.amount -= values.amount
      account.updatedTimestamp = date

      await db.account.put(account)

      if (values.budget) {
        const budgetAccount = await db.budget.get({ id: values.budget })
        if (!budgetAccount) {
          return console.error(`Budget with ID ${values.budget} not found.`)
        }

        budgetAccount.amount -= values.amount
        budgetAccount.updatedTimestamp = date

        await db.budget.put(budgetAccount)
      }

      notifications.show({
        title: 'Success',
        message: 'Expense added successfully',
        color: 'green',
      })

      form.reset()
      close()
    }
    catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'An error occurred',
        color: 'red',
      })
    }
  }

  return (
    <>
      <Button onClick={open}>Add Expense</Button>

      <Modal opened={opened} onClose={close} title="Add Expense">
        <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            required
            {...form.getInputProps('name')}
          />

          <NumberInput
            label="Amount"
            prefix={currency}
            decimalScale={2}
            hideControls
            required
            {...form.getInputProps('amount')}
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

          <Select
            label="Type"
            placeholder="Pick value"
            data={typesList}
            searchable
            required
            {...form.getInputProps('type')}
          />

          <Select
            label="Evaluation"
            placeholder="Pick value"
            data={EVALUATION}
            required
            {...form.getInputProps('evaluation')}
          />

          <Select
            label="Budget"
            placeholder="Pick value"
            data={budgetList}
            {...form.getInputProps('budget')}
          />

          <Group>
            <Button type="submit">Add Expense</Button>
            <Button onClick={close}>Cancel</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddExpense
