import type { Budget } from '@/db'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, NumberInput, Table, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import { type FC, useState } from 'react'
import { useIntl } from 'react-intl'
import DeleteBudget from '../DeleteBudget'

interface ViewBudgetProps {
  budget: Budget
  onClose: () => void
}

const ViewBudget: FC<ViewBudgetProps> = ({ budget, onClose }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

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
          return intl.formatMessage({ id: 'nameIsRequired' })
        if (value.length < 3)
          return intl.formatMessage({ id: 'nameMustBeAtLeast3Characters' })
        return null
      },
      description: (value) => {
        if (!value)
          return intl.formatMessage({ id: 'descriptionIsRequired' })
        if (value.length < 10)
          return intl.formatMessage({ id: 'descriptionMustBeAtLeast10Characters' })
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
    onClose()
  }

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'viewBudget' })}>
      {editMode
        ? (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label={intl.formatMessage({ id: 'name' })}
                placeholder={intl.formatMessage({ id: 'enterName' })}
                {...form.getInputProps('name')}
                required
                mt="md"
              />

              <NumberInput
                label={intl.formatMessage({ id: 'amount' })}
                prefix={currency}
                hideControls
                decimalScale={2}
                placeholder={intl.formatMessage({ id: 'enterAmount' })}
                required
                {...form.getInputProps('amount')}
                mt="md"
              />

              <Textarea
                label={intl.formatMessage({ id: 'description' })}
                placeholder={intl.formatMessage({ id: 'enterDescription' })}
                {...form.getInputProps('description')}
                required
                mt="md"
              />

              <Group mt="xl">
                <Button type="submit">{intl.formatMessage({ id: 'update' })}</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false)
                    form.reset()
                  }}
                >
                  {intl.formatMessage({ id: 'cancel' })}
                </Button>
              </Group>
            </form>
          )
        : (
            <>
              <Table variant="vertical" layout="fixed" withTableBorder>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'name' })}
                      :
                    </Table.Th>
                    <Table.Td>{budget.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'amount' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {currency}
                      {budget.amount}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'createdAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(budget.createdTimestamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'updatedAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(budget.updatedTimestamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'description' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {budget.description || 'N/A'}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Group mt="xl">
                <Button onClick={() => setEditMode(true)}>{intl.formatMessage({ id: 'edit' })}</Button>
                <DeleteBudget budget={budget} onClose={onClose} />
                <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'close' })}</Button>
              </Group>
            </>
          )}
    </Modal>
  )
}

export default ViewBudget
