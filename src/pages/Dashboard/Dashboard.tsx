import type { Expense } from '@/db'
import type { ReactNode } from 'react'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { PieChart } from '@mantine/charts'
import { ActionIcon, Alert, Box, Card, Grid, Group, Stack, Table, Tabs, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

function RenderErrorOrChildren({ error, children }: { error: string | null, children: ReactNode }) {
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

function Dashboard() {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [errorExpenses, setErrorExpenses] = useState<string | null>(null)
  const [errorIncomes, setErrorIncomes] = useState<string | null>(null)
  const [totals, setTotals] = useState({ income: 0, expense: 0 })
  const [lengthMonths, setLengthMonths] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'))

  const monthOptions = Array.from({ length: lengthMonths }, (_, i) => {
    const date = dayjs().subtract((lengthMonths - 1) - i, 'month')
    return {
      value: date.format('YYYY-MM'),
      label: date.format('MMMM'),
      year: date.format('YYYY'),
    }
  })

  const [visibleStartIndex, setVisibleStartIndex] = useState(0)
  const visibleMonths = monthOptions.slice(visibleStartIndex, visibleStartIndex + 6)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const allExpensesData = await db.expenses.toArray()
        const allIncomesData = await db.income.toArray()
        const startOfMonth = dayjs(selectedMonth).startOf('month').valueOf()
        const endOfMonth = dayjs(selectedMonth).endOf('month').valueOf()

        const latestExpenses = allExpensesData
          .filter(exp => exp.actionTimestamp >= startOfMonth && exp.actionTimestamp <= endOfMonth)
          .sort((a, b) => b.actionTimestamp - a.actionTimestamp)
          .slice(0, 10)

        const selectedMonthExpenses = allExpensesData
          .filter(exp => exp.actionTimestamp >= startOfMonth && exp.actionTimestamp <= endOfMonth)

        const selectedMonthIncomes = allIncomesData
          .filter(inc => inc.actionTimestamp >= startOfMonth && inc.actionTimestamp <= endOfMonth)

        setExpenses(latestExpenses)
        setTotals({
          expense: selectedMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0),
          income: selectedMonthIncomes.reduce((acc, curr) => acc + curr.amount, 0),
        })

        const oldestExpense = allExpensesData.length > 0
          ? allExpensesData.sort((a, b) => a.actionTimestamp - b.actionTimestamp)[0]
          : { actionTimestamp: Date.now() }
        const oldestIncome = allIncomesData.length > 0
          ? allIncomesData.sort((a, b) => a.actionTimestamp - b.actionTimestamp)[0]
          : { actionTimestamp: Date.now() }

        const oldestMonth = dayjs(Math.min(oldestExpense.actionTimestamp, oldestIncome.actionTimestamp)).format('YYYY-MM')
        const difference = dayjs().diff(oldestMonth, 'month')
        setLengthMonths(Math.max(difference + 1, 1))

        setErrorExpenses(null)
        setErrorIncomes(null)
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : intl.formatMessage({ id: 'failedToLoadExpenses' })
        console.error('Error fetching data:', error)
        setErrorExpenses(errorMessage)
        setErrorIncomes(errorMessage)
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        })
      }
    }

    fetchExpenses()
  }, [selectedMonth, intl])

  const pieChartData = [
    { name: 'incomes', value: totals.income, color: '#51cf66' },
    { name: 'expenses', value: totals.expense, color: '#ff6b6b' },
  ]

  return (
    <>
      <Group gap={0} mb="md" style={{ width: '100%' }}>
        <ActionIcon
          variant="subtle"
          onClick={() => setVisibleStartIndex(prev => Math.max(0, prev - 1))}
          disabled={visibleStartIndex === 0}
        >
          <IconChevronLeft size={16} />
        </ActionIcon>

        <Tabs
          value={selectedMonth}
          onChange={value => setSelectedMonth(value || dayjs().format('YYYY-MM'))}
          style={{ flex: 1 }}
        >
          <Tabs.List style={{ width: '100%' }}>
            {visibleMonths.map((month) => {
              return (
                <Tabs.Tab
                  key={month.value}
                  value={month.value}
                  style={{ flex: 1 }}
                >
                  <Text tt="capitalize">{month.label}</Text>
                  <Text size="xs" c="dimmed" style={{ marginLeft: 4 }}>
                    {month.year}
                  </Text>
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
        </Tabs>

        <ActionIcon
          variant="subtle"
          onClick={() => setVisibleStartIndex(prev => Math.min(monthOptions.length - 6, prev + 1))}
          disabled={visibleStartIndex >= monthOptions.length - 6}
        >
          <IconChevronRight size={16} />
        </ActionIcon>
      </Group>
      <Grid mb="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder padding="lg" radius="md">
            <Text size="lg" fw={500} c="red">{intl.formatMessage({ id: 'last10Expenses' })}</Text>

            <RenderErrorOrChildren error={errorExpenses}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{intl.formatMessage({ id: 'name' })}</Table.Th>
                    <Table.Th>{intl.formatMessage({ id: 'amount' })}</Table.Th>
                    <Table.Th>{intl.formatMessage({ id: 'date' })}</Table.Th>
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
                      <Table.Td>{dayjs(expense.actionTimestamp).fromNow()}</Table.Td>
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
              {intl.formatMessage({ id: 'totalIncomes' })}
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
              {intl.formatMessage({ id: 'totalExpenses' })}
            </Text>
            <Text size="xl" fw={700}>
              <RenderErrorOrChildren error={errorExpenses}>
                {currency}
                {totals.expense}
              </RenderErrorOrChildren>
            </Text>
          </Card>

          <Card withBorder padding="lg" radius="md" mb="md">
            <Text size="lg" fw={500} mb="md">{intl.formatMessage({ id: 'monthlyOverview' })}</Text>
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
                      {intl.formatMessage({ id: item.name })}
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
