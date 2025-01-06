import type { Expense } from '@/db'
import type { selectorState } from '@/utils/interfaces'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { EVALUATION } from '@/utils/values'
import { Button, Group, Modal, NumberInput, Select, Table, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import { type FC, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import DeleteExpense from '../DeleteExpense'

interface ViewExpenseProps {
  expense: Expense
  onClose: () => void
}

const ViewExpense: FC<ViewExpenseProps> = ({ expense, onClose }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

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
      actionDate: expense.actionTimestamp ? new Date(expense.actionTimestamp) : null,
    },
    validate: {
      name: value => !value ? intl.formatMessage({ id: 'nameIsRequired' }) : null,
      amount: (value) => {
        if (!value)
          return intl.formatMessage({ id: 'amountIsRequired' })
        if (value <= 0)
          return intl.formatMessage({ id: 'amountMustBeGreaterThan0' })
        return null
      },
      accountId: value => !value ? intl.formatMessage({ id: 'accountIsRequired' }) : null,
      type: value => !value ? intl.formatMessage({ id: 'typeIsRequired' }) : null,
      evaluation: value => !value ? intl.formatMessage({ id: 'evaluationIsRequired' }) : null,
      actionDate: value => !value ? intl.formatMessage({ id: 'actionDateIsRequired' }) : null,
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

      onClose()
    }
    catch (error) {
      console.error('Error updating expense:', error)
    }
  }

  const getEvaluationName = (value: string) => {
    const findEvaluation = EVALUATION.find(o => o.value === value)
    if (findEvaluation)
      return <span style={{ color: findEvaluation.color }}>{intl.formatMessage({ id: findEvaluation.label })}</span>
    return <WarningNotFound>{intl.formatMessage({ id: 'evaluation' })}</WarningNotFound>
  }

  const getTypeName = (id: string) => {
    const findType = typesList?.find(o => o.value === id)
    if (findType)
      return findType.label
    return <WarningNotFound>{intl.formatMessage({ id: 'type' })}</WarningNotFound>
  }

  const getBudgetName = (id: string) => {
    if (!id)
      return 'N/A'
    const findBudget = budgetList?.find(o => o.value === id)
    if (findBudget)
      return findBudget.label
    return <WarningNotFound>{intl.formatMessage({ id: 'budget' })}</WarningNotFound>
  }

  const getAccountName = (id: string) => {
    const findAccount = accountList?.find(o => o.value === id)
    if (findAccount)
      return findAccount.label
    return <WarningNotFound>{intl.formatMessage({ id: 'account' })}</WarningNotFound>
  }

  const evaluationData = EVALUATION.map((item) => {
    return {
      value: item.value,
      label: intl.formatMessage({ id: item.label }),
    }
  })

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'expenseDetails' })}>
      {editMode
        ? (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label={intl.formatMessage({ id: 'name' })}
                placeholder={intl.formatMessage({ id: 'enterName' })}
                mt="md"
                required
                {...form.getInputProps('name')}
              />

              <NumberInput
                label={intl.formatMessage({ id: 'amount' })}
                prefix={currency}
                hideControls
                decimalScale={2}
                placeholder={intl.formatMessage({ id: 'enterAmount' })}
                mt="md"
                required
                {...form.getInputProps('amount')}
              />

              <Select
                label={intl.formatMessage({ id: 'account' })}
                placeholder={intl.formatMessage({ id: 'selectAccount' })}
                data={accountList}
                mt="md"
                required
                {...form.getInputProps('accountId')}
              />

              <DatePickerInput
                label={intl.formatMessage({ id: 'actionDate' })}
                placeholder={intl.formatMessage({ id: 'selectActionDate' })}
                mt="md"
                required
                {...form.getInputProps('actionDate')}
              />

              <Select
                label={intl.formatMessage({ id: 'type' })}
                placeholder={intl.formatMessage({ id: 'selectType' })}
                data={typesList}
                searchable
                mt="md"
                required
                {...form.getInputProps('type')}
              />

              <Select
                label={intl.formatMessage({ id: 'evaluation' })}
                placeholder={intl.formatMessage({ id: 'selectEvaluation' })}
                data={evaluationData}
                mt="md"
                required
                {...form.getInputProps('evaluation')}
              />

              <Select
                label={intl.formatMessage({ id: 'budget' })}
                placeholder={intl.formatMessage({ id: 'selectBudget' })}
                data={budgetList}
                disabled={budgetList?.length === 0}
                mt="md"
                {...form.getInputProps('budget')}
              />

              <Group mt="xl">
                <Button type="submit">{intl.formatMessage({ id: 'update' })}</Button>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(false)}
                >
                  {intl.formatMessage({ id: 'cancel' })}
                </Button>
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
                    <Table.Td>{expense.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'amount' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {currency}
                      {expense.amount}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'account' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {getAccountName(expense.accountId)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'type' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {getTypeName(expense.type)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'evaluation' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {getEvaluationName(expense.evaluation)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'budget' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {getBudgetName(expense.budget)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'actionDate' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(expense.actionTimestamp).format('DD/MM/YYYY')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'createdAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(expense.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'updatedAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(expense.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'description' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {expense.description || 'N/A'}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Group mt="xl">
                <Button onClick={() => setEditMode(true)}>{intl.formatMessage({ id: 'edit' })}</Button>
                <DeleteExpense expense={expense} onClose={onClose} />
                <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'close' })}</Button>
              </Group>
            </>
          )}
    </Modal>
  )
}

export default ViewExpense
