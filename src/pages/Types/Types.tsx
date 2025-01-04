import type { FC } from 'react'
import AddTypes from '@/components/Types/AddTypes'
import DeleteTypes from '@/components/Types/DeleteTypes'
import ViewTypes from '@/components/Types/ViewTypes'
import { db } from '@/db'
import { Group, Table } from '@mantine/core'
import { useLiveQuery } from 'dexie-react-hooks'
import classes from './Types.module.css'

const Types: FC = () => {
  const typesList = useLiveQuery(() => db.types.toArray())

  if (!typesList)
    return null

  return (
    <>
      <div className={classes.header}>
        <h1>Types</h1>
        <AddTypes />
      </div>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {typesList.map(element => (
            <Table.Tr key={element.id}>
              <Table.Td>{element.name}</Table.Td>
              <Table.Td>{element.description}</Table.Td>
              <Table.Td>
                <Group>
                  <ViewTypes type={element} icon />
                  <DeleteTypes type={element} icon />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}

export default Types
