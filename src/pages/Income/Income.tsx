import type { FC, ReactNode } from 'react'
import type { Account, Income as IncomeType } from '../../db'
import { Card } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconAlertTriangle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import TransactionMobileList from '../../components/GenericMobileList/TransactionMobileList'
import GenericTable from '../../components/GenericTable'
import AddIncome from '../../components/Income/AddIncome'
import ViewIncome from '../../components/Income/ViewIncome'
import RenderAvatar from '../../components/RenderAvatar/RenderAvatar'
import SearchFilters from '../../components/SearchFilters'
import WarningNotFound from '../../components/WarningNotFound'
import { db } from '../../db'
import { useSettingsStore } from '../../stores/useSettingsStore'

interface Filters {
  searchQuery: string
  searchAccount: string
  dateRange: {
    start: Date | null
    end: Date | null
  }
}

function getEntityName(entities: Account[] | undefined, id: string, fallbackMessage: string | ReactNode): string | ReactNode {
  const entity = entities?.find(e => e.id === id)
  return entity ? entity.name : <WarningNotFound>{fallbackMessage}</WarningNotFound>
}

function filterExpenses(expenses: IncomeType[], filters: Filters): IncomeType[] {
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

const Income: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const [selectedIncome, setSelectedIncome] = useState<IncomeType | undefined>(undefined)
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    searchAccount: '',
    dateRange: { start: null, end: null },
  })

  const incomeList = useLiveQuery(async () => {
    const allIncome = await db.income.orderBy('actionTimestamp').reverse().toArray()
    return filterExpenses(allIncome, filters)
  }, [filters])

  const accountsList = useLiveQuery(() => db.account.toArray())

  const accountNotFound = useMemo(() => {
    if (!incomeList || !accountsList)
      return 0
    return incomeList.filter(e => !accountsList.find(a => a.id === e.accountId)).length
  }, [incomeList, accountsList])

  const columns = useMemo(
    () => [
      {
        key: 'icon',
        header: intl.formatMessage({ id: 'icon' }),
        render: (item: IncomeType) => (
          <RenderAvatar
            displayError={!accountsList?.find(o => o.id === item.accountId)}
            item={item}
            placeholderIcon="IconBellDollar"
          />
        ),
      },
      {
        key: 'name',
        header: intl.formatMessage({ id: 'name' }),
        render: (item: IncomeType) => item.name,
      },
      {
        key: 'amount',
        header: intl.formatMessage({ id: 'amount' }),
        render: (item: IncomeType) => `${currency}${item.amount}`,
      },
      {
        key: 'account',
        header: intl.formatMessage({ id: 'account' }),
        render: (item: IncomeType) => getEntityName(accountsList, item.accountId, intl.formatMessage({ id: 'account' })),
      },
      {
        key: 'description',
        header: intl.formatMessage({ id: 'description' }),
        render: (item: IncomeType) => (
          <span className="tableDescription">
            {item.description || 'N/A'}
          </span>
        ),
      },
      {
        key: 'actionDate',
        header: intl.formatMessage({ id: 'actionDate' }),
        render: (item: IncomeType) => dayjs(item.actionTimestamp).format('DD/MM/YYYY'),
      },
    ],
    [accountsList, intl, currency],
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
        <AddIncome isMobile={isMobile} />
      </div>

      {selectedIncome && <ViewIncome income={selectedIncome} onClose={() => setSelectedIncome(undefined)} />}

      {!isMobile && accountNotFound > 0 && (
        <Card className="card" withBorder radius="md" shadow="sm">
          <IconAlertTriangle />
          {` ${accountNotFound} ${intl.formatMessage({
            id: accountNotFound === 1 ? 'incomeNoOne' : 'incomeNoMulti',
          })}`}
        </Card>
      )}

      {isMobile
        ? (
            <TransactionMobileList
              data={incomeList}
              onClick={item => setSelectedIncome(item as IncomeType)}
              emptyMessage={intl.formatMessage({ id: 'noIncomeFound' })}
              getAccount={(id: string) => !!accountsList?.find(a => a.id === id)}
              errorMessage={intl.formatMessage({ id: 'accountNotFound' })}
            />
          )
        : (
            <GenericTable
              data={incomeList}
              columns={columns}
              onClick={setSelectedIncome}
              emptyMessage={intl.formatMessage({ id: 'noIncomeFound' })}
            />
          )}
    </>
  )
}

export default Income
