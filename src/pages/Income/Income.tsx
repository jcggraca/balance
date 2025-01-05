import type { Account } from '@/db'
import AddIncome from '@/components/Income/AddIncome'
import DeleteIncome from '@/components/Income/DeleteIncome'
import ViewIncome from '@/components/Income/ViewIncome'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Card, Group, Loader, Table } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useEffect, useMemo, useState } from 'react'
import classes from './Income.module.css'

const RenderIncomes: FC = () => {
  const { currency } = useSettingsStore()
  const incomes = useLiveQuery(() => db.income.toArray())

  const [accounts, setAccounts] = useState<Account[]>()
  const [accountNotFound, setAccountNotFound] = useState(0)

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

  if (!incomes) {
    return <Loader color="blue" />
  }

  if (incomes.length === 0) {
    return <p>No incomes found.</p>
  }

  const getAccountName = (accountId: string) => {
    const account = accounts?.find(o => o.id === accountId)
    if (account)
      return account.name
    return <WarningNotFound>Account</WarningNotFound>
  }

  return (
    <>
      {accountNotFound > 0 && accounts
      && (
        <Card className={classes.card} withBorder radius="md" shadow="sm">
          <IconAlertTriangle />
          {' '}
          {accountNotFound}
          {' '}
          {accountNotFound === 1 ? 'income doesn\'t' : 'incomes don\'t'}
          {' '}
          have an account associated to it.
        </Card>
      )}

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Account</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Updated</Table.Th>
            <Table.Th className={classes.tableActionButton}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {incomes.map(element => (
            <Table.Tr key={element.name}>
              <Table.Td>{element.name}</Table.Td>
              <Table.Td>
                {currency}
                {element.amount}
              </Table.Td>
              <Table.Td>{getAccountName(element.accountId)}</Table.Td>
              <Table.Td>{element.description || 'N/A'}</Table.Td>
              <Table.Td>{dayjs(element.updatedTimestamp).format('YYYY-MM-DD HH:mm:ss')}</Table.Td>
              <Table.Td>
                <Group>
                  <ViewIncome income={element} icon />
                  <DeleteIncome income={element} icon />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}

const Income: FC = () => {
  return (
    <>
      <div className={classes.header}>
        <p>Search Container WIP</p>
        <AddIncome />
      </div>

      <RenderIncomes />
    </>
  )
}

export default Income
