import type { Account } from '@/db'
import AddAccount from '@/components/Account/AddAccount'
import ViewAccount from '@/components/Account/ViewAccount'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Loader, Table, Text, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
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

        <AddAccount />
      </div>

      {account && <ViewAccount account={account} onClose={() => setAccount(undefined)} />}

      {!accounts && <Loader color="blue" />}
      {accounts && accounts?.length === 0 && <Text mt="xl">{intl.formatMessage({ id: 'noAccountsFound' })}</Text>}
      {accounts && accounts?.length > 0 && (
        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{intl.formatMessage({ id: 'name' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'amount' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'description' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'date' })}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {accounts?.map(element => (
              <Table.Tr className={classes.table} onClick={() => setAccount(element)} key={element.name}>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>
                  {currency}
                  {element.amount}
                </Table.Td>
                <Table.Td className={classes.tableDescription}>{element.description || 'N/A'}</Table.Td>
                <Table.Td>{dayjs(element.updatedTimestamp).fromNow()}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  )
}

export default Accounts
