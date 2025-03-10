import type { ReactNode } from 'react'
import type { Expense } from '../../db'
import { PieChart } from '@mantine/charts'
import { ActionIcon, Alert, Box, Card, Grid, Group, SimpleGrid, Stack, Table, Tabs, Text } from '@mantine/core'
import { IconAlertTriangle, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../db'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { displayNotification } from '../../utils/form'

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
  const { currency, lastBackup } = useSettingsStore()

  const [backupWarning, setBackupWarning] = useState(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [errorExpenses, setErrorExpenses] = useState<string | null>(null)
  const [errorIncome, setErrorIncome] = useState<string | null>(null)
  const [totals, setTotals] = useState({ income: 0, expense: 0 })
  const [lengthMonths, setLengthMonths] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'))
  const [expensesByCategories, setExpensesByCategories] = useState<{ name: string, value: number, color: string }[]>([])

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
        const startOfMonth = dayjs(selectedMonth).startOf('month').valueOf()
        const endOfMonth = dayjs(selectedMonth).endOf('month').valueOf()

        const latestExpenses = allExpensesData
          .filter(exp => exp.actionTimestamp >= startOfMonth && exp.actionTimestamp <= endOfMonth)
          .sort((a, b) => b.actionTimestamp - a.actionTimestamp)
          .slice(0, 10)

        const selectedMonthExpenses = allExpensesData
          .filter(exp => exp.actionTimestamp >= startOfMonth && exp.actionTimestamp <= endOfMonth)

        const selectedMonthIncome = allIncomeData
          .filter(inc => inc.actionTimestamp >= startOfMonth && inc.actionTimestamp <= endOfMonth)

        // Calculate expenses by category
        const categoryMap = new Map<string, number>()
        selectedMonthExpenses.forEach((expense) => {
          const current = categoryMap.get(expense.category) || 0
          categoryMap.set(expense.category, current + Number.parseFloat(expense.amount.toFixed(2)))
        })

        const categories = await db.categories.toArray()
        const expenseCategory = Array.from(categoryMap.entries()).map(([name, value]) => ({
          name: categories.find(category => category.id === name)?.name || intl.formatMessage({ id: 'categoryNotFound' }),
          value: Number.parseFloat(value.toFixed(2)),
          color: categories.find(category => category.id === name)?.color || '#ff6b6b',
        })).sort((a, b) => b.value - a.value)

        setExpensesByCategories(expenseCategory)

        setExpenses(latestExpenses)
        setTotals({
          expense: selectedMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0),
          income: selectedMonthIncome.reduce((acc, curr) => acc + curr.amount, 0),
        })

        const oldestExpense = allExpensesData.length > 0
          ? allExpensesData.sort((a, b) => a.actionTimestamp - b.actionTimestamp)[0]
          : { actionTimestamp: Date.now() }
        const oldestIncome = allIncomeData.length > 0
          ? allIncomeData.sort((a, b) => a.actionTimestamp - b.actionTimestamp)[0]
          : { actionTimestamp: Date.now() }

        const oldestMonth = dayjs(Math.min(oldestExpense.actionTimestamp, oldestIncome.actionTimestamp)).format('YYYY-MM')
        const difference = dayjs().diff(oldestMonth, 'month')
        setLengthMonths(Math.max(difference + 1, 1))

        setErrorExpenses(null)
        setErrorIncome(null)
      }
      catch (error) {
        const errorMessage = intl.formatMessage({ id: 'errorMessage' })
        setErrorExpenses(errorMessage)
        setErrorIncome(errorMessage)
        displayNotification(intl, 'error', errorMessage, 'red')

        console.error('Dashboard error:', error)
      }
    }

    fetchExpenses()
  }, [selectedMonth])

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

      {backupWarning > 7 && (
        <Alert variant="light" color="red" title="Account status" mb="md">
          The last backup was
          {' '}
          {backupWarning}
          {' '}
          days ago!
        </Alert>
      )}

      <Card style={{ overflow: 'hidden', maxWidth: '100%' }} withBorder padding="lg" radius="md" mb="md">
        <SimpleGrid cols={{ base: 3 }}>
          <div>
            <Text size="lg" fw={500} c="green">
              {intl.formatMessage({ id: 'income' })}
            </Text>
            <Text size="xl" fw={700}>
              <RenderErrorOrChildren error={errorIncome}>
                {currency}
                {Number.parseFloat(totals.income.toFixed(2))}
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
                {Number.parseFloat(totals.expense.toFixed(2))}
              </RenderErrorOrChildren>
            </Text>
          </div>

          <div>
            <Text size="lg" fw={500} c={totals.income - totals.expense < 0 ? 'red' : 'green'}>
              {intl.formatMessage({ id: 'balance' })}
            </Text>
            <Text size="xl" fw={700}>
              <RenderErrorOrChildren error={errorExpenses}>
                {currency}
                {Number.parseFloat((totals.income - totals.expense).toFixed(2))}
              </RenderErrorOrChildren>
            </Text>
          </div>
        </SimpleGrid>
      </Card>

      <Grid mb="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          {expensesByCategories.length > 0 && (
            <Card withBorder padding="lg" radius="md" mb="md">
              <Text size="lg" fw={500} mb="md">{intl.formatMessage({ id: 'expensesByCategories' })}</Text>
              <Group align="center">
                <PieChart
                  data={expensesByCategories}
                  size={300}
                />
                <Stack>
                  {expensesByCategories.map(item => (
                    <Group key={item.name} gap="xs">
                      <Box w={16} h={16} style={{ backgroundColor: item.color, borderRadius: 4 }} />
                      <Text size="sm">
                        {item?.name || 'error'}
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
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          {expenses.length > 0 && (
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
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}

export default Dashboard
