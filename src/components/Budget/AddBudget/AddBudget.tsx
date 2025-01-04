import type { Budget } from '@/db'
import type { FC } from 'react'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import classes from './AddBudget.module.css'

const AddBudget: FC = () => {
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      amount: '',
    },
    validate: {
      name: value => (!value ? 'Name is required' : null),
      amount: (value) => {
        if (!value)
          return 'Amount is required'
        if (Number.isNaN(Number(value)))
          return 'Amount must be a number'
        if (Number(value) <= 0)
          return 'Amount must be greater than 0'
        return null
      },
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const budget: Budget = {
      id: uuidv4(),
      name: values.name,
      amount: Number(values.amount),
      description: values.description || '',
      createdTimestamp: date,
      updatedTimestamp: date,
    }

    await db.budget.add(budget)
    form.reset()

    close()
  }

  return (
    <>
      <Button onClick={open}>Add Budget</Button>

      <Modal opened={opened} onClose={close} title="Add Budget">
        <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            required
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Description"
            {...form.getInputProps('description')}
          />

          <NumberInput
            label="Amount"
            prefix={currency}
            hideControls
            decimalScale={2}
            required
            {...form.getInputProps('amount')}
          />

          <Group>
            <Button type="submit">Add Budget</Button>
            <Button onClick={close} type="button">Cancel</Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddBudget
