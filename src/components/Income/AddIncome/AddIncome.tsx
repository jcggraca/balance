import type { FC } from 'react'
import type { selectorState } from '../../../utils/interfaces'
import { Button, Modal, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../../db'
import UpdateIncome from '../UpdateIncome'

const AddIncome: FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const intl = useIntl()
  const [opened, { open, close }] = useDisclosure(false)

  const [accountList, setAccountList] = useState<selectorState[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        console.error('AddIncome Error fetching:', error)
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      setAccountList([])
      setIsLoading(true)
    }
  }, [])

  const RenderAddButton = () => {
    if (isMobile) {
      if (accountList.length === 0 && !isLoading) {
        return (
          <Tooltip opened label={intl.formatMessage({ id: 'oneAccountAddExpense' })}>
            <Button disabled className="mobileAddButton"><IconPlus /></Button>
          </Tooltip>
        )
      }
      return <Button className="mobileAddButton" onClick={open}><IconPlus /></Button>
    }
    else {
      if (accountList.length === 0 && !isLoading) {
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
        <UpdateIncome accountList={accountList} onClose={close} isCreating />
      </Modal>
    </>
  )
}

export default AddIncome
