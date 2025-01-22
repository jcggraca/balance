import { Box, Table, Text } from '@mantine/core'
import classes from './GenericTable.module.css'

interface Column<T> {
  key: string
  header: string
  render: (item: T) => React.ReactNode
}

interface GenericTableProps<T> {
  data: T[] | undefined
  columns: Column<T>[]
  onClick?: (item: T) => void
  emptyMessage: string
}

function GenericTable<T,>({
  data,
  columns,
  onClick,
  emptyMessage,
}: GenericTableProps<T>) {
  if (!data?.length)
    return <Text mt="xl">{emptyMessage}</Text>

  const tableStyle = (key: string) => {
    if (key === 'description')
      return classes.description
    if (key === 'icon')
      return classes.icon
    if (key === 'name')
      return classes.name
    return ''
  }

  return (
    <Box style={{ overflowX: 'auto', width: '100%' }}>
      <Table stickyHeader highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {columns.map(column => (
              <Table.Th key={column.key} data-key={column.key}>{column.header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.map((item, index) => (
            <Table.Tr
              key={index}
              className={classes.table}
              onClick={() => onClick?.(item)}
            >
              {columns.map(column => (
                <Table.Td
                  key={column.key}
                  data-key={column.key}
                  className={tableStyle(column.key)}
                >
                  {column.render(item)}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  )
}

export default GenericTable
