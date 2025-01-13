import type { Debt } from '@/db'
import type { FC } from 'react'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'

const AddDebt: FC = () => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const isMobile = useMediaQuery('(max-width: 48em)')
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      amount: 0,
      description: '',
    },
    validate: {
      name: value => !value.trim() ? intl.formatMessage({ id: 'nameIsRequired' }) : null,
      amount: (value) => {
        if (!value)
          return intl.formatMessage({ id: 'amountIsRequired' })
        if (Number.isNaN(Number(value)))
          return intl.formatMessage({ id: 'amountMustBeANumber' })
        if (Number(value) <= 0)
          return intl.formatMessage({ id: 'amountMustBeGreaterThan0' })
        return null
      },
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const objectDebt: Debt = {
      id: uuidv4(),
      name: values.name,
      amount: Number(values.amount),
      description: values.description || '',
      createdTimestamp: date,
      updatedTimestamp: date,
    }

    await db.debts.add(objectDebt)
    form.reset()

    close()
  }

  const RenderAddButton = () => {
    if (isMobile) {
      return <Button className="mobileAddButton" onClick={open}><IconPlus /></Button>
    }
    else {
      return <Button onClick={open}>{intl.formatMessage({ id: 'addDebt' })}</Button>
    }
  }

  return (
    <>
      <RenderAddButton />

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'addDebt' })}>
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
            <Button type="submit">{intl.formatMessage({ id: 'addDebt' })}</Button>
            <Button variant="outline" onClick={close} type="button">{intl.formatMessage({ id: 'cancel' })}</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddDebt
