import type { Expense } from '../../../db'
import type { ExpenseForm, selectorState } from '../../../utils/interfaces'
import { Button, Group, NumberInput, Select, Textarea, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useEffect, useReducer } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { db } from '../../../db'
import { accountSchema, actionDateSchema, amountSchema, categorySchema, descriptionSchema, nameSchema, ratingSchema } from '../../../schema/form'
import { useSettingsStore } from '../../../stores/useSettingsStore'
import { displayNotification } from '../../../utils/form'
import { RATING } from '../../../utils/values'

interface UpdateExpenseProps {
  onClose: () => void
  isCreating?: boolean
  expense?: Expense
}

interface State {
  categoriesList: selectorState[]
  accountList: selectorState[]
  budgetList: selectorState[]
}

type Action
  = | { type: 'SET_DATA', payload: Partial<State> }

const initialState: State = {
  categoriesList: [],
  accountList: [],
  budgetList: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default function UpdateExpense({ onClose, expense, isCreating = false }: UpdateExpenseProps) {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [state, dispatch] = useReducer(reducer, initialState)
  const { categoriesList, accountList, budgetList } = state

  const schema = z.object({
    name: nameSchema(intl),
    description: descriptionSchema(intl),
    amount: amountSchema(intl),
    actionDate: actionDateSchema(intl),
    account: accountSchema(intl),
    rating: ratingSchema(intl),
    category: categorySchema(intl),
    budget: z.string().optional(),
  })

  type ExpenseFormValues = z.infer<typeof schema>

  const form = useForm<ExpenseFormValues>({
    initialValues: {
      name: expense?.name || '',
      amount: expense?.amount || 0,
      account: expense?.accountId || '',
      rating: expense?.rating || 'necessary',
      category: expense?.category || '',
      budget: expense?.budget || '',
      actionDate: expense?.actionTimestamp
        ? new Date(expense.actionTimestamp)
        : new Date(),
      description: expense?.description || '',
    },
    validate: zod4Resolver(schema),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categories, accounts, budgets] = await Promise.all([
          db.categories.toArray(),
          db.account.toArray(),
          db.budget.toArray(),
        ])

        dispatch({
          type: 'SET_DATA',
          payload: {
            categoriesList: categories.map(item => ({ value: item.id?.toString() || '', label: item.name })),
            accountList: accounts.map(item => ({ value: item.id?.toString() || '', label: item.name })),
            budgetList: budgets.map(item => ({ value: item.id?.toString() || '', label: item.name })),
          },
        })
      }
      catch (error) {
        console.error('UpdateExpense Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (values: ExpenseForm) => {
    try {
      const account = await db.account.get({ id: values.account })
      if (!account)
        throw new Error(intl.formatMessage({ id: 'missingAccountID' }))

      const amount = Number.parseFloat(values.amount.toFixed(2))
      const date = dayjs().valueOf()

      if (isCreating) {
        if (account.amount < amount) {
          form.setErrors({ account: intl.formatMessage({ id: 'insufficientAccountBalance' }) })
          return
        }

        const dataNew: Expense = {
          id: uuidv4(),
          name: values.name.trim(),
          amount,
          accountId: values.account,
          rating: values.rating,
          description: values.description?.trim() || '',
          category: values.category,
          budget: values.budget || '',
          actionTimestamp: dayjs(values.actionDate).valueOf(),
          createdTimestamp: date,
          updatedTimestamp: date,
        }
        await db.expenses.add(dataNew)

        account.amount -= amount
        account.updatedTimestamp = date
        await db.account.put(account)

        if (values.budget) {
          const budgetAccount = await db.budget.get({ id: values.budget })
          if (budgetAccount) {
            budgetAccount.amount -= amount
            budgetAccount.updatedTimestamp = date
            await db.budget.put(budgetAccount)
          }
          else {
            console.error(`Budget with ID ${values.budget} not found.`)
          }
        }
      }
      else {
        if (!expense?.id)
          throw new Error('missingExpenseID')

        if ((account.amount + expense.amount) < amount) {
          form.setErrors({ account: intl.formatMessage({ id: 'insufficientAccountBalance' }) })
          return
        }

        const dataUpdate: Expense = {
          id: expense.id,
          name: values.name.trim(),
          amount: values.amount,
          accountId: values.account,
          rating: values.rating,
          description: values.description?.trim() || '',
          category: values.category,
          budget: values.budget || '',
          actionTimestamp: dayjs(values.actionDate).valueOf(),
          createdTimestamp: expense.createdTimestamp,
          updatedTimestamp: date,
        }
        await db.expenses.put(dataUpdate)

        // Update accounts and budgets
        if (expense.accountId === values.account && expense.amount !== amount) {
          account.amount -= (amount - expense.amount)
          account.updatedTimestamp = date
          await db.account.put(account)
        }
        else if (expense.accountId !== values.account) {
          const oldAccount = await db.account.get({ id: expense.accountId })
          if (oldAccount) {
            oldAccount.amount += expense.amount
            oldAccount.updatedTimestamp = date
            await db.account.put(oldAccount)
          }

          account.amount -= amount
          account.updatedTimestamp = date
          await db.account.put(account)
        }

        if (expense.budget === values.budget && expense.amount !== amount) {
          const budgetAccount = await db.budget.get({ id: values.budget })
          if (budgetAccount) {
            budgetAccount.amount -= (amount - expense.amount)
            budgetAccount.updatedTimestamp = date
            await db.budget.put(budgetAccount)
          }
        }
        else if (expense.budget !== values.budget) {
          const oldBudget = await db.budget.get({ id: expense.budget })
          if (oldBudget) {
            oldBudget.amount += expense.amount
            oldBudget.updatedTimestamp = date
            await db.budget.put(oldBudget)
          }

          if (values.budget) {
            const budgetAccount = await db.budget.get({ id: values.budget })
            if (budgetAccount) {
              budgetAccount.amount -= amount
              budgetAccount.updatedTimestamp = date
              await db.budget.put(budgetAccount)
            }
          }
        }
      }

      displayNotification(intl, 'success', isCreating ? 'expenseAddedSuccessfully' : 'expenseUpdatedSuccessfully', 'green')
      form.reset()
      onClose()
    }
    catch (error) {
      console.error(isCreating ? 'failedCreatingExpense' : 'failedUpdatingExpense', error)
      displayNotification(intl, 'error', isCreating ? 'failedCreatingExpense' : 'failedUpdatingExpense', 'red')
      form.reset()
      onClose()
    }
  }

  const ratingData = RATING.map(item => ({
    value: item.value,
    label: intl.formatMessage({ id: item.label }),
  }))

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label={intl.formatMessage({ id: 'name' })}
        placeholder={intl.formatMessage({ id: 'enterName' })}
        required
        mt="md"
        data-autofocus
        {...form.getInputProps('name')}
      />

      <NumberInput
        label={intl.formatMessage({ id: 'amount' })}
        prefix={currency}
        decimalScale={2}
        hideControls
        placeholder={intl.formatMessage({ id: 'enterAmount' })}
        required
        mt="md"
        {...form.getInputProps('amount')}
      />

      <Select
        label={intl.formatMessage({ id: 'account' })}
        placeholder={intl.formatMessage({ id: 'selectAccount' })}
        data={accountList}
        required
        mt="md"
        allowDeselect={false}
        {...form.getInputProps('account')}
      />

      <DatePickerInput
        label={intl.formatMessage({ id: 'actionDate' })}
        placeholder={intl.formatMessage({ id: 'selectActionDate' })}
        required
        mt="md"
        {...form.getInputProps('actionDate')}
      />

      <Select
        label={intl.formatMessage({ id: 'category' })}
        placeholder={intl.formatMessage({ id: 'selectCategory' })}
        data={categoriesList}
        searchable
        required
        mt="md"
        allowDeselect={false}
        {...form.getInputProps('category')}
      />

      <Select
        label={intl.formatMessage({ id: 'rating' })}
        placeholder={intl.formatMessage({ id: 'selectRating' })}
        data={ratingData}
        required
        mt="md"
        allowDeselect={false}
        {...form.getInputProps('rating')}
      />

      <Select
        label={intl.formatMessage({ id: 'budget' })}
        placeholder={intl.formatMessage({ id: 'selectBudget' })}
        disabled={budgetList.length === 0}
        data={budgetList}
        mt="md"
        {...form.getInputProps('budget')}
      />

      <Textarea
        label={intl.formatMessage({ id: 'description' })}
        placeholder={intl.formatMessage({ id: 'enterDescription' })}
        mt="md"
        {...form.getInputProps('description')}
      />

      <Group mt="xl">
        <Button type="submit">{intl.formatMessage({ id: isCreating ? 'addExpense' : 'updateExpense' })}</Button>
        <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'cancel' })}</Button>
      </Group>
    </form>
  )
}
