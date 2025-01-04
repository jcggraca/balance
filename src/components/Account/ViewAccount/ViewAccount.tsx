import type { Account } from '@/db'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconEye } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { type FC, useState } from 'react'
import classes from './ViewAccount.module.css'

interface ViewAccountProps {
  account: Account
  icon?: boolean
}

const ViewAccount: FC<ViewAccountProps> = ({ account, icon = false }) => {
  const { currency } = useSettingsStore()
  const [opened, { open, close }] = useDisclosure(false)

  const [editMode, setEditMode] = useState(false)

  const form = useForm({
    initialValues: {
      name: account.name,
      description: account.description,
      amount: account.amount,
    },
    validate: {
      name: value => (!value ? 'Name is required' : null),
      amount: (value) => {
        if (value === undefined || value === null)
          return 'Amount is required'
        if (value < 0)
          return 'Amount must be positive'
        return null
      },
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const data: Account = {
      ...account,
      ...values,
      updatedTimestamp: date,
    }

    await db.account.put(data)
    close()
    setEditMode(false)
  }

  return (
    <>
      {icon
        ? <Button variant="transparent" onClick={open}><IconEye /></Button>
        : <Button variant="light" onClick={open}>Details</Button>}

      <Modal centered opened={opened} onClose={close} title="View Account">
        {editMode
          ? (
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
                  <Button type="submit">Update</Button>
                  <Button onClick={() => setEditMode(false)}>Cancel</Button>
                </Group>
              </form>
            )
          : (
              <>
                <ul>
                  <li>
                    <b>Name:</b>
                    {' '}
                    {account.name}
                  </li>
                  <li>
                    <b>Description:</b>
                    {' '}
                    {account.description}
                  </li>
                  <li>
                    <b>Amount:</b>
                    {' '}
                    {currency}
                    {account.amount}
                  </li>
                  <li>
                    <b>Created at:</b>
                    {' '}
                    {dayjs(account.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                  </li>
                  <li>
                    <b>Updated at:</b>
                    {' '}
                    {dayjs(account.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}
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

export default ViewAccount
