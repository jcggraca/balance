import type { Income } from '@/db'
import type { selectorState } from '@/utils/interfaces'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, Select, Textarea, TextInput, Tooltip } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { type FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'

const AddIncome: FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

  const [accountList, setAccountList] = useState<selectorState[]>([])

  const form = useForm({
    initialValues: {
      name: '',
      amount: '',
      description: '',
      account: '',
      actionDate: null as Date | null,
    },
    validate: {
      name: value => !value ? intl.formatMessage({ id: 'nameIsRequired' }) : null,
      amount: value => !value ? intl.formatMessage({ id: 'amountIsRequired' }) : null,
      account: value => !value ? intl.formatMessage({ id: 'accountIsRequired' }) : null,
      actionDate: value => !value ? intl.formatMessage({ id: 'dateIsRequired' }) : null,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAccounts = await db.account.toArray()
        setAccountList(fetchedAccounts.map((item) => {
          return {
            value: item.id?.toString() || '',
            label: item.name,
          }
        }))
      }
      catch (error) {
        console.error('Error fetching:', error)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const account = await db.account.get({ id: values.account })
      if (!account) {
        throw new Error(`Account with ID ${values.account} not found.`)
      }

      const amount = Number(values.amount)
      const date = dayjs().valueOf()

      const income: Income = {
        id: uuidv4(),
        name: values.name,
        amount,
        accountId: values.account,
        description: values.description || null,
        actionTimestamp: dayjs(values.actionDate).valueOf(),
        createdTimestamp: date,
        updatedTimestamp: date,
      }

      await db.income.add(income)

      account.amount += amount
      account.updatedTimestamp = date
      await db.account.put(account)

      form.reset()
      close()
    }
    catch (error) {
      console.error('Error adding income:', error)
    }
  }

  const RenderAddButton = () => {
    if (isMobile) {
      if (accountList.length === 0) {
        return (
          <Tooltip opened label={intl.formatMessage({ id: 'oneAccountAddExpense' })}>
            <Button disabled className="mobileAddButton"><IconPlus /></Button>
          </Tooltip>
        )
      }
      return <Button className="mobileAddButton" onClick={open}><IconPlus /></Button>
    }
    else {
      if (accountList.length === 0) {
        return (
          <Tooltip label={intl.formatMessage({ id: 'oneAccountAddExpense' })}>
            <Button disabled>{intl.formatMessage({ id: 'addIncome' })}</Button>
          </Tooltip>
        )
      }
      return <Button onClick={open}>{intl.formatMessage({ id: 'addIncome' })}</Button>
    }
  }

  return (
    <>
      <RenderAddButton />

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'addIncome' })}>
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
            required
            mt="md"
            placeholder={intl.formatMessage({ id: 'enterAmount' })}
            {...form.getInputProps('amount')}
          />

          <Select
            label={intl.formatMessage({ id: 'account' })}
            placeholder={intl.formatMessage({ id: 'selectAccount' })}
            data={accountList}
            required
            mt="md"
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
            <Button type="submit">{intl.formatMessage({ id: 'addIncome' })}</Button>
            <Button variant="outline" onClick={close}>{intl.formatMessage({ id: 'cancel' })}</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddIncome
