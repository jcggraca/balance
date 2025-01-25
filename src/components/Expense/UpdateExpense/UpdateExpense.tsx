import type { Expense } from '@/db'
import type { ExpenseForm, selectorState } from '@/utils/interfaces'
import type { FC } from 'react'
import { db } from '@/db'
import { accountSchema, actionDateSchema, amountSchema, categorySchema, descriptionSchema, nameSchema, ratingSchema } from '@/schema/form'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { displayNotification } from '@/utils/form'
import { RATING } from '@/utils/values'
import { Button, Group, NumberInput, Select, Textarea, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

interface UpdateExpenseProps {
  onClose: () => void
  isCreating?: boolean
  expense?: Expense
}

const UpdateExpense: FC<UpdateExpenseProps> = ({ onClose, expense, isCreating = false }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [categoriesList, setCategoriesList] = useState<selectorState[]>([])
  const [accountList, setAccountList] = useState<selectorState[]>([])
  const [budgetList, setBudgetList] = useState<selectorState[]>([])

  const schema = z.object({
    name: nameSchema(intl),
    description: descriptionSchema(intl),
    amount: amountSchema(intl),
    actionDate: actionDateSchema(intl),
    account: accountSchema(intl),
    rating: ratingSchema(intl),
    category: categorySchema(intl),
  })

  const form = useForm<ExpenseForm>({
    initialValues: {
      name: expense?.name || '',
      amount: expense?.amount || 0,
      account: expense?.accountId || '',
      rating: expense?.rating || 'necessary',
      category: expense?.category || '',
      budget: expense?.budget || '',
      actionDate: expense?.actionTimestamp ? new Date(expense.actionTimestamp) : null,
      description: expense?.description || '',
    },
    validate: zodResolver(schema),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categories, accounts, budgets] = await Promise.all([
          db.categories.toArray(),
          db.account.toArray(),
          db.budget.toArray(),
        ])

        setCategoriesList(categories.map(item => ({ value: item.id?.toString() || '', label: item.name })))
        setAccountList(accounts.map(item => ({ value: item.id?.toString() || '', label: item.name })))
        setBudgetList(budgets.map(item => ({ value: item.id?.toString() || '', label: item.name })))
      }
      catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (values: ExpenseForm) => {
    try {
      const date = dayjs().valueOf()

      const account = await db.account.get({ id: values.account })
      if (!account) {
        throw new Error('missingAccountID')
      }

      if (isCreating) {
        if (account.amount < values.amount) {
          form.setErrors({ account: intl.formatMessage({ id: 'insufficientAccountBalance' }) })
          return
        }

        const dataNew: Expense = {
          id: uuidv4(),
          name: values.name.trim(),
          amount: values.amount,
          accountId: values.account,
          rating: values.rating,
          description: values.description.trim(),
          category: values.category,
          budget: values.budget || '',
          actionTimestamp: dayjs(values.actionDate).valueOf(),
          createdTimestamp: date,
          updatedTimestamp: date,
        }
        await db.expenses.add(dataNew)

        account.amount -= values.amount
        account.updatedTimestamp = date
        await db.account.put(account)

        if (values.budget) {
          const budgetAccount = await db.budget.get({ id: values.budget })
          if (budgetAccount) {
            budgetAccount.amount -= values.amount
            budgetAccount.updatedTimestamp = date

            await db.budget.put(budgetAccount)
          }
          else {
            console.error(`Budget with ID ${values.budget} not found.`)
          }
        }
      }
      else {
        if (!expense?.id) {
          throw new Error('missingExpenseID')
        }

        if ((account.amount + expense.amount) < values.amount) {
          form.setErrors({ account: intl.formatMessage({ id: 'insufficientAccountBalance' }) })
          return
        }

        const dataUpdate: Expense = {
          id: expense.id,
          name: values.name.trim(),
          amount: values.amount,
          accountId: values.account,
          rating: values.rating,
          description: values.description.trim(),
          category: values.category,
          budget: values.budget || '',
          actionTimestamp: dayjs(values.actionDate).valueOf(),
          createdTimestamp: expense.createdTimestamp,
          updatedTimestamp: date,
        }
        await db.expenses.put(dataUpdate)

        if (expense.amount !== values.amount) {
          const amountDiff = values.amount - expense.amount
          account.amount -= +amountDiff
          account.updatedTimestamp = date

          await db.account.put(account)

          if (values.budget) {
            const budgetAccount = await db.budget.get({ id: values.budget })
            if (budgetAccount) {
              budgetAccount.amount -= +amountDiff
              budgetAccount.updatedTimestamp = date

              await db.budget.put(budgetAccount)
            }
            else {
              console.error(`Budget with ID ${values.budget} not found.`)
            }
          }
        }
      }

      const message = isCreating ? 'expenseAddedSuccessfully' : 'expenseUpdatedSuccessfully'
      displayNotification(intl, 'success', message, 'green')

      form.reset()
      onClose()
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'anErrorOccurred'
      displayNotification(intl, 'error', message, 'red')

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
        {...form.getInputProps('category')}
      />

      <Select
        label={intl.formatMessage({ id: 'rating' })}
        placeholder={intl.formatMessage({ id: 'selectRating' })}
        data={ratingData}
        required
        mt="md"
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

export default UpdateExpense
