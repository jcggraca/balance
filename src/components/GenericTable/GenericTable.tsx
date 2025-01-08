import { Loader, Table, Text } from '@mantine/core'
import classes from './GenericTable.module.css'

interface Column<T> {
  key: string
  header: string
  render: (item: T) => React.ReactNode
}

interface GenericTableProps<T> {
  data: T[] | undefined
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  isLoading?: boolean
  emptyMessage: string
}

function GenericTable<T,>({
  data,
  columns,
  onRowClick,
  isLoading,
  emptyMessage,
}: GenericTableProps<T>) {
  if (isLoading)
    return <Loader color="blue" />

  if (!data?.length)
    return <Text mt="xl">{emptyMessage}</Text>

  return (
    <Table stickyHeader highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          {columns.map(column => (
            <Table.Th key={column.key}>{column.header}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((item, index) => (
          <Table.Tr
            key={index}
            className={classes.table}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map(column => (
              <Table.Td className={column.key === 'description' ? classes.tableDescription : ''} key={column.key}>
                {column.render(item)}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default GenericTable
