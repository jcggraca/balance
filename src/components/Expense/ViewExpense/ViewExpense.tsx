import type { FC } from 'react'
import type { Expense } from '../../../db'
import type { selectorState } from '../../../utils/interfaces'
import { Button, Group, Modal, Table } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../../db'
import { useSettingsStore } from '../../../stores/useSettingsStore'
import { RATING } from '../../../utils/values'
import WarningNotFound from '../../WarningNotFound'
import DeleteExpense from '../DeleteExpense'
import UpdateExpense from '../UpdateExpense'

interface ViewExpenseProps {
  expense: Expense
  onClose: () => void
}

const ViewExpense: FC<ViewExpenseProps> = ({ expense, onClose }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [editMode, setEditMode] = useState(false)
  const [categoriesList, setCategoriesList] = useState<selectorState[]>([])
  const [accountList, setAccountList] = useState<selectorState[]>([])
  const [budgetList, setBudgetList] = useState<selectorState[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await db.categories.toArray()
        setCategoriesList(fetchedCategories.map((item) => {
          return {
            value: item.id?.toString() || '',
            label: item.name,
          }
        }))

        const fetchedAccounts = await db.account.toArray()
        setAccountList(fetchedAccounts.map((item) => {
          return {
            value: item.id?.toString() || '',
            label: item.name,
          }
        }))

        const fetchedBudget = await db.budget.toArray()
        setBudgetList(fetchedBudget.map((item) => {
          return {
            value: item.id?.toString() || '',
            label: item.name,
          }
        }))
      }
      catch (error) {
        console.error('ViewExpense Error fetching:', error)
      }
    }

    fetchData()

    return () => {
      setEditMode(false)
    }
  }, [])

  const getRatingName = (value: string) => {
    const findRating = RATING.find(o => o.value === value)
    if (findRating)
      return <span style={{ color: findRating.color }}>{intl.formatMessage({ id: findRating.label })}</span>
    return <WarningNotFound>{intl.formatMessage({ id: 'rating' })}</WarningNotFound>
  }

  const getCategoryName = (id: string) => {
    const findCategory = categoriesList?.find(o => o.value === id)
    if (findCategory)
      return findCategory.label
    return <WarningNotFound>{intl.formatMessage({ id: 'category' })}</WarningNotFound>
  }

  const getBudgetName = (id: string) => {
    if (!id)
      return 'N/A'
    const findBudget = budgetList?.find(o => o.value === id)
    if (findBudget)
      return findBudget.label
    return <WarningNotFound>{intl.formatMessage({ id: 'budget' })}</WarningNotFound>
  }

  const getAccountName = (id: string) => {
    const findAccount = accountList?.find(o => o.value === id)
    if (findAccount)
      return findAccount.label
    return <WarningNotFound>{intl.formatMessage({ id: 'account' })}</WarningNotFound>
  }

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'expenseDetails' })}>
      {editMode
        ? (
            <UpdateExpense onClose={onClose} expense={expense} />
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
                    <Table.Td>{expense.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'amount' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {currency}
                      {expense.amount}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'account' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {getAccountName(expense.accountId)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'category' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {getCategoryName(expense.category)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'rating' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {getRatingName(expense.rating)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'budget' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {getBudgetName(expense.budget)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'actionDate' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(expense.actionTimestamp).format('DD/MM/YYYY')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'createdAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(expense.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'updatedAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(expense.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'description' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {expense.description || 'N/A'}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Group mt="xl">
                <Button onClick={() => setEditMode(true)}>{intl.formatMessage({ id: 'edit' })}</Button>
                <DeleteExpense expense={expense} onClose={onClose} />
                <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'close' })}</Button>
              </Group>
            </>
          )}
    </Modal>
  )
}

export default ViewExpense
