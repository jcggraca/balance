import type { Category } from '@/db'
import RenderIcon from '@/components/RenderIcon'
import { Button, Group, Modal, Table } from '@mantine/core'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import DeleteCategory from '../DeleteCategory'
import UpdateCategory from '../UpdateCategory'
import classes from './ViewCategory.module.css'

interface ViewCategoryProps {
  category: Category
  onClose: () => void
}

const ViewCategory: FC<ViewCategoryProps> = ({ category, onClose }) => {
  const intl = useIntl()
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    return () => {
      setEditMode(false)
    }
  }, [])

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'viewCategory' })}>
      {editMode
        ? (
            <UpdateCategory onClose={onClose} category={category} />
          )
        : (
            <>
              <Table variant="vertical" layout="fixed" withTableBorder>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'name' })}
                      :
                    </Table.Th>
                    <Table.Td>{category.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'color' })}
                      :
                    </Table.Th>
                    <Table.Td className={classes.colorCell}>
                      <span className={classes.colorCircle} style={{ backgroundColor: category.color }} />
                      {category.color}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'icon' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <RenderIcon noStyle icon={category.icon} />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'description' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {category.description || 'N/A'}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'createdAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(category.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'updatedAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(category.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Group mt="xl">
                <Button onClick={() => setEditMode(true)}>{intl.formatMessage({ id: 'edit' })}</Button>
                <DeleteCategory category={category} onClose={onClose} />
                <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'close' })}</Button>
              </Group>
            </>
          )}
    </Modal>
  )
}

export default ViewCategory
