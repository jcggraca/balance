import type { Debt } from '@/db'
import type { DebtForm } from '@/utils/interfaces'
import type { FC } from 'react'
import { db } from '@/db'
import { amountSchema, descriptionSchema, nameSchema } from '@/schema/form'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { displayNotification } from '@/utils/form'
import { Button, Group, NumberInput, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

interface UpdateDebtProps {
  onClose: () => void
  isCreating?: boolean
  debt?: Debt
}

const UpdateDebt: FC<UpdateDebtProps> = ({ onClose, debt, isCreating = false }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const schema = z.object({
    name: nameSchema(intl),
    description: descriptionSchema(intl),
    amount: amountSchema(intl),
  })

  const form = useForm<DebtForm>({
    initialValues: {
      name: debt?.name || '',
      amount: debt?.amount || 0,
      description: debt?.description || '',
    },
    validate: zodResolver(schema),
  })

  const handleSubmit = async (values: DebtForm) => {
    try {
      const date = dayjs().valueOf()

      if (isCreating) {
        const dataNew: Debt = {
          id: uuidv4(),
          name: values.name.trim(),
          description: values.description?.trim(),
          amount: Number(values.amount),
          createdTimestamp: date,
          updatedTimestamp: date,
        }
        await db.debts.add(dataNew)
      }
      else {
        if (!debt?.id) {
          throw new Error('missingDebtsID')
        }

        const dataUpdate: Debt = {
          ...debt,
          name: values.name.trim(),
          description: values.description?.trim(),
          amount: Number(values.amount),
          updatedTimestamp: date,
        }
        await db.debts.put(dataUpdate)
      }

      const message = isCreating ? 'debtAddedSuccessfully' : 'debtUpdatedSuccessfully'
      displayNotification(intl, 'success', message, 'green')

      form.reset()
      onClose()
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'anErrorOccurred'
      displayNotification(intl, 'error', message, 'red')
    }
  }

  return (
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
        <Button variant="outline" onClick={onClose} type="button">{intl.formatMessage({ id: 'cancel' })}</Button>
      </Group>
    </form>
  )
}

export default UpdateDebt
