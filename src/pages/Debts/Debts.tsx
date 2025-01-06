import type { Debts as DebtsType } from '@/db'
import AddDebts from '@/components/Debts/AddDebts'
import ViewDebts from '@/components/Debts/ViewDebts'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Loader, Table, Text, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
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

        <AddDebts />
      </div>

      {debt && <ViewDebts debt={debt} onClose={() => setDebt(undefined)} />}

      {!debts && <Loader color="blue" />}
      {debts && debts?.length === 0 && <Text mt="xl">{intl.formatMessage({ id: 'noDebtsFound' })}</Text>}
      {debts && debts?.length > 0 && (
        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{intl.formatMessage({ id: 'name' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'amount' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'description' })}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {debts.map(element => (
              <Table.Tr className={classes.table} onClick={() => setDebt(element)} key={element.name}>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>
                  {currency}
                  {element.amount}
                </Table.Td>
                <Table.Td className={classes.tableDescription}>{element.description || 'N/A'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  )
}

export default Debts
