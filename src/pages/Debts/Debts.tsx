import type { FC } from 'react'
import AddDebts from '@/components/Debts/AddDebts'
import DeleteDebts from '@/components/Debts/DeleteDebts'
import ViewDebts from '@/components/Debts/ViewDebts'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Group, Loader, Table } from '@mantine/core'
import { useLiveQuery } from 'dexie-react-hooks'
import classes from './Debts.module.css'

const RenderDebts: FC = () => {
  const { currency } = useSettingsStore()
  const debts = useLiveQuery(() => db.debts.toArray())

  if (!debts) {
    return <Loader color="blue" />
  }

  if (debts.length === 0) {
    return <p>No debts found.</p>
  }

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Amount</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {debts.map(element => (
          <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>
              {currency}
              {element.amount}
            </Table.Td>
            <Table.Td>{element.description}</Table.Td>
            <Table.Td>
              <Group>
                <ViewDebts debt={element} />
                <DeleteDebts debt={element} />
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

const Debts: FC = () => {
  const debts = useLiveQuery(() => db.debts.toArray())

  if (!debts)
    return null

  return (
    <>
      <div className={classes.header}>
        <h1>Debts</h1>
        <AddDebts />
      </div>

      <RenderDebts />
    </>
  )
}

export default Debts
