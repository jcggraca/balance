import type { Account, Income } from '@/db'
import AddIncome from '@/components/Income/AddIncome'
import ViewIncome from '@/components/Income/ViewIncome'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Card, Group, Loader, Table, Text, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
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
    return <WarningNotFound>Account</WarningNotFound>
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDateRange({ start: null, end: null })
  }

  return (
    <>
      <div className={classes.header}>
        <Group>
          <TextInput
            placeholder={intl.formatMessage({ id: 'searchByNameAndDescription' })}
            value={searchQuery}
            onChange={e => setSearchQuery(e.currentTarget.value)}
            w={250}
          />
          <DateInput
            valueFormat="DD/MM/YYYY"
            placeholder={intl.formatMessage({ id: 'startDate' })}
            value={dateRange.start}
            onChange={date => setDateRange(prev => ({ ...prev, start: date }))}
          />
          <DateInput
            valueFormat="DD/MM/YYYY"
            placeholder={intl.formatMessage({ id: 'endDate' })}
            value={dateRange.end}
            onChange={date => setDateRange(prev => ({ ...prev, end: date }))}
          />
          <Button onClick={handleClearFilters}>{intl.formatMessage({ id: 'clearFilters' })}</Button>
        </Group>

        <AddIncome />
      </div>

      {accountNotFound > 0 && accounts
      && (
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

      {!incomes && <Loader color="blue" />}
      {incomes && incomes?.length === 0 && <Text mt="xl">{intl.formatMessage({ id: 'noIncomesFound' })}</Text>}
      {incomes && incomes?.length > 0 && (
        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{intl.formatMessage({ id: 'name' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'amount' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'account' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'description' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'actionDate' })}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {incomes.map(element => (
              <Table.Tr className={classes.table} onClick={() => setIncome(element)} key={element.name}>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>
                  {currency}
                  {element.amount}
                </Table.Td>
                <Table.Td>{getAccountName(element.accountId)}</Table.Td>
                <Table.Td className={classes.tableDescription}>{element.description || 'N/A'}</Table.Td>
                <Table.Td>{dayjs(element.actionTimestamp).format('DD/MM/YYYY')}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  )
}

export default Incomes
