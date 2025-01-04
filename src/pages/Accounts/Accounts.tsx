import type { FC } from 'react'
import AddAccount from '@/components/Account/AddAccount'
import DeleteAccount from '@/components/Account/DeleteAccount'
import ViewAccount from '@/components/Account/ViewAccount'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Group, Loader, Table } from '@mantine/core'
import dayjs from 'dayjs'

import { useLiveQuery } from 'dexie-react-hooks'
import classes from './Accounts.module.css'

const RenderAccounts: FC = () => {
  const { currency } = useSettingsStore()
  const accounts = useLiveQuery(() => db.account.toArray())

  if (!accounts) {
    return <Loader color="blue" />
  }

  if (accounts.length === 0) {
    return <p>No accounts found.</p>
  }

  return (
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
        {accounts?.map(element => (
          <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>
              {currency}
              {element.amount}
            </Table.Td>
            <Table.Td>{element.description || 'N/A'}</Table.Td>
            <Table.Td>{dayjs(element.updatedTimestamp).fromNow()}</Table.Td>
            <Table.Td className={classes.tableButtons}>
              <Group>
                <ViewAccount account={element} icon />
                <DeleteAccount account={element} icon />
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

const Accounts: FC = () => {
  return (
    <>
      <div className={classes.header}>
        <h1>Accounts</h1>
        <AddAccount />
      </div>

      <RenderAccounts />
    </>
  )
}

export default Accounts
