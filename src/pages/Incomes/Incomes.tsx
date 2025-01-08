import type { Account, Income } from '@/db'
import GenericTable from '@/components/GenericTable'
import AddIncome from '@/components/Income/AddIncome'
import ViewIncome from '@/components/Income/ViewIncome'
import SearchFilters from '@/components/SearchFilters'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Card } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import classes from './Incomes.module.css'

const Incomes: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [accounts, setAccounts] = useState<Account[]>()
  const [accountNotFound, setAccountNotFound] = useState(0)
  const [income, setIncome] = useState<Income | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null,
  })

  const incomes = useLiveQuery(async () => {
    let query = db.income.orderBy('actionTimestamp')

    if (searchQuery) {
      query = query.filter(income =>
        income.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (income.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    }

    if (dateRange.start) {
      query = query.filter(income =>
        income.actionTimestamp >= dateRange.start!.getTime(),
      )
    }

    if (dateRange.end) {
      query = query.filter(income =>
        income.actionTimestamp <= dateRange.end!.getTime(),
      )
    }

    return await query.toArray()
  }, [searchQuery, dateRange])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAccounts = await db.account.toArray()
      setAccounts(fetchedAccounts)
    }

    fetchData()

    return () => {
      setAccounts(undefined)
      setAccountNotFound(0)
    }
  }, [])

  useMemo(() => {
    if (incomes) {
      const length = incomes.filter(o => !accounts?.find(a => a.id === o.accountId)).length
      setAccountNotFound(length)
    }
  }, [incomes, accounts])

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
      render: (item: Income) => item.name,
    },
    {
      key: 'amount',
      header: intl.formatMessage({ id: 'amount' }),
      render: (item: Income) => `${currency}${item.amount}`,
    },
    {
      key: 'account',
      header: intl.formatMessage({ id: 'account' }),
      render: (item: Income) => getAccountName(item.accountId),
    },
    {
      key: 'description',
      header: intl.formatMessage({ id: 'description' }),
      render: (item: Income) => (
        <span className={classes.tableDescription}>
          {item.description || 'N/A'}
        </span>
      ),
    },
    {
      key: 'actionDate',
      header: intl.formatMessage({ id: 'actionDate' }),
      render: (item: Income) => dayjs(item.actionTimestamp).format('DD/MM/YYYY'),
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
        <AddIncome />
      </div>

      {accountNotFound > 0 && accounts && (
        <Card className={classes.card} withBorder radius="md" shadow="sm">
          <IconAlertTriangle />
          {' '}
          {accountNotFound}
          {' '}
          {accountNotFound === 1 ? intl.formatMessage({ id: 'incomeDoesnt' }) : intl.formatMessage({ id: 'incomesDont' })}
          {' '}
          {intl.formatMessage({ id: 'haveAnAccountAssociatedToIt' })}
        </Card>
      )}

      {income && <ViewIncome income={income} onClose={() => setIncome(undefined)} />}

      <GenericTable
        data={incomes}
        columns={columns}
        onRowClick={setIncome}
        isLoading={!incomes}
        emptyMessage={intl.formatMessage({ id: 'noIncomesFound' })}
      />
    </>
  )
}

export default Incomes
