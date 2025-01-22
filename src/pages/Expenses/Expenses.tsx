import type { Account, Category, Expense } from '@/db'
import type { FC, ReactNode } from 'react'
import AddExpense from '@/components/Expense/AddExpense'
import ViewExpense from '@/components/Expense/ViewExpense'
import TransactionMobileList from '@/components/GenericMobileList/TransactionMobileList'
import GenericTable from '@/components/GenericTable'
import RenderAvatar from '@/components/RenderAvatar/RenderAvatar'
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
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

interface Filters {
  searchQuery: string
  searchAccount: string
  dateRange: {
    start: Date | null
    end: Date | null
  }
}

function getEntityName(entities: Account[] | Category[] | undefined, id: string, fallbackMessage: string | ReactNode): string | ReactNode {
  const entity = entities?.find(e => e.id === id)
  return entity ? entity.name : <WarningNotFound>{fallbackMessage}</WarningNotFound>
}

function getEvaluationLabel(intl: ReturnType<typeof useIntl>, value: string): ReactNode {
  const evaluation = EVALUATION.find(e => e.value === value)
  return evaluation
    ? (
        <span style={{ color: evaluation.color }}>
          {intl.formatMessage({ id: evaluation.label })}
        </span>
      )
    : (
        <WarningNotFound>{intl.formatMessage({ id: 'evaluation' })}</WarningNotFound>
      )
}

function filterExpenses(expenses: Expense[], filters: Filters): Expense[] {
  const { searchQuery, dateRange, searchAccount } = filters

  return expenses.filter((expense) => {
    const matchesQuery
      = !searchQuery
        || expense.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (expense.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    const matchesStartDate = !dateRange.start || expense.actionTimestamp >= dateRange.start.getTime()
    const matchesEndDate = !dateRange.end || expense.actionTimestamp <= dateRange.end.getTime()
    const matchesAccount = !searchAccount || expense.accountId === searchAccount

    return matchesQuery && matchesStartDate && matchesEndDate && matchesAccount
  })
}

const Expenses: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const [expense, setExpense] = useState<Expense | null>(null)
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    searchAccount: '',
    dateRange: { start: null, end: null },
  })

  const accountsList = useLiveQuery(() => db.account.toArray())
  const categories = useLiveQuery(() => db.categories.toArray())
  const expenses = useLiveQuery(async () => {
    const allExpenses = await db.expenses.orderBy('actionTimestamp').reverse().toArray()
    return filterExpenses(allExpenses, filters)
  }, [filters])

  const accountNotFound = useMemo(() => {
    if (!expenses || !accountsList)
      return 0
    return expenses.filter(e => !accountsList.find(a => a.id === e.accountId)).length
  }, [expenses, accountsList])

  const columns = useMemo(
    () => [
      {
        key: 'icon',
        header: intl.formatMessage({ id: 'icon' }),
        render: (item: Expense) => (
          <RenderAvatar
            displayError={
              !accountsList?.find(o => o.id === item.accountId)
              || !categories?.find(o => o.id === item.category)
            }
            categories={categories}
            item={item}
            placeholderIcon="IconMoneybag"
          />
        ),
      },
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
        render: (item: Expense) =>
          getEntityName(accountsList, item.accountId, intl.formatMessage({ id: 'account' })),
      },
      {
        key: 'category',
        header: intl.formatMessage({ id: 'category' }),
        render: (item: Expense) =>
          getEntityName(categories, item.category, intl.formatMessage({ id: 'category' })),
      },
      {
        key: 'evaluation',
        header: intl.formatMessage({ id: 'evaluation' }),
        render: (item: Expense) => getEvaluationLabel(intl, item.evaluation),
      },
      {
        key: 'date',
        header: intl.formatMessage({ id: 'date' }),
        render: (item: Expense) => dayjs(item.actionTimestamp).format('DD/MM/YYYY'),
      },
    ],
    [categories, accountsList, intl, currency],
  )

  const handleClearFilters = () =>
    setFilters({
      searchQuery: '',
      searchAccount: '',
      dateRange: { start: null, end: null },
    })

  return (
    <>
      <div className="responsiveHeader">
        <SearchFilters
          searchQuery={filters.searchQuery}
          onSearchChange={query => setFilters({ ...filters, searchQuery: query })}
          dateRange={filters.dateRange}
          onDateRangeChange={range => setFilters({ ...filters, dateRange: range })}
          onClearFilters={handleClearFilters}
          accounts={accountsList}
          onSearchAccount={account => setFilters({ ...filters, searchAccount: account ?? '' })}
        />
        <AddExpense isMobile={isMobile} />
      </div>

      {expense && <ViewExpense expense={expense} onClose={() => setExpense(null)} />}

      {!isMobile && accountNotFound > 0 && (
        <Card className="card" withBorder radius="md" shadow="sm">
          <IconAlertTriangle />
          {` ${accountNotFound} ${intl.formatMessage({
            id: accountNotFound === 1 ? 'expenseNoOne' : 'expensesNoMulti',
          })}`}
          {` ${intl.formatMessage({ id: 'requireAccountAssociated' })}`}
        </Card>
      )}

      {isMobile
        ? (
            <TransactionMobileList
              data={expenses}
              onClick={item => setExpense(item as Expense)}
              emptyMessage={intl.formatMessage({ id: 'noExpenseFound' })}
              getAccount={(id: string) => !!accountsList?.find(a => a.id === id)}
              categories={categories}
              errorMessage={intl.formatMessage({ id: 'accountOrCategoryNotFound' })}
            />
          )
        : (
            <GenericTable
              data={expenses}
              columns={columns}
              onClick={setExpense}
              emptyMessage={intl.formatMessage({ id: 'noExpenseFound' })}
            />
          )}
    </>
  )
}

export default Expenses
