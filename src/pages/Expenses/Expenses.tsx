import type { Account, Expense, Types } from '@/db'
import AddExpense from '@/components/Expense/AddExpense'
import ViewExpense from '@/components/Expense/ViewExpense'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { EVALUATION } from '@/utils/values'
import { Button, Card, Group, Loader, Table, Text, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconAlertTriangle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import classes from './Expenses.module.css'

const Expenses: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [types, setTypes] = useState<Types[]>()
  const [accounts, setAccounts] = useState<Account[]>()
  const [accountNotFound, setAccountNotFound] = useState(0)
  const [expense, setExpense] = useState<Expense | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null,
  })

  const expenses = useLiveQuery(async () => {
    let query = db.expenses.orderBy('actionTimestamp')

    if (searchQuery) {
      query = query.filter(expense =>
        expense.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (expense.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    }

    if (dateRange.start) {
      query = query.filter(expense =>
        expense.actionTimestamp >= dateRange.start!.getTime(),
      )
    }

    if (dateRange.end) {
      query = query.filter(expense =>
        expense.actionTimestamp <= dateRange.end!.getTime(),
      )
    }

    return await query.toArray()
  }, [searchQuery, dateRange])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTypes = await db.types.toArray()
      setTypes(fetchedTypes)

      const fetchedAccounts = await db.account.toArray()
      setAccounts(fetchedAccounts)
    }

    fetchData()

    return () => {
      setTypes(undefined)
      setAccounts(undefined)
      setAccountNotFound(0)
    }
  }, [])

  useMemo(() => {
    if (expenses) {
      const length = expenses.filter(o => !accounts?.find(a => a.id === o.accountId)).length
      setAccountNotFound(length)
    }
  }, [expenses, accounts])

  const getTypeName = (id: string) => {
    const findType = types?.find(o => o.id === id)
    if (findType)
      return findType.name
    return <WarningNotFound>{intl.formatMessage({ id: 'type' })}</WarningNotFound>
  }

  const getEvaluationName = (value: string) => {
    const findEvaluation = EVALUATION.find(o => o.value === value)
    if (findEvaluation)
      return <span style={{ color: findEvaluation.color }}>{intl.formatMessage({ id: findEvaluation.label })}</span>
    return <WarningNotFound>{intl.formatMessage({ id: 'evaluation' })}</WarningNotFound>
  }

  const getAccountName = (accountId: string) => {
    const account = accounts?.find(o => o.id === accountId)
    if (account)
      return account.name
    return <WarningNotFound>{intl.formatMessage({ id: 'account' })}</WarningNotFound>
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDateRange({ start: null, end: null })
  }

  return (
    <>
      <div className={classes.header}>
        <Group>
          <TextInput
            placeholder={intl.formatMessage({ id: 'searchByNameAndDescription' })}
            value={searchQuery}
            onChange={e => setSearchQuery(e.currentTarget.value)}
            w={250}
          />
          <DateInput
            valueFormat="DD/MM/YYYY"
            placeholder={intl.formatMessage({ id: 'startDate' })}
            value={dateRange.start}
            onChange={date => setDateRange(prev => ({ ...prev, start: date }))}
          />
          <DateInput
            valueFormat="DD/MM/YYYY"
            placeholder={intl.formatMessage({ id: 'endDate' })}
            value={dateRange.end}
            onChange={date => setDateRange(prev => ({ ...prev, end: date }))}
          />
          <Button onClick={handleClearFilters}>{intl.formatMessage({ id: 'clearFilters' })}</Button>
        </Group>

        <AddExpense />
      </div>

      {accountNotFound > 0 && accounts
      && (
        <Card className={classes.card} withBorder radius="md" shadow="sm">
          <IconAlertTriangle />
          {' '}
          {accountNotFound}
          {' '}
          {accountNotFound === 1 ? intl.formatMessage({ id: 'expenseDoesnt' }) : intl.formatMessage({ id: 'expensesDont' })}
          {' '}
          {intl.formatMessage({ id: 'haveAnAccountAssociatedToIt' })}
        </Card>
      )}

      {expense && <ViewExpense expense={expense} onClose={() => setExpense(undefined)} />}

      {!expenses && <Loader color="blue" />}
      {expenses && expenses?.length === 0 && <Text mt="xl">{intl.formatMessage({ id: 'noExpensesFound' })}</Text>}
      {expenses && expenses?.length > 0 && (
        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{intl.formatMessage({ id: 'name' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'amount' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'account' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'type' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'evaluation' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'date' })}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {expenses.map(element => (
              <Table.Tr className={classes.table} onClick={() => setExpense(element)} key={element.name}>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>
                  {currency}
                  {element.amount}
                </Table.Td>
                <Table.Td>{getAccountName(element.accountId)}</Table.Td>
                <Table.Td>{getTypeName(element.type)}</Table.Td>
                <Table.Td>{getEvaluationName(element.evaluation)}</Table.Td>
                <Table.Td>{dayjs(element.actionTimestamp).format('DD/MM/YYYY')}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  )
}

export default Expenses
