import type { FC } from 'react'
import AddBudget from '@/components/Budget/AddBudget'
import DeleteBudget from '@/components/Budget/DeleteBudget'
import ViewBudget from '@/components/Budget/ViewBudget'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Group, Table } from '@mantine/core'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import classes from './Budget.module.css'

const Budget: FC = () => {
  const { currency } = useSettingsStore()
  const budget = useLiveQuery(() => db.budget.toArray())

  if (!budget)
    return null

  return (
    <>
      <div className={classes.header}>
        <h1>Budget</h1>
        <AddBudget />
      </div>
      {budget.length === 0
        ? (
            <p>No budget found.</p>
          )
        : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Updated</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {budget.map(element => (
                  <Table.Tr key={element.name}>
                    <Table.Td>{element.name}</Table.Td>
                    <Table.Td>
                      {currency}
                      {element.amount}
                    </Table.Td>
                    <Table.Td>{element.description}</Table.Td>
                    <Table.Td>{dayjs(element.updatedTimestamp).format('YYYY-MM-DD HH:mm:ss')}</Table.Td>
                    <Table.Td>
                      <Group>
                        <ViewBudget budget={element} icon />
                        <DeleteBudget budget={element} icon />
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
    </>
  )
}

export default Budget
