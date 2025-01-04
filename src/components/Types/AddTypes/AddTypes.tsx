import type { FC } from 'react'
import { db, type Types } from '@/db'
import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import classes from './AddTypes.module.css'

const AddTypes: FC = () => {
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: value => !value.trim() ? 'Name is required' : null,
      description: value => !value.trim() ? 'Description is required' : null,
    },
  })

  const handleSubmit = async (values: { name: string, description: string }) => {
    const date = dayjs().valueOf()

    const type: Types = {
      id: uuidv4(),
      name: values.name,
      description: values.description,
      createdTimestamp: date,
      updatedTimestamp: date,
    }

    await db.types.add(type)
    form.reset()
    close()
  }

  return (
    <>
      <Button onClick={open}>Add type</Button>

      <Modal centered opened={opened} onClose={close} title="Add Type">
        <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Description"
            {...form.getInputProps('description')}
          />

          <Group>
            <Button type="submit">Add Type</Button>
            <Button onClick={close} type="button">Cancel</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddTypes
