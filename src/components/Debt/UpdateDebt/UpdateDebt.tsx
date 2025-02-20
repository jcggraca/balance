import type { FC } from 'react'
import type { Debt } from '../../../db'
import type { DebtForm } from '../../../utils/interfaces'
import { Button, Group, NumberInput, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { db } from '../../../db'
import { amountSchema, descriptionSchema, nameSchema } from '../../../schema/form'
import { useSettingsStore } from '../../../stores/useSettingsStore'
import { displayNotification } from '../../../utils/form'

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
      const amount = Number.parseFloat(values.amount.toFixed(2))

      if (isCreating) {
        const dataNew: Debt = {
          id: uuidv4(),
          name: values.name.trim(),
          description: values.description?.trim(),
          amount,
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
          amount,
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
      const title = intl.formatMessage({ id: 'anErrorOccurred' })
      console.error('UpdateDebt handleSubmit:', error)
      displayNotification(intl, 'error', title, 'red')
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label={intl.formatMessage({ id: 'name' })}
        placeholder={intl.formatMessage({ id: 'enterName' })}
        required
        mt="md"
        data-autofocus
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
        <Button type="submit">{intl.formatMessage({ id: isCreating ? 'addDebt' : 'updateDebt' })}</Button>
        <Button variant="outline" onClick={onClose} type="button">{intl.formatMessage({ id: 'cancel' })}</Button>
      </Group>
    </form>
  )
}

export default UpdateDebt
