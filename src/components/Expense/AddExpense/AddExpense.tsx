import type { Expense } from '@/db'
import type { selectorState } from '@/utils/interfaces'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { EVALUATION } from '@/utils/values'
import { Button, Group, Modal, NumberInput, Select, Textarea, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'

interface ExpenseForm {
  name: string
  amount: number
  account: string
  evaluation: 'necessary' | 'not-necessary' | 'wasteful'
  type: string
  budget?: string
  actionDate: Date | null
  description: string
}

const AddExpense: FC = () => {
  const intl = useIntl()
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
      description: '',
    },
    validate: {
      name: value => !value.trim() ? intl.formatMessage({ id: 'nameIsRequired' }) : null,
      amount: (value) => {
        if (!value)
          return intl.formatMessage({ id: 'amountIsRequired' })
        if (value <= 0)
          return intl.formatMessage({ id: 'amountMustBePositive' })
        return null
      },
      account: value => !value ? intl.formatMessage({ id: 'accountIsRequired' }) : null,
      evaluation: value => !value ? intl.formatMessage({ id: 'evaluationIsRequired' }) : null,
      type: value => !value ? intl.formatMessage({ id: 'typeIsRequired' }) : null,
      actionDate: value => !value ? intl.formatMessage({ id: 'actionDateIsRequired' }) : null,
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
        throw new Error(intl.formatMessage({ id: 'insufficientAccountBalance' }))
      }

      const expense: Expense = {
        id: uuidv4(),
        name: values.name,
        amount: values.amount,
        accountId: values.account,
        evaluation: values.evaluation,
        description: values.description,
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
        title: intl.formatMessage({ id: 'success' }),
        message: intl.formatMessage({ id: 'expenseAddedSuccessfully' }),
        color: 'green',
      })

      form.reset()
      close()
    }
    catch (error) {
      notifications.show({
        title: intl.formatMessage({ id: 'error' }),
        message: error instanceof Error ? error.message : intl.formatMessage({ id: 'anErrorOccurred' }),
        color: 'red',
      })
    }
  }

  const evaluationData = EVALUATION.map((item) => {
    return {
      value: item.value,
      label: intl.formatMessage({ id: item.label }),
    }
  })

  return (
    <>
      <Button disabled={accountList?.length === 0 || typesList?.length === 0} onClick={open}>{intl.formatMessage({ id: 'addExpense' })}</Button>

      <Modal opened={opened} onClose={close} title={intl.formatMessage({ id: 'addExpense' })}>
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
            label={intl.formatMessage({ id: 'type' })}
            placeholder={intl.formatMessage({ id: 'selectType' })}
            data={typesList}
            searchable
            required
            mt="md"
            {...form.getInputProps('type')}
          />

          <Select
            label={intl.formatMessage({ id: 'evaluation' })}
            placeholder={intl.formatMessage({ id: 'selectEvaluation' })}
            data={evaluationData}
            required
            mt="md"
            {...form.getInputProps('evaluation')}
          />

          <Select
            label={intl.formatMessage({ id: 'budget' })}
            placeholder={intl.formatMessage({ id: 'selectBudget' })}
            disabled={budgetList?.length === 0}
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
            <Button type="submit">{intl.formatMessage({ id: 'addExpense' })}</Button>
            <Button variant="outline" onClick={close}>{intl.formatMessage({ id: 'cancel' })}</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddExpense
