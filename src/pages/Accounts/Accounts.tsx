import type { FC } from 'react'
import type { Account } from '../../db'
import { Avatar } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconBuildingBank } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import AddAccount from '../../components/Account/AddAccount'
import ViewAccount from '../../components/Account/ViewAccount'
import GenericMobileList from '../../components/GenericMobileList'
import GenericTable from '../../components/GenericTable'
import SearchFilters from '../../components/SearchFilters'
import { db } from '../../db'
import { useSettingsStore } from '../../stores/useSettingsStore'

const Accounts: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const [account, setAccount] = useState<Account | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null,
  })

  const accounts = useLiveQuery(async () => {
    let query = db.account.orderBy('updatedTimestamp')

    if (searchQuery) {
      query = query.filter(account =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (account.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    }

    if (dateRange.start) {
      query = query.filter(account =>
        account.updatedTimestamp >= dateRange.start!.getTime(),
      )
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      query = query.filter(account =>
        account.createdTimestamp <= endDate.getTime(),
      )
    }

    return await query.reverse().toArray()
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
          <IconBuildingBank />
        </Avatar>
      ),
    },
    {
      key: 'name',
      header: intl.formatMessage({ id: 'name' }),
      render: (item: Account) => item.name,
    },
    {
      key: 'amount',
      header: intl.formatMessage({ id: 'amount' }),
      render: (item: Account) => `${currency}${item.amount}`,
    },
    {
      key: 'description',
      header: intl.formatMessage({ id: 'description' }),
      render: (item: Account) => (
        <span className="tableDescription">
          {item.description || 'N/A'}
        </span>
      ),
    },
    {
      key: 'date',
      header: intl.formatMessage({ id: 'date' }),
      render: (item: Account) => dayjs(item.updatedTimestamp).fromNow(),
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
        <AddAccount />
      </div>

      {account && <ViewAccount account={account} onClose={() => setAccount(undefined)} />}

      {isMobile
        ? (
            <GenericMobileList
              data={accounts}
              onClick={item => setAccount(item as Account)}
              emptyMessage={intl.formatMessage({ id: 'noAccountFound' })}
            />
          )
        : (
            <GenericTable
              data={accounts}
              columns={columns}
              onClick={setAccount}
              emptyMessage={intl.formatMessage({ id: 'noAccountFound' })}
            />
          )}
    </>
  )
}

export default Accounts
