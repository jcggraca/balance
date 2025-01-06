import type { FC } from 'react'
import { db, type Types } from '@/db'
import { Button, Group, Modal, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'

const AddTypes: FC = () => {
  const intl = useIntl()
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: value => !value.trim() ? intl.formatMessage({ id: 'nameIsRequired' }) : null,
      description: value => !value.trim() ? intl.formatMessage({ id: 'descriptionIsRequired' }) : null,
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
      <Button onClick={open}>{intl.formatMessage({ id: 'addType' })}</Button>

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'addType' })}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label={intl.formatMessage({ id: 'name' })}
            required
            mt="md"
            {...form.getInputProps('name')}
          />

          <Textarea
            label={intl.formatMessage({ id: 'description' })}
            required
            mt="md"
            {...form.getInputProps('description')}
          />

          <Group mt="xl">
            <Button type="submit">{intl.formatMessage({ id: 'addType' })}</Button>
            <Button onClick={close} type="button">{intl.formatMessage({ id: 'cancel' })}</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddTypes
