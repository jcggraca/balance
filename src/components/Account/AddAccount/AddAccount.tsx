import type { FC } from 'react'
import { type Account, db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import classes from './AddAccount.module.css'

const AddAccount: FC = () => {
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      amount: '',
      description: '',
    },
    validate: {
      name: value => (!value ? 'Name is required' : null),
      amount: (value) => {
        if (!value)
          return 'Amount is required'
        if (Number.isNaN(Number(value)))
          return 'Amount must be a number'
        return null
      },
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const account: Account = {
      id: uuidv4(),
      name: values.name,
      amount: Number(values.amount),
      description: values.description,
      createdTimestamp: date,
      updatedTimestamp: date,
    }

    await db.account.add(account)
    form.reset()
    close()
  }

  return (
    <>
      <Button onClick={open}>Add account</Button>

      <Modal opened={opened} onClose={close} title="Add Account">
        <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            required
            {...form.getInputProps('name')}
          />

          <NumberInput
            label="Amount"
            prefix={currency}
            hideControls
            decimalScale={2}
            required
            {...form.getInputProps('amount')}
          />

          <TextInput
            label="Description"
            {...form.getInputProps('description')}
          />

          <Group>
            <Button type="submit">Add Account</Button>
            <Button onClick={close}>Cancel</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddAccount
