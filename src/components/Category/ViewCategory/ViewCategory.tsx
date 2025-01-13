import type { Category } from '@/db'
import RenderIcon from '@/components/RenderIcon'
import { db } from '@/db'
import { Button, ColorInput, Flex, Group, Modal, Table, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import DeleteCategory from '../DeleteCategory'
import classes from './ViewCategory.module.css'

interface ViewCategoryProps {
  category: Category
  onClose: () => void
}

const ViewCategory: FC<ViewCategoryProps> = ({ category, onClose }) => {
  const intl = useIntl()
  const [editMode, setEditMode] = useState(false)

  const form = useForm({
    initialValues: {
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
    },
    validate: {
      name: value => !value.trim() ? intl.formatMessage({ id: 'nameIsRequired' }) : null,
      description: value => !value.trim() ? intl.formatMessage({ id: 'descriptionIsRequired' }) : null,
      color: value => (!value.trim() ? intl.formatMessage({ id: 'colorIsRequired' }) : null),
      icon: value => (!value.trim() ? intl.formatMessage({ id: 'iconIsRequired' }) : null),
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

    const data: Category = {
      ...category,
      ...values,
      updatedTimestamp: date,
    }

    await db.categories.put(data)
    onClose()
  }

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'viewCategory' })}>
      {editMode
        ? (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label={intl.formatMessage({ id: 'name' })}
                {...form.getInputProps('name')}
                required
                mt="md"
              />

              <ColorInput
                label={intl.formatMessage({ id: 'color' })}
                placeholder={intl.formatMessage({ id: 'enterColor' })}
                required
                mt="md"
                {...form.getInputProps('color')}
              />

              <Flex align="center">
                <TextInput
                  label={intl.formatMessage({ id: 'icon' })}
                  placeholder={intl.formatMessage({ id: 'enterIcon' })}
                  required
                  value={form.values.icon}
                  w="100%"
                  mt="md"
                  {...form.getInputProps('icon')}
                />
                <RenderIcon icon={form.values.icon} />
              </Flex>
              <a href="https://tabler.io/icons" target="_blank" rel="noreferrer">
                {intl.formatMessage({ id: 'searchIcon' })}
              </a>

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
