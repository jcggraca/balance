import type { Expense } from '@/db'
import type { ReactNode } from 'react'
import ViewExpense from '@/components/Expense/ViewExpense'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { PieChart } from '@mantine/charts'
import { Alert, Box, Card, Grid, Group, Stack, Table, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

function RenderErrorOrChildren({ error, children }: { error: string | null, children: ReactNode }) {
  if (error) {
    return (
      <Alert
        variant="light"
        color="red"
        title="Error message"
        icon={<IconAlertTriangle />}
      >
        {error}
      </Alert>
    )
  }
  return children
}

function Dashboard() {
  const { currency } = useSettingsStore()

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [errorExpenses, setErrorExpenses] = useState<string | null>(null)
  const [errorIncomes, setErrorIncomes] = useState<string | null>(null)
  const [totals, setTotals] = useState({ income: 0, expense: 0 })

  useEffect(() => {
    const startOfMonth = dayjs().startOf('month').valueOf()
    const endOfMonth = dayjs().endOf('month').valueOf()

    const fetchExpenses = async () => {
      try {
        const latestExpenses = await db.expenses
          .orderBy('actionTimestamp')
          .reverse()
          .limit(10)
          .toArray()

        const currentMonthExpenses = await db.expenses
          .where('actionTimestamp')
          .between(startOfMonth, endOfMonth)
          .toArray()

        const calculatedExpensesTotals = currentMonthExpenses.reduce((acc, curr) => {
          acc.expense += curr.amount
          return acc
        }, { expense: 0 })

        setExpenses(latestExpenses)
        setTotals(prevState => ({
          ...prevState,
          expense: calculatedExpensesTotals.expense,
        }))
        setErrorExpenses(null)
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load expenses. Please try again later.'
        console.error('Error fetching expenses:', error)
        setErrorExpenses(errorMessage)
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        })
      }
    }

    const fetchIncomes = async () => {
      try {
        const currentMonthIncomes = await db.income
          .where('actionTimestamp')
          .between(startOfMonth, endOfMonth)
          .toArray()

        const calculatedIncomeTotal = currentMonthIncomes.reduce((acc, curr) => {
          acc.income += curr.amount
          return acc
        }, { income: 0 })

        setTotals(prevState => ({
          ...prevState,
          income: calculatedIncomeTotal.income,
        }))
        setErrorIncomes(null)
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load income totals. Please try again later.'
        console.error('Error fetching income totals:', error)
        setErrorIncomes(errorMessage)
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        })
      }
    }

    fetchIncomes()
    fetchExpenses()
  }, [])

  const pieChartData = [
    { name: 'Income', value: totals.income, color: '#51cf66' },
    { name: 'Expenses', value: totals.expense, color: '#ff6b6b' },
  ]

  return (
    <>
      <h1>Dashboard</h1>

      <Grid mb="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder padding="lg" radius="md">
            <Text size="lg" fw={500} c="red">Last 10 Expenses</Text>

            <RenderErrorOrChildren error={errorExpenses}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th style={{ width: '6rem' }}></Table.Th>
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
                      <Table.Td>{dayjs(expense.updatedTimestamp).fromNow()}</Table.Td>
                      <Table.Td><ViewExpense expense={expense} /></Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </RenderErrorOrChildren>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder padding="lg" radius="md" mb="md">
            <Text size="lg" fw={500} c="green">
              Total Income (Current month)
            </Text>
            <Text size="xl" fw={700}>
              <RenderErrorOrChildren error={errorIncomes}>
                {currency}
                {totals.income}
              </RenderErrorOrChildren>
            </Text>
          </Card>

          <Card withBorder padding="lg" radius="md" mb="md">
            <Text size="lg" fw={500} c="red">
              Total Expenses (Current month)
            </Text>
            <Text size="xl" fw={700}>
              <RenderErrorOrChildren error={errorExpenses}>
                {currency}
                {totals.expense}
              </RenderErrorOrChildren>
            </Text>
          </Card>

          <Card withBorder padding="lg" radius="md" mb="md">
            <Text size="lg" fw={500} mb="md">Monthly Overview</Text>
            <Group align="center">
              <PieChart
                data={pieChartData}
                size={300}
              />
              <Stack>
                {pieChartData.map(item => (
                  <Group key={item.name} gap="xs">
                    <Box w={16} h={16} style={{ backgroundColor: item.color, borderRadius: 4 }} />
                    <Text size="sm">
                      {item.name}
                      :
                      {' '}
                      {currency}
                      {item.value}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default Dashboard
