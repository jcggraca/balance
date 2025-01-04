import type { Expense } from '@/db'
import type { selectorState } from '@/utils/interfaces'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { EVALUATION } from '@/utils/values'
import { Button, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconEye } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { type FC, useEffect, useMemo, useState } from 'react'
import DeleteExpense from '../DeleteExpense'
import classes from './ViewExpense.module.css'

interface ViewExpenseProps {
  expense: Expense
  icon?: boolean
}

const ViewExpense: FC<ViewExpenseProps> = ({ expense, icon = false }) => {
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

  const [editMode, setEditMode] = useState(false)
  const [typesList, setTypesList] = useState<selectorState[]>()
  const [accountList, setAccountList] = useState<selectorState[]>()
  const [budgetList, setBudgetList] = useState<selectorState[]>()

  const form = useForm({
    initialValues: {
      name: expense.name,
      amount: expense.amount,
      accountId: expense.accountId,
      type: expense.type,
      evaluation: expense.evaluation,
      budget: expense.budget || '',
      actionDate: dayjs(expense.actionTimestamp).valueOf(),
    },
    validate: {
      name: value => !value ? 'Name is required' : null,
      amount: (value) => {
        if (!value)
          return 'Amount is required'
        if (value <= 0)
          return 'Amount must be greater than 0'
        return null
      },
      accountId: value => !value ? 'Account is required' : null,
      type: value => !value ? 'Type is required' : null,
      evaluation: value => !value ? 'Evaluation is required' : null,
      actionDate: value => !value ? 'Action date is required' : null,
    },
  })

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

  useMemo(() => {
    if (expense && accountList && !accountList.find(o => o.value === expense.accountId)) {
      setEditMode(true)
    }
  }, [expense, accountList])

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const account = await db.account.get({ id: values.accountId })
      if (!account) {
        form.setFieldError('accountId', 'Account not found')
        return
      }

      const amount = Number(values.amount)
      const date = dayjs().valueOf()

      const data: Expense = {
        ...expense,
        name: values.name,
        amount,
        accountId: values.accountId,
        evaluation: values.evaluation,
        type: values.type,
        budget: values.budget,
        actionTimestamp: dayjs(values.actionDate).valueOf(),
        updatedTimestamp: date,
      }

      await db.expenses.put(data)

      if (expense.amount !== amount) {
        const amountDiff = expense.amount - amount
        account.amount -= +amountDiff
        account.updatedTimestamp = date

        await db.account.put(account)

        if (values.budget) {
          const budgetAccount = await db.budget.get({ id: values.budget })
          if (!budgetAccount) {
            form.setFieldError('budget', 'Budget not found')
            return
          }

          budgetAccount.amount -= +amountDiff
          budgetAccount.updatedTimestamp = date

          await db.budget.put(budgetAccount)
        }
      }

      close()
    }
    catch (error) {
      console.error('Error updating expense:', error)
    }
  }

  const getEvaluationName = (value: string) => {
    const findEvaluation = EVALUATION.find(o => o.value === value)
    if (findEvaluation)
      return <span style={{ color: findEvaluation.color }}>{findEvaluation.label}</span>
    return <WarningNotFound>Evaluation</WarningNotFound>
  }

  const getTypeName = (id: string) => {
    const findType = typesList?.find(o => o.value === id)
    if (findType)
      return findType.label
    return <WarningNotFound>Type</WarningNotFound>
  }

  const getBudgetName = (id: string) => {
    const findBudget = budgetList?.find(o => o.value === id)
    if (findBudget)
      return findBudget.label
    return <WarningNotFound>Budget</WarningNotFound>
  }

  const getAccountName = (id: string) => {
    const findAccount = accountList?.find(o => o.value === id)
    if (findAccount)
      return findAccount.label
    return <WarningNotFound>Account</WarningNotFound>
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" onClick={open}><IconEye /></Button>
        : <Button variant="light" onClick={open}>Details</Button>}

      <Modal opened={opened} onClose={close} title="Expense Details">
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

                <Select
                  label="Account"
                  placeholder="Pick value"
                  data={accountList}
                  required
                  {...form.getInputProps('accountId')}
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
                  <Button type="submit">Update</Button>
                  <Button
                    disabled={(expense && accountList && !accountList.find(o => o.value === expense.accountId))}
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </Group>
              </form>
            )
          : (
              <>
                <ul>
                  <li>
                    <b>Name:</b>
                    {' '}
                    {expense.name}
                  </li>
                  <li>
                    <b>Amount:</b>
                    {' '}
                    {currency}
                    {expense.amount}
                  </li>
                  <li>
                    <b>Account:</b>
                    {' '}
                    {getAccountName(expense.accountId)}
                  </li>
                  <li>
                    <b>Type:</b>
                    {' '}
                    {getTypeName(expense.type)}
                  </li>
                  <li>
                    <b>Evaluation:</b>
                    {' '}
                    {getEvaluationName(expense.evaluation)}
                  </li>
                  {expense.budget && (
                    <li>
                      <b>Budget:</b>
                      {' '}
                      {getBudgetName(expense.budget)}
                    </li>
                  )}
                  <li>
                    <b>Created at:</b>
                    {' '}
                    {dayjs(expense.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                  </li>
                  <li>
                    <b>Updated at:</b>
                    {' '}
                    {dayjs(expense.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                  </li>
                </ul>

                <Group>
                  <Button onClick={() => setEditMode(true)}>Edit</Button>
                  <DeleteExpense expense={expense} />
                </Group>
              </>
            )}
      </Modal>
    </>
  )
}

export default ViewExpense
