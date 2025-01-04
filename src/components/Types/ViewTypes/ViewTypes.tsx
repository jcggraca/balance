import type { Types } from '@/db'
import { db } from '@/db'
import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconEye } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { type FC, useState } from 'react'
import classes from './ViewTypes.module.css'

interface ViewTypesProps {
  type: Types
  icon?: boolean
}

const ViewTypes: FC<ViewTypesProps> = ({ type, icon = false }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const [editMode, setEditMode] = useState(false)

  const form = useForm({
    initialValues: {
      name: type.name,
      description: type.description,
    },
    validate: {
      name: value => !value.trim() ? 'Name is required' : null,
      description: value => !value.trim() ? 'Description is required' : null,
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const data: Types = {
      ...type,
      ...values,
      updatedTimestamp: date,
    }

    await db.types.put(data)
    setEditMode(false)
    form.reset()
    close()
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" onClick={open}><IconEye /></Button>
        : <Button variant="light" onClick={open}>Details</Button>}

      <Modal centered opened={opened} onClose={close} title="View Type">
        {editMode
          ? (
              <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                  label="Name"
                  {...form.getInputProps('name')}
                  required
                />

                <TextInput
                  label="Description"
                  {...form.getInputProps('description')}
                  required
                />

                <Group>
                  <Button type="submit">Update</Button>
                  <Button onClick={() => {
                    setEditMode(false)
                    form.reset()
                  }}
                  >
                    Cancel
                  </Button>
                </Group>
              </form>
            )
          : (
              <>
                <ul>
                  <li>
                    <b>Name:</b>
                    {' '}
                    {type.name}
                  </li>
                  <li>
                    <b>Description:</b>
                    {' '}
                    {type.description}
                  </li>
                  <li>
                    <b>Created at:</b>
                    {' '}
                    {type.createdTimestamp}
                  </li>
                  <li>
                    <b>Updated at:</b>
                    {' '}
                    {type.updatedTimestamp}
                  </li>
                </ul>

                <Group>
                  <Button onClick={() => setEditMode(true)}>Edit</Button>
                  <Button onClick={close}>Close</Button>
                </Group>
              </>
            )}
      </Modal>
    </>
  )
}

export default ViewTypes
