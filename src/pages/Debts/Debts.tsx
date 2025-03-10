import type { FC } from 'react'
import type { Debt } from '../../db'
import { Avatar } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCreditCard } from '@tabler/icons-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import AddDebt from '../../components/Debt/AddDebt'
import ViewDebt from '../../components/Debt/ViewDebt'
import GenericMobileList from '../../components/GenericMobileList'
import GenericTable from '../../components/GenericTable'
import SearchFilters from '../../components/SearchFilters'
import { db } from '../../db'
import { useSettingsStore } from '../../stores/useSettingsStore'

const Debts: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const [debt, setDebt] = useState<Debt | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null,
  })

  const debts = useLiveQuery(async () => {
    let query = db.debts.orderBy('updatedTimestamp')

    if (searchQuery) {
      query = query.filter(debt =>
        debt.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (debt.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    }

    if (dateRange.start) {
      query = query.filter(debt =>
        debt.updatedTimestamp >= dateRange.start!.getTime(),
      )
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      query = query.filter(debt =>
        debt.createdTimestamp <= endDate.getTime(),
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
      key: 'icon',
      header: intl.formatMessage({ id: 'icon' }),
      render: () => (
        <Avatar color="green" radius="xl">
          <IconCreditCard />
        </Avatar>
      ),
    },
    {
      key: 'name',
      header: intl.formatMessage({ id: 'name' }),
      render: (item: Debt) => item.name,
    },
    {
      key: 'amount',
      header: intl.formatMessage({ id: 'amount' }),
      render: (item: Debt) => `${currency}${item.amount}`,
    },
    {
      key: 'description',
      header: intl.formatMessage({ id: 'description' }),
      render: (item: Debt) => (
        <span className="tableDescription">
          {item.description || 'N/A'}
        </span>
      ),
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
        <AddDebt />
      </div>

      {debt && <ViewDebt debt={debt} onClose={() => setDebt(undefined)} />}

      {isMobile
        ? (
            <GenericMobileList
              data={debts}
              onClick={item => setDebt(item as Debt)}
              emptyMessage={intl.formatMessage({ id: 'noDebtFound' })}
            />
          )
        : (
            <GenericTable
              data={debts}
              columns={columns}
              onClick={setDebt}
              emptyMessage={intl.formatMessage({ id: 'noDebtFound' })}
            />
          )}
    </>
  )
}

export default Debts
