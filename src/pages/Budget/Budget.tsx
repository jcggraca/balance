import type { Budget as BudgetType } from '@/db'
import AddBudget from '@/components/Budget/AddBudget'
import ViewBudget from '@/components/Budget/ViewBudget'
import GenericMobileList from '@/components/GenericMobileList'
import GenericTable from '@/components/GenericTable'
import SearchFilters from '@/components/SearchFilters'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useMediaQuery } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useState } from 'react'
import { useIntl } from 'react-intl'

const Budget: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const [budgetDetails, setBudgetDetails] = useState<BudgetType | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null,
  })

  const budgets = useLiveQuery(async () => {
    let query = db.budget.orderBy('updatedTimestamp')

    if (searchQuery) {
      query = query.filter(budget =>
        budget.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (budget.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    }

    if (dateRange.start) {
      query = query.filter(budget =>
        budget.updatedTimestamp >= dateRange.start!.getTime(),
      )
    }

    if (dateRange.end) {
      query = query.filter(budget =>
        budget.updatedTimestamp <= dateRange.end!.getTime(),
      )
    }

    return await query.toArray()
  }, [searchQuery, dateRange])

  const handleClearFilters = () => {
    setSearchQuery('')
    setDateRange({ start: null, end: null })
  }

  const columns = [
    {
      key: 'name',
      header: intl.formatMessage({ id: 'name' }),
      render: (item: BudgetType) => item.name,
    },
    {
      key: 'amount',
      header: intl.formatMessage({ id: 'amount' }),
      render: (item: BudgetType) => `${currency}${item.amount}`,
    },
    {
      key: 'description',
      header: intl.formatMessage({ id: 'description' }),
      render: (item: BudgetType) => (
        <span className="tableDescription">
          {item.description || 'N/A'}
        </span>
      ),
    },
    {
      key: 'updated',
      header: intl.formatMessage({ id: 'updated' }),
      render: (item: BudgetType) => dayjs(item.updatedTimestamp).format('DD/MM/YYYY HH:mm'),
    },
  ]

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
        <AddBudget />
      </div>

      {budgetDetails && <ViewBudget budget={budgetDetails} onClose={() => setBudgetDetails(undefined)} />}

      {isMobile
        ? (
            <GenericMobileList
              data={budgets}
              onClick={item => setBudgetDetails(item as BudgetType)}
              isLoading={!budgets}
              emptyMessage={intl.formatMessage({ id: 'noBudgetFound' })}
            />
          )
        : (
            <GenericTable
              data={budgets}
              columns={columns}
              onClick={setBudgetDetails}
              isLoading={!budgets}
              emptyMessage={intl.formatMessage({ id: 'noBudgetFound' })}
            />
          )}
    </>
  )
}

export default Budget
