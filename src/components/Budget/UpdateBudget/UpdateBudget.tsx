import type { Budget } from '@/db'
import type { BudgetForm } from '@/utils/interfaces'
import type { FC } from 'react'
import { db } from '@/db'
import { amountSchema, descriptionSchema, nameSchema } from '@/schema/form'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, NumberInput, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

interface UpdateBudgetProps {
  onClose: () => void
  isCreating?: boolean
  budget?: Budget
}

const UpdateBudget: FC<UpdateBudgetProps> = ({ onClose, budget, isCreating = false }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const schema = z.object({
    name: nameSchema(intl),
    description: descriptionSchema(intl),
    amount: amountSchema(intl),
  })

  const form = useForm<BudgetForm>({
    initialValues: {
      name: budget?.name || '',
      amount: budget?.amount || 0,
      description: budget?.description || '',
    },
    validate: zodResolver(schema),
  })

  const handleSubmit = async (values: BudgetForm) => {
    try {
      const date = dayjs().valueOf()

      if (isCreating) {
        const dataNew: Budget = {
          id: uuidv4(),
          name: values.name.trim(),
          description: values.description?.trim(),
          amount: Number(values.amount),
          createdTimestamp: date,
          updatedTimestamp: date,
        }
        await db.budget.add(dataNew)
      }
      else {
        if (!budget?.id) {
          throw new Error('Budget ID is missing')
        }

        const dataUpdate: Budget = {
          ...budget,
          name: values.name.trim(),
          description: values.description?.trim(),
          amount: Number(values.amount),
          updatedTimestamp: date,
        }
        await db.budget.put(dataUpdate)
      }

      notifications.show({
        title: intl.formatMessage({ id: 'success' }),
        message: intl.formatMessage({ id: isCreating ? 'budgetAddedSuccessfully' : 'budgetUpdatedSuccessfully' }),
        color: 'green',
      })

      form.reset()
      onClose()
    }
    catch (error) {
      notifications.show({
        title: intl.formatMessage({ id: 'error' }),
        message: error instanceof Error ? error.message : intl.formatMessage({ id: 'anErrorOccurred' }),
        color: 'red',
      })
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
        <Button type="submit">{intl.formatMessage({ id: 'addAccount' })}</Button>
        <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'cancel' })}</Button>
      </Group>
    </form>
  )
}

export default UpdateBudget