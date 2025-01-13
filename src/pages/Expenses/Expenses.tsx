import type { Account, Category, Expense } from '@/db'
import AddExpense from '@/components/Expense/AddExpense'
import ViewExpense from '@/components/Expense/ViewExpense'
import TransactionMobileList from '@/components/GenericMobileList/TransactionMobileList'
import GenericTable from '@/components/GenericTable'
import SearchFilters from '@/components/SearchFilters'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { EVALUATION } from '@/utils/values'
import { Card } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconAlertTriangle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

const Expenses: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const [categories, setCategories] = useState<Category[]>()
  const [accounts, setAccounts] = useState<Account[]>()
  const [accountNotFound, setAccountNotFound] = useState(0)
  const [expense, setExpense] = useState<Expense | undefined>(undefined)
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

    return await query.reverse().toArray()
  }, [searchQuery, dateRange])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCategories = await db.categories.toArray()
      setCategories(fetchedCategories)

      const fetchedAccounts = await db.account.toArray()
      setAccounts(fetchedAccounts)
    }

    fetchData()

    return () => {
      setCategories(undefined)
      setAccounts(undefined)
      setAccountNotFound(0)
      setExpense(undefined)
      setSearchQuery('')
      setDateRange({ start: null, end: null })
    }
  }, [])

  useMemo(() => {
    if (expenses) {
      const length = expenses.filter(o => !accounts?.find(a => a.id === o.accountId)).length
      setAccountNotFound(length)
    }
  }, [expenses, accounts])

  const getCategoryName = (id: string) => {
    const findCategory = categories?.find(o => o.id === id)
    if (findCategory)
      return findCategory.name
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
      key: 'category',
      header: intl.formatMessage({ id: 'category' }),
      render: (item: Expense) => getCategoryName(item.category),
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

  const getAccount = (accountId: string) => {
    const account = accounts?.find(o => o.id === accountId)
    return !!account
  }

  return (
    <>
      <div className="responsiveHeader">
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onClearFilters={handleClearFilters}
        />
        <AddExpense isMobile={isMobile} />
      </div>

      {expense && <ViewExpense expense={expense} onClose={() => setExpense(undefined)} />}

      {accountNotFound > 0 && accounts && !isMobile && (
        <Card className="card" withBorder radius="md" shadow="sm">
          <IconAlertTriangle />
          {' '}
          {accountNotFound}
          {' '}
          {accountNotFound === 1 ? intl.formatMessage({ id: 'expenseOne' }) : intl.formatMessage({ id: 'expensesMulti' })}
          {' '}
          {intl.formatMessage({ id: 'requireAccountAssociated' })}
        </Card>
      )}

      {isMobile
        ? (
            <TransactionMobileList
              data={expenses}
              onClick={item => setExpense(item as Expense)}
              isLoading={!expenses}
              emptyMessage={intl.formatMessage({ id: 'noExpenseFound' })}
              getAccount={getAccount}
              categories={categories}
              errorMessage="Account or type not found"
            />
          )
        : (
            <GenericTable
              data={expenses}
              columns={columns}
              onClick={setExpense}
              isLoading={!expenses}
              emptyMessage={intl.formatMessage({ id: 'noExpenseFound' })}
            />
          )}
    </>
  )
}

export default Expenses
