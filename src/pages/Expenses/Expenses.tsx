import type { Account, Expense, Types } from '@/db'
import AddExpense from '@/components/Expense/AddExpense'
import ViewExpense from '@/components/Expense/ViewExpense'
import GenericTable from '@/components/GenericTable'
import SearchFilters from '@/components/SearchFilters'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { EVALUATION } from '@/utils/values'
import { Card } from '@mantine/core'
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

  const columns = [
    {
      key: 'name',
      header: intl.formatMessage({ id: 'name' }),
      render: (item: Expense) => item.name,
    },
    {
      key: 'amount',
      header: intl.formatMessage({ id: 'amount' }),
      render: (item: Expense) => `${currency}${item.amount}`,
    },
    {
      key: 'account',
      header: intl.formatMessage({ id: 'account' }),
      render: (item: Expense) => getAccountName(item.accountId),
    },
    {
      key: 'type',
      header: intl.formatMessage({ id: 'type' }),
      render: (item: Expense) => getTypeName(item.type),
    },
    {
      key: 'evaluation',
      header: intl.formatMessage({ id: 'evaluation' }),
      render: (item: Expense) => getEvaluationName(item.evaluation),
    },
    {
      key: 'date',
      header: intl.formatMessage({ id: 'date' }),
      render: (item: Expense) => dayjs(item.actionTimestamp).format('DD/MM/YYYY'),
    },
  ]

  return (
    <>
      <div className={classes.header}>
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onClearFilters={handleClearFilters}
        />
        <AddExpense />
      </div>

      {accountNotFound > 0 && accounts && (
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

      <GenericTable
        data={expenses}
        columns={columns}
        onRowClick={setExpense}
        isLoading={!expenses}
        emptyMessage={intl.formatMessage({ id: 'noExpensesFound' })}
      />
    </>
  )
}

export default Expenses
