import type { Account } from '@/db'
import AddAccount from '@/components/Account/AddAccount'
import ViewAccount from '@/components/Account/ViewAccount'
import GenericTable from '@/components/GenericTable'
import SearchFilters from '@/components/SearchFilters'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useState } from 'react'
import { useIntl } from 'react-intl'
import classes from './Accounts.module.css'

const Accounts: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

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
      query = query.filter(account =>
        account.updatedTimestamp <= dateRange.end!.getTime(),
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
        <span className={classes.tableDescription}>
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
      <div className={classes.header}>
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

      <GenericTable
        data={accounts}
        columns={columns}
        onRowClick={setAccount}
        isLoading={!accounts}
        emptyMessage={intl.formatMessage({ id: 'noAccountsFound' })}
      />
    </>
  )
}

export default Accounts
