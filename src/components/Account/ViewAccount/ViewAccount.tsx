import type { Account } from '@/db'
import type { FC } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Group, Modal, Table } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import DeleteAccount from '../DeleteAccount'
import UpdateAccount from '../UpdateAccount'

interface ViewAccountProps {
  account: Account
  onClose: () => void
}

const ViewAccount: FC<ViewAccountProps> = ({ account, onClose }) => {
  const intl = useIntl()
  const { currency } = useSettingsStore()

  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    return () => {
      setEditMode(false)
    }
  }, [])

  return (
    <Modal centered opened onClose={onClose} title={intl.formatMessage({ id: 'viewAccount' })}>
      {editMode
        ? (
            <UpdateAccount account={account} onClose={onClose} />
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
                    <Table.Td>{account.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'amount' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {currency}
                      {account.amount}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'createdAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(account.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'updatedAt' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      {dayjs(account.updatedTimestamp).format('DD/MM/YYYY HH:mm:ss')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th w={100}>
                      {intl.formatMessage({ id: 'description' })}
                      :
                    </Table.Th>
                    <Table.Td>
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {account.description || 'N/A'}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Group mt="xl">
                <Button onClick={() => setEditMode(true)}>{intl.formatMessage({ id: 'edit' })}</Button>
                <DeleteAccount account={account} onClose={onClose} />
                <Button variant="outline" onClick={onClose}>{intl.formatMessage({ id: 'close' })}</Button>
              </Group>
            </>
          )}
    </Modal>
  )
}

export default ViewAccount
