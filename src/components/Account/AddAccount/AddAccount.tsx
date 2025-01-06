import type { FC } from 'react'
import { type Account, db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'

const AddAccount: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      amount: '',
      description: '',
    },
    validate: {
      name: value => (!value ? intl.formatMessage({ id: 'nameIsRequired' }) : null),
      amount: (value) => {
        if (!value)
          return intl.formatMessage({ id: 'amountIsRequired' })
        if (Number.isNaN(Number(value)))
          return intl.formatMessage({ id: 'amountMustBeANumber' })
        return null
      },
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const data: Account = {
      id: uuidv4(),
      name: values.name,
      amount: Number(values.amount),
      description: values.description,
      createdTimestamp: date,
      updatedTimestamp: date,
    }

    await db.account.add(data)
    form.reset()
    close()
  }

  return (
    <>
      <Button onClick={open}>{intl.formatMessage({ id: 'addAccount' })}</Button>

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'addAccount' })}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label={intl.formatMessage({ id: 'name' })}
            placeholder={intl.formatMessage({ id: 'enterName' })}
            required
            mt="md"
            {...form.getInputProps('name')}
          />

          <NumberInput
            label={intl.formatMessage({ id: 'amount' })}
            prefix={currency}
            hideControls
            decimalScale={2}
            placeholder={intl.formatMessage({ id: 'enterAmount' })}
            required
            mt="md"
            {...form.getInputProps('amount')}
          />

          <Textarea
            label={intl.formatMessage({ id: 'description' })}
            placeholder={intl.formatMessage({ id: 'enterDescription' })}
            mt="md"
            {...form.getInputProps('description')}
          />

          <Group mt="xl">
            <Button type="submit">{intl.formatMessage({ id: 'addAccount' })}</Button>
            <Button variant="outline" onClick={close}>{intl.formatMessage({ id: 'cancel' })}</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddAccount
