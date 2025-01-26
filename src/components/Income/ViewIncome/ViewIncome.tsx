import type { FC } from 'react'
import type { Income } from '../../../db'
import type { selectorState } from '../../../utils/interfaces'
import { Button, Group, Modal, Table } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../../db'
import { useSettingsStore } from '../../../stores/useSettingsStore'
import WarningNotFound from '../../WarningNotFound'
import DeleteIncome from '../DeleteIncome'
import UpdateIncome from '../UpdateIncome'

interface ViewIncomeProps {
  income: Income
  onClose: () => void
}

const ViewIncome: FC<ViewIncomeProps> = ({ income, onClose }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [editMode, setEditMode] = useState(false)
  const [accountList, setAccountList] = useState<selectorState[]>([])

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

  const getAccountName = (id: string) => {
    const findAccount = accountList?.find(o => o.value === id)
    if (findAccount)
      return findAccount.label
    return <WarningNotFound>{intl.formatMessage({ id: 'account' })}</WarningNotFound>
  }

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'viewIncome' })}>
      {editMode
        ? (
            <UpdateIncome accountList={accountList} onClose={onClose} income={income} />
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
                    <Table.Td>{income.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'amount' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {currency}
                      {income.amount}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'account' })}
                      :
                    </Table.Th>
                    <Table.Td>{getAccountName(income.accountId)}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'actionDate' })}
                      :
                    </Table.Th>
                    <Table.Td>{dayjs(income.actionTimestamp).format('DD/MM/YYYY')}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'createdAt' })}
                      :
                    </Table.Th>
                    <Table.Td>{dayjs(income.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'updatedAt' })}
                      :
                    </Table.Th>
                    <Table.Td>{dayjs(income.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'description' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {income.description || 'N/A'}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Group mt="xl">
                <Button onClick={() => setEditMode(true)}>{intl.formatMessage({ id: 'edit' })}</Button>
                <DeleteIncome onClose={onClose} income={income} />
                <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'close' })}</Button>
              </Group>
            </>
          )}
    </Modal>
  )
}

export default ViewIncome
