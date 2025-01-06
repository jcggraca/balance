import type { Types as TypesType } from '@/db'
import AddTypes from '@/components/Types/AddTypes'
import ViewTypes from '@/components/Types/ViewTypes'
import { db } from '@/db'
import { Button, Group, Loader, Table, Text, TextInput } from '@mantine/core'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useState } from 'react'
import { useIntl } from 'react-intl'
import classes from './Types.module.css'

const Types: FC = () => {
  const intl = useIntl()
  const [type, setType] = useState<TypesType | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const typesList = useLiveQuery(async () => {
    let query = db.types.orderBy('updatedTimestamp')

    if (searchQuery) {
      query = query.filter(type =>
        type.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (type.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    }

    return await query.toArray()
  }, [searchQuery])

  const handleClearFilters = () => {
    setSearchQuery('')
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

          <Button onClick={handleClearFilters}>{intl.formatMessage({ id: 'clearFilters' })}</Button>
        </Group>

        <AddTypes />
      </div>

      {type && <ViewTypes type={type} onClose={() => setType(undefined)} />}

      {!typesList && <Loader color="blue" />}
      {typesList && typesList?.length === 0 && <Text mt="xl">{intl.formatMessage({ id: 'noTypesFound' })}</Text>}
      {typesList && typesList?.length > 0 && (
        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{intl.formatMessage({ id: 'name' })}</Table.Th>
              <Table.Th>{intl.formatMessage({ id: 'description' })}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {typesList.map(element => (
              <Table.Tr className={classes.table} onClick={() => setType(element)} key={element.id}>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>{element.description}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  )
}

export default Types
