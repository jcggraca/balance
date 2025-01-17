import type { Account, Income as IncomeType } from '@/db'
import TransactionMobileList from '@/components/GenericMobileList/TransactionMobileList'
import GenericTable from '@/components/GenericTable'
import AddIncome from '@/components/Income/AddIncome'
import ViewIncome from '@/components/Income/ViewIncome'
import SearchFilters from '@/components/SearchFilters'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Avatar, Card } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconAlertTriangle, IconBellDollar } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

const Income: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const [accounts, setAccounts] = useState<Account[]>()
  const [accountNotFound, setAccountNotFound] = useState(0)
  const [selectedIncome, setSelectedIncome] = useState<IncomeType | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null,
  })

  const incomeList = useLiveQuery(async () => {
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

    return await query.reverse().toArray()
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
      setSelectedIncome(undefined)
      setSearchQuery('')
      setDateRange({ start: null, end: null })
    }
  }, [])

  useMemo(() => {
    if (incomeList && accounts) {
      const length = incomeList.filter(o => !accounts?.find(a => a.id === o.accountId)).length
      setAccountNotFound(length)
    }
  }, [incomeList, accounts])

  const getAccountName = (accountId: string) => {
    const account = accounts?.find(o => o.id === accountId)
    if (account)
      return account.name
    return <WarningNotFound>{intl.formatMessage({ id: 'account' })}</WarningNotFound>
  }

  const getAccount = (accountId: string) => {
    const account = accounts?.find(o => o.id === accountId)
    return !!account
  }

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
          <IconBellDollar />
        </Avatar>
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
      render: (item: IncomeType) => getAccountName(item.accountId),
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
        <AddIncome isMobile={isMobile} />
      </div>

      {selectedIncome && <ViewIncome income={selectedIncome} onClose={() => setSelectedIncome(undefined)} />}

      {accountNotFound > 0 && accounts && !isMobile && (
        <Card className="card" withBorder radius="md" shadow="sm">
          <IconAlertTriangle />
          {' '}
          {accountNotFound}
          {' '}
          {accountNotFound === 1 ? intl.formatMessage({ id: 'incomeNoOne' }) : intl.formatMessage({ id: 'incomeNoMulti' })}
          {' '}
          {intl.formatMessage({ id: 'requireAccountAssociated' })}
        </Card>
      )}

      {isMobile
        ? (
            <TransactionMobileList
              data={incomeList}
              onClick={item => setSelectedIncome(item as IncomeType)}
              isLoading={!incomeList}
              emptyMessage={intl.formatMessage({ id: 'noIncomeFound' })}
              getAccount={getAccount}
              errorMessage="Account not found"
            />
          )
        : (
            <GenericTable
              data={incomeList}
              columns={columns}
              onClick={setSelectedIncome}
              isLoading={!incomeList}
              emptyMessage={intl.formatMessage({ id: 'noIncomeFound' })}
            />
          )}
    </>
  )
}

export default Income
