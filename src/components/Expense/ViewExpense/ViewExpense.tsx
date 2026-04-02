import type { Expense } from '../../../db'
import type { selectorState } from '../../../utils/interfaces'
import { Button, Group, Modal, Table } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useReducer } from 'react'
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

interface State {
  editMode: boolean
  categoriesList: selectorState[]
  accountList: selectorState[]
  budgetList: selectorState[]
}

type Action
  = | { type: 'SET_DATA', payload: Partial<Omit<State, 'editMode'>> }
    | { type: 'SET_EDIT', payload: boolean }
    | { type: 'RESET_EDIT' }

const initialState: State = {
  editMode: false,
  categoriesList: [],
  accountList: [],
  budgetList: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload }
    case 'SET_EDIT':
      return { ...state, editMode: action.payload }
    case 'RESET_EDIT':
      return { ...state, editMode: false }
    default:
      return state
  }
}

export default function ViewExpense({ expense, onClose }: ViewExpenseProps) {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [state, dispatch] = useReducer(reducer, initialState)
  const { editMode, categoriesList, accountList, budgetList } = state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedAccounts, fetchedBudget]
          = await Promise.all([
            db.categories.toArray(),
            db.account.toArray(),
            db.budget.toArray(),
          ])

        dispatch({
          type: 'SET_DATA',
          payload: {
            categoriesList: fetchedCategories.map(item => ({
              value: item.id?.toString() || '',
              label: item.name,
            })),
            accountList: fetchedAccounts.map(item => ({
              value: item.id?.toString() || '',
              label: item.name,
            })),
            budgetList: fetchedBudget.map(item => ({
              value: item.id?.toString() || '',
              label: item.name,
            })),
          },
        })
      }
      catch (error) {
        console.error('ViewExpense Error fetching:', error)
      }
    }

    fetchData()

    return () => {
      dispatch({ type: 'RESET_EDIT' })
    }
  }, [])

  const getRatingName = (value: string) => {
    const findRating = RATING.find(o => o.value === value)
    if (findRating) {
      return (
        <span style={{ color: findRating.color }}>
          {intl.formatMessage({ id: findRating.label })}
        </span>
      )
    }
    return (
      <WarningNotFound>{intl.formatMessage({ id: 'rating' })}</WarningNotFound>
    )
  }

  const getCategoryName = (id: string) => {
    const findCategory = categoriesList?.find(o => o.value === id)
    if (findCategory)
      return findCategory.label
    return (
      <WarningNotFound>{intl.formatMessage({ id: 'category' })}</WarningNotFound>
    )
  }

  const getBudgetName = (id: string) => {
    if (!id)
      return 'N/A'
    const findBudget = budgetList?.find(o => o.value === id)
    if (findBudget)
      return findBudget.label
    return (
      <WarningNotFound>{intl.formatMessage({ id: 'budget' })}</WarningNotFound>
    )
  }

  const getAccountName = (id: string) => {
    const findAccount = accountList?.find(o => o.value === id)
    if (findAccount)
      return findAccount.label
    return (
      <WarningNotFound>{intl.formatMessage({ id: 'account' })}</WarningNotFound>
    )
  }

  return (
    <Modal
      centered
      opened
      onClose={onClose}
      title={intl.formatMessage({ id: 'expenseDetails' })}
    >
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
                    <Table.Td>{getAccountName(expense.accountId)}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'category' })}
                      :
                    </Table.Th>
                    <Table.Td>{getCategoryName(expense.category)}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'rating' })}
                      :
                    </Table.Th>
                    <Table.Td>{getRatingName(expense.rating)}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'budget' })}
                      :
                    </Table.Th>
                    <Table.Td>{getBudgetName(expense.budget)}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'actionDate' })}
                      :
                    </Table.Th>
                    <Table.Td>{dayjs(expense.actionTimestamp).format('DD/MM/YYYY')}</Table.Td>
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
                <Button onClick={() => dispatch({ type: 'SET_EDIT', payload: true })}>
                  {intl.formatMessage({ id: 'edit' })}
                </Button>
                <DeleteExpense expense={expense} onClose={onClose} />
                <Button variant="outline" onClick={onClose}>
                  {intl.formatMessage({ id: 'close' })}
                </Button>
              </Group>
            </>
          )}
    </Modal>
  )
}
