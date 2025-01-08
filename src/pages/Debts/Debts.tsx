import type { Debts as DebtsType } from '@/db'
import AddDebts from '@/components/Debts/AddDebts'
import ViewDebts from '@/components/Debts/ViewDebts'
import GenericTable from '@/components/GenericTable'
import SearchFilters from '@/components/SearchFilters'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useState } from 'react'
import { useIntl } from 'react-intl'
import classes from './Debts.module.css'

const Debts: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [debt, setDebt] = useState<DebtsType | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null,
  })

  const debts = useLiveQuery(async () => {
    let query = db.debts.orderBy('createdTimestamp')

    if (searchQuery) {
      query = query.filter(debt =>
        debt.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (debt.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    }

    if (dateRange.start) {
      query = query.filter(debt =>
        debt.createdTimestamp >= dateRange.start!.getTime(),
      )
    }

    if (dateRange.end) {
      query = query.filter(debt =>
        debt.createdTimestamp <= dateRange.end!.getTime(),
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
      render: (item: DebtsType) => item.name,
    },
    {
      key: 'amount',
      header: intl.formatMessage({ id: 'amount' }),
      render: (item: DebtsType) => `${currency}${item.amount}`,
    },
    {
      key: 'description',
      header: intl.formatMessage({ id: 'description' }),
      render: (item: DebtsType) => (
        <span className={classes.tableDescription}>
          {item.description || 'N/A'}
        </span>
      ),
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
        <AddDebts />
      </div>

      {debt && <ViewDebts debt={debt} onClose={() => setDebt(undefined)} />}

      <GenericTable
        data={debts}
        columns={columns}
        onRowClick={setDebt}
        isLoading={!debts}
        emptyMessage={intl.formatMessage({ id: 'noDebtsFound' })}
      />
    </>
  )
}

export default Debts
