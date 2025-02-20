import type { FC } from 'react'
import type { Income } from '../../../db'
import type { IncomeForm, selectorState } from '../../../utils/interfaces'
import { Button, Group, NumberInput, Select, Textarea, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { db } from '../../../db'
import { accountSchema, actionDateSchema, amountSchema, descriptionSchema, nameSchema } from '../../../schema/form'
import { useSettingsStore } from '../../../stores/useSettingsStore'
import { displayNotification } from '../../../utils/form'

interface UpdateIncomeProps {
  onClose: () => void
  accountList: selectorState[]
  isCreating?: boolean
  income?: Income
}

const UpdateIncome: FC<UpdateIncomeProps> = ({ onClose, accountList, income, isCreating = false }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const schema = z.object({
    name: nameSchema(intl),
    description: descriptionSchema(intl),
    amount: amountSchema(intl),
    actionDate: actionDateSchema(intl),
    account: accountSchema(intl),
  })

  const form = useForm<IncomeForm>({
    initialValues: {
      name: income?.name || '',
      amount: income?.amount || 0,
      description: income?.description || '',
      account: income?.accountId || '',
      actionDate: income?.actionTimestamp ? new Date(income.actionTimestamp) : new Date(),
    },
    validate: zodResolver(schema),
  })

  const handleSubmit = async (values: IncomeForm) => {
    try {
      const account = await db.account.get({ id: values.account })
      if (!account) {
        throw new Error('missingAccountID')
      }

      const amount = Number.parseFloat(values.amount.toFixed(2))
      const date = dayjs().valueOf()

      if (isCreating) {
        const dataNew: Income = {
          id: uuidv4(),
          name: values.name.trim(),
          amount,
          accountId: values.account,
          description: values.description?.trim(),
          actionTimestamp: dayjs(values.actionDate).valueOf(),
          createdTimestamp: date,
          updatedTimestamp: date,
        }
        await db.income.add(dataNew)

        account.amount += amount
        account.updatedTimestamp = date
        await db.account.put(account)
      }
      else {
        if (!income?.id) {
          throw new Error('missingIncomeID')
        }

        const dataUpdate: Income = {
          ...income,
          name: values.name.trim(),
          accountId: values.account,
          description: values.description.trim(),
          amount,
          actionTimestamp: dayjs(values.actionDate).valueOf(),
          updatedTimestamp: date,
        }
        await db.income.put(dataUpdate)

        if (income.accountId === values.account && income.amount !== amount) {
          const amountDiff = values.amount - income.amount
          account.amount += +amountDiff
          account.updatedTimestamp = date
          await db.account.put(account)
        }
        else if (income.accountId !== values.account) {
          const oldAccount = await db.account.get({ id: income.accountId })
          if (oldAccount) {
            oldAccount.amount -= income.amount
            oldAccount.updatedTimestamp = date
            await db.account.put(oldAccount)
          }

          account.amount += amount
          account.updatedTimestamp = date
          await db.account.put(account)
        }
      }

      const message = isCreating ? 'incomeAddedSuccessfully' : 'incomeUpdatedSuccessfully'
      displayNotification(intl, 'success', message, 'green')

      form.reset()
      onClose()
    }
    catch (error) {
      const message = isCreating ? 'failedCreatingIncome' : 'failedUpdatingIncome'
      console.error(message, error)
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
        data-autofocus
        {...form.getInputProps('name')}
      />

      <NumberInput
        label={intl.formatMessage({ id: 'amount' })}
        prefix={currency}
        decimalScale={2}
        hideControls
        placeholder={intl.formatMessage({ id: 'enterAmount' })}
        required
        mt="md"
        {...form.getInputProps('amount')}
      />

      <Select
        label={intl.formatMessage({ id: 'account' })}
        placeholder={intl.formatMessage({ id: 'selectAccount' })}
        data={accountList}
        required
        mt="md"
        allowDeselect={false}
        {...form.getInputProps('account')}
      />

      <DatePickerInput
        label={intl.formatMessage({ id: 'actionDate' })}
        placeholder={intl.formatMessage({ id: 'selectActionDate' })}
        required
        mt="md"
        {...form.getInputProps('actionDate')}
      />

      <Textarea
        label={intl.formatMessage({ id: 'description' })}
        mt="md"
        placeholder={intl.formatMessage({ id: 'enterDescription' })}
        {...form.getInputProps('description')}
      />

      <Group mt="xl">
        <Button type="submit">{intl.formatMessage({ id: isCreating ? 'addIncome' : 'updateIncome' })}</Button>
        <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'cancel' })}</Button>
      </Group>
    </form>
  )
}

export default UpdateIncome
