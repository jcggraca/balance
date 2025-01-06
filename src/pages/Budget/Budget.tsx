import type { Budget as BudgetType } from '@/db'
import AddBudget from '@/components/Budget/AddBudget'
import ViewBudget from '@/components/Budget/ViewBudget'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Loader, Table, Text, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useState } from 'react'
import { useIntl } from 'react-intl'
import classes from './Budget.module.css'

const Budget: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

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

        <AddBudget />
      </div>

      {budgetDetails && <ViewBudget budget={budgetDetails} onClose={() => setBudgetDetails(undefined)} />}

      {!budgets && <Loader color="blue" />}
      {budgets && budgets?.length === 0 && <Text mt="xl">{intl.formatMessage({ id: 'noBudgetsFound' })}</Text>}
      {budgets && budgets?.length > 0 && (
        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{intl.formatMessage({ id: 'name' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'amount' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'description' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'updated' })}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {budgets.map(element => (
              <Table.Tr className={classes.table} onClick={() => setBudgetDetails(element)} key={element.name}>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>
                  {currency}
                  {element.amount}
                </Table.Td>
                <Table.Td className={classes.tableDescription}>{element.description || 'N/A'}</Table.Td>
                <Table.Td>{dayjs(element.updatedTimestamp).format('YYYY-MM-DD HH:mm')}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  )
}

export default Budget
