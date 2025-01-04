import type { Account, Types } from '@/db'
import AddExpense from '@/components/Expense/AddExpense'
import DeleteExpense from '@/components/Expense/DeleteExpense'
import ViewExpense from '@/components/Expense/ViewExpense'
import WarningNotFound from '@/components/WarningNotFound'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { EVALUATION } from '@/utils/values'
import { Card, Group, Loader, Table } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useEffect, useMemo, useState } from 'react'
import classes from './Expenses.module.css'

const RenderExpenses: FC = () => {
  const { currency } = useSettingsStore()
  const expenses = useLiveQuery(() => db.expenses.toArray())

  const [types, setTypes] = useState<Types[]>()
  const [accounts, setAccounts] = useState<Account[]>()
  const [accountNotFound, setAccountNotFound] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTypes = await db.types.toArray()
      setTypes(fetchedTypes)

      const fetchedAccounts = await db.account.toArray()
      setAccounts(fetchedAccounts)
    }

    fetchData()

    return () => {
      setTypes(undefined)
      setAccounts(undefined)
      setAccountNotFound(0)
    }
  }, [])

  useMemo(() => {
    if (expenses) {
      const length = expenses.filter(o => !accounts?.find(a => a.id === o.accountId)).length
      setAccountNotFound(length)
    }
  }, [expenses, accounts])

  if (!expenses) {
    return <Loader color="blue" />
  }

  if (expenses.length === 0) {
    return <p>No expenses found.</p>
  }

  const getTypeName = (id: string) => {
    const findType = types?.find(o => o.id === id)
    if (findType)
      return findType.name
    return <WarningNotFound>Type</WarningNotFound>
  }

  const getEvaluationName = (value: string) => {
    const findEvaluation = EVALUATION.find(o => o.value === value)
    if (findEvaluation)
      return <span style={{ color: findEvaluation.color }}>{findEvaluation.label}</span>
    return <WarningNotFound>Evaluation</WarningNotFound>
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
          {accountNotFound === 1 ? 'expense doesn\'t' : 'expenses don\'t'}
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
            <Table.Th>Type</Table.Th>
            <Table.Th>Evaluation</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th className={classes.tableActionButton}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {expenses.map(element => (
            <Table.Tr key={element.name}>
              <Table.Td>{element.name}</Table.Td>
              <Table.Td>
                {currency}
                {element.amount}
              </Table.Td>
              <Table.Td>{getAccountName(element.accountId)}</Table.Td>
              <Table.Td>{getTypeName(element.type)}</Table.Td>
              <Table.Td>{getEvaluationName(element.evaluation)}</Table.Td>
              <Table.Td>{dayjs(element.updatedTimestamp).format('hh:mm YYYY-MM-DD')}</Table.Td>
              <Table.Td>
                <Group>
                  <ViewExpense expense={element} icon />
                  <DeleteExpense icon expense={element} />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}

const Expenses: FC = () => {
  return (
    <>
      <div className={classes.header}>
        <h1>Expenses</h1>
        <AddExpense />
      </div>

      <RenderExpenses />
    </>
  )
}

export default Expenses
