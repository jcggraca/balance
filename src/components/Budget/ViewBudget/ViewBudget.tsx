import type { Budget } from '@/db'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconEye } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { type FC, useState } from 'react'
import classes from './ViewBudget.module.css'

interface ViewBudgetProps {
  budget: Budget
  icon?: boolean
}

const ViewBudget: FC<ViewBudgetProps> = ({ budget, icon = false }) => {
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

  const [editMode, setEditMode] = useState(false)

  const form = useForm({
    initialValues: {
      name: budget.name,
      description: budget.description,
      amount: budget.amount,
    },
    validate: {
      name: (value) => {
        if (!value)
          return 'Name is required'
        if (value.length < 3)
          return 'Name must be at least 3 characters'
        return null
      },
      description: (value) => {
        if (!value)
          return 'Description is required'
        if (value.length < 10)
          return 'Description must be at least 10 characters'
        return null
      },
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const data: Budget = {
      ...budget,
      name: values.name,
      description: values.description,
      amount: Number(values.amount),
      updatedTimestamp: date,
    }

    await db.budget.put(data)
    setEditMode(false)
    form.reset()
    close()
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" onClick={open}><IconEye /></Button>
        : <Button variant="light" onClick={open}>Details</Button>}

      <Modal centered opened={opened} onClose={close} title="View Budget">
        {editMode
          ? (
              <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                  label="Name"
                  {...form.getInputProps('name')}
                  required
                />

                <TextInput
                  label="Description"
                  {...form.getInputProps('description')}
                  required
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
                  <Button type="submit">Update</Button>
                  <Button onClick={() => {
                    setEditMode(false)
                    form.reset()
                  }}
                  >
                    Cancel
                  </Button>
                </Group>
              </form>
            )
          : (
              <>
                <ul>
                  <li>
                    <b>Name:</b>
                    {' '}
                    {budget.name}
                  </li>
                  <li>
                    <b>Description:</b>
                    {' '}
                    {budget.description}
                  </li>
                  <li>
                    <b>Amount:</b>
                    {' '}
                    {currency}
                    {budget.amount}
                  </li>
                  <li>
                    <b>Created at:</b>
                    {' '}
                    {dayjs(budget.createdTimestamp).format('YYYY-MM-DD HH:mm:ss')}
                  </li>
                  <li>
                    <b>Updated at:</b>
                    {' '}
                    {dayjs(budget.updatedTimestamp).format('YYYY-MM-DD HH:mm:ss')}
                  </li>
                </ul>

                <Group>
                  <Button onClick={() => setEditMode(true)}>Edit</Button>
                  <Button onClick={close}>Close</Button>
                </Group>
              </>
            )}
      </Modal>
    </>
  )
}

export default ViewBudget
