import type { selectorState } from '../../../utils/interfaces'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../../db'
import UpdateIncome from '../UpdateIncome'
import RenderAddButton from './RenderAddButton'

interface AddIncomeProps {
  isMobile?: boolean
}

export default function AddIncome({ isMobile }: AddIncomeProps) {
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

  return (
    <>
      <RenderAddButton isMobile={isMobile} accountList={accountList} isLoading={isLoading} open={open} />

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'addIncome' })}>
        <UpdateIncome accountList={accountList} onClose={close} isCreating />
      </Modal>
    </>
  )
}
