import type { FC } from 'react'
import type { Account } from '../../../db'
import type { AccountForm } from '../../../utils/interfaces'
import { Button, Group, NumberInput, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { db } from '../../../db'
import { amountAccountSchema, descriptionSchema, nameSchema } from '../../../schema/form'
import { useSettingsStore } from '../../../stores/useSettingsStore'
import { displayNotification } from '../../../utils/form'

interface UpdateAccountProps {
  onClose: () => void
  isCreating?: boolean
  account?: Account
}

const UpdateAccount: FC<UpdateAccountProps> = ({ onClose, account, isCreating = false }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const schema = z.object({
    name: nameSchema(intl),
    description: descriptionSchema(intl),
    amount: amountAccountSchema(intl),
  })

  const form = useForm<AccountForm>({
    initialValues: {
      name: account?.name || '',
      amount: account?.amount || 0,
      description: account?.description || '',
    },
    validate: zodResolver(schema),
  })

  const handleSubmit = async (values: AccountForm) => {
    try {
      const date = dayjs().valueOf()
      const amount = Number.parseFloat((values.amount).toFixed(2))

      if (isCreating) {
        const dataNew: Account = {
          id: uuidv4(),
          name: values.name.trim(),
          description: values.description?.trim(),
          amount,
          createdTimestamp: date,
          updatedTimestamp: date,
        }
        await db.account.add(dataNew)
      }
      else {
        if (!account?.id) {
          throw new Error('missingAccountID')
        }

        const dataUpdate: Account = {
          ...account,
          name: values.name.trim(),
          description: values.description?.trim(),
          amount,
          updatedTimestamp: date,
        }
        await db.account.put(dataUpdate)
      }

      const title = isCreating ? 'accountAddedSuccessfully' : 'accountUpdatedSuccessfully'
      displayNotification(intl, 'success', title, 'green')
    }
    catch (error) {
      const title = intl.formatMessage({ id: 'anErrorOccurred' })
      console.error('UpdateAccount handleSubmit:', error)
      displayNotification(intl, 'error', title, 'red')
    }
    finally {
      form.reset()
      onClose()
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
        <Button type="submit">{intl.formatMessage({ id: isCreating ? 'addAccount' : 'updateAccount' })}</Button>
        <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'cancel' })}</Button>
      </Group>
    </form>
  )
}

export default UpdateAccount
