import type { ReactNode } from 'react'
import type { Expense } from '../../db'
import { PieChart } from '@mantine/charts'
import {
  Alert,
  Box,
  Card,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from '@mantine/core'
import {
  IconAlertTriangle,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useEffect, useReducer, useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../db'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { displayNotification } from '../../utils/form'
import DashboardHeader from './DashboardHeader'

function RenderErrorOrChildren({
  error,
  children,
}: {
  error: string | null
  children: ReactNode
}) {
  const intl = useIntl()

  if (error) {
    return (
      <Alert
        variant="light"
        color="red"
        title={intl.formatMessage({ id: 'errorMessage' })}
        icon={<IconAlertTriangle />}
      >
        {error}
      </Alert>
    )
  }
  return children
}

interface State {
  expenses: Expense[]
  errorExpenses: string | null
  errorIncome: string | null
  totals: { income: number, expense: number }
  lengthMonths: number
  expensesByCategories: { name: string, value: number, color: string }[]
}

type Action
  = | { type: 'SUCCESS', payload: Partial<State> }
    | { type: 'ERROR', payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SUCCESS':
      return {
        ...state,
        ...action.payload,
        errorExpenses: null,
        errorIncome: null,
      }
    case 'ERROR':
      return {
        ...state,
        errorExpenses: action.payload,
        errorIncome: action.payload,
      }
    default:
      return state
  }
}

export default function Dashboard() {
  const intl = useIntl()
  const { currency, lastBackup } = useSettingsStore()

  const [backupWarning, setBackupWarning] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(
    () => dayjs().format('YYYY-MM'),
  )

  const [state, dispatch] = useReducer(reducer, {
    expenses: [],
    errorExpenses: null,
    errorIncome: null,
    totals: { income: 0, expense: 0 },
    lengthMonths: 1,
    expensesByCategories: [],
  })

  const {
    expenses,
    errorExpenses,
    errorIncome,
    totals,
    lengthMonths,
    expensesByCategories,
  } = state

  useEffect(() => {
    const currentDay = dayjs().valueOf()
    const diffMilliseconds = Math.abs(currentDay - lastBackup)
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24))
    setBackupWarning(diffDays)
  }, [lastBackup])

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const allExpensesData = await db.expenses.toArray()
        const allIncomeData = await db.income.toArray()

        const startOfMonth = dayjs(selectedMonth)
          .startOf('month')
          .valueOf()
        const endOfMonth = dayjs(selectedMonth)
          .endOf('month')
          .valueOf()

        const selectedMonthExpenses = allExpensesData.filter(
          exp =>
            exp.actionTimestamp >= startOfMonth
            && exp.actionTimestamp <= endOfMonth,
        )

        const selectedMonthIncome = allIncomeData.filter(
          inc =>
            inc.actionTimestamp >= startOfMonth
            && inc.actionTimestamp <= endOfMonth,
        )

        const latestExpenses = selectedMonthExpenses
          .sort((a, b) => b.actionTimestamp - a.actionTimestamp)
          .slice(0, 10)

        const categoryMap = new Map<string, number>()

        selectedMonthExpenses.forEach((expense) => {
          const current = categoryMap.get(expense.category) || 0
          categoryMap.set(
            expense.category,
            current + Number.parseFloat(expense.amount.toFixed(2)),
          )
        })

        const categories = await db.categories.toArray()
        const categoryById = new Map(categories.map(c => [c.id, c]))

        const expenseCategory = Array.from(categoryMap.entries())
          .map(([id, value]) => {
            const category = categoryById.get(id)

            return {
              name:
                category?.name
                || intl.formatMessage({ id: 'categoryNotFound' }),
              value: Number.parseFloat(value.toFixed(2)),
              color: category?.color || '#ff6b6b',
            }
          })
          .sort((a, b) => b.value - a.value)

        const oldestExpense
          = allExpensesData.length > 0
            ? allExpensesData.reduce((min, curr) =>
                curr.actionTimestamp < min.actionTimestamp ? curr : min,
              )
            : null

        const oldestIncome
          = allIncomeData.length > 0
            ? allIncomeData.reduce((min, curr) =>
                curr.actionTimestamp < min.actionTimestamp ? curr : min,
              )
            : null

        const oldestTimestamp = Math.min(
          oldestExpense?.actionTimestamp ?? Date.now(),
          oldestIncome?.actionTimestamp ?? Date.now(),
        )

        const difference = dayjs().diff(
          dayjs(oldestTimestamp).format('YYYY-MM'),
          'month',
        )

        dispatch({
          type: 'SUCCESS',
          payload: {
            expenses: latestExpenses,
            totals: {
              expense: selectedMonthExpenses.reduce(
                (acc, curr) => acc + curr.amount,
                0,
              ),
              income: selectedMonthIncome.reduce(
                (acc, curr) => acc + curr.amount,
                0,
              ),
            },
            expensesByCategories: expenseCategory,
            lengthMonths: Math.max(difference + 1, 1),
          },
        })
      }
      catch (error) {
        const errorMessage = intl.formatMessage({ id: 'errorMessage' })

        dispatch({ type: 'ERROR', payload: errorMessage })

        displayNotification(intl, 'error', errorMessage, 'red')
        console.error('Dashboard error:', error)
      }
    }

    fetchExpenses()
  }, [selectedMonth, intl])

  return (
    <>
      <DashboardHeader lengthMonths={lengthMonths} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      {backupWarning > 7 && (
        <Alert variant="light" color="red" mb="md">
          The last backup was
          {' '}
          {backupWarning}
          {' '}
          days ago!
        </Alert>
      )}

      <Card withBorder padding="lg" radius="md" mb="md">
        <SimpleGrid cols={{ base: 3 }}>
          <div>
            <Text size="lg" fw={500} c="green">
              {intl.formatMessage({ id: 'income' })}
            </Text>
            <Text size="xl" fw={700}>
              <RenderErrorOrChildren error={errorIncome}>
                {currency}
                {totals.income.toFixed(2)}
              </RenderErrorOrChildren>
            </Text>
          </div>

          <div>
            <Text size="lg" fw={500} c="red">
              {intl.formatMessage({ id: 'expenses' })}
            </Text>
            <Text size="xl" fw={700}>
              <RenderErrorOrChildren error={errorExpenses}>
                {currency}
                {totals.expense.toFixed(2)}
              </RenderErrorOrChildren>
            </Text>
          </div>

          <div>
            <Text
              size="lg"
              fw={500}
              c={
                totals.income - totals.expense < 0 ? 'red' : 'green'
              }
            >
              {intl.formatMessage({ id: 'balance' })}
            </Text>
            <Text size="xl" fw={700}>
              <RenderErrorOrChildren error={errorExpenses}>
                {currency}
                {(totals.income - totals.expense).toFixed(2)}
              </RenderErrorOrChildren>
            </Text>
          </div>
        </SimpleGrid>
      </Card>

      <Grid mb="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          {expensesByCategories.length > 0 && (
            <Card withBorder padding="lg" radius="md" mb="md">
              <Text size="lg" fw={500} mb="md">
                {intl.formatMessage({ id: 'expensesByCategories' })}
              </Text>

              <Group align="center">
                <PieChart data={expensesByCategories} size={300} />

                <Stack>
                  {expensesByCategories.map(item => (
                    <Group key={item.name} gap="xs">
                      <Box
                        w={16}
                        h={16}
                        style={{
                          backgroundColor: item.color,
                          borderRadius: 4,
                        }}
                      />
                      <Text size="sm">
                        {item.name}
                        :
                        {currency}
                        {item.value}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Group>
            </Card>
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          {expenses.length > 0 && (
            <Card withBorder padding="lg" radius="md">
              <Text size="lg" fw={500} c="red">
                {intl.formatMessage({ id: 'last10Expenses' })}
              </Text>

              <RenderErrorOrChildren error={errorExpenses}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>
                        {intl.formatMessage({ id: 'name' })}
                      </Table.Th>
                      <Table.Th>
                        {intl.formatMessage({ id: 'amount' })}
                      </Table.Th>
                      <Table.Th>
                        {intl.formatMessage({ id: 'date' })}
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {expenses.map(expense => (
                      <Table.Tr key={expense.id}>
                        <Table.Td>{expense.name}</Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500} c="red">
                            {currency}
                            {expense.amount}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {dayjs(expense.actionTimestamp).fromNow()}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </RenderErrorOrChildren>
            </Card>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}
