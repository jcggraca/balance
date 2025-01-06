import type { Types } from '@/db'
import { db } from '@/db'
import { Button, Group, Modal, Table, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import DeleteTypes from '../DeleteTypes'

interface ViewTypesProps {
  type: Types
  onClose: () => void
}

const ViewTypes: FC<ViewTypesProps> = ({ type, onClose }) => {
  const intl = useIntl()
  const [editMode, setEditMode] = useState(false)

  const form = useForm({
    initialValues: {
      name: type.name,
      description: type.description,
    },
    validate: {
      name: value => !value.trim() ? intl.formatMessage({ id: 'nameIsRequired' }) : null,
      description: value => !value.trim() ? intl.formatMessage({ id: 'descriptionIsRequired' }) : null,
    },
  })

  useEffect(() => {
    return () => {
      form.reset()
      setEditMode(false)
    }
  }, [])

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const data: Types = {
      ...type,
      ...values,
      updatedTimestamp: date,
    }

    await db.types.put(data)
    onClose()
  }

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'viewType' })}>
      {editMode
        ? (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label={intl.formatMessage({ id: 'name' })}
                {...form.getInputProps('name')}
                required
                mt="md"
              />

              <Textarea
                label={intl.formatMessage({ id: 'description' })}
                {...form.getInputProps('description')}
                required
                mt="md"
              />

              <Group mt="xl">
                <Button type="submit">{intl.formatMessage({ id: 'update' })}</Button>
                <Button
                  variant="subtle"
                  onClick={() => {
                    setEditMode(false)
                    form.reset()
                  }}
                >
                  {intl.formatMessage({ id: 'cancel' })}
                </Button>
              </Group>
            </form>
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
                    <Table.Td>{type.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'createdAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(type.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'updatedAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(type.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'description' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {type.description || 'N/A'}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Group mt="xl">
                <Button onClick={() => setEditMode(true)}>{intl.formatMessage({ id: 'edit' })}</Button>
                <DeleteTypes type={type} onClose={onClose} />
                <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'close' })}</Button>
              </Group>
            </>
          )}
    </Modal>
  )
}

export default ViewTypes
