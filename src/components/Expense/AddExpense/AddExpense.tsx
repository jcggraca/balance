import type { selectorState } from '../../../utils/interfaces'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../../db'
import UpdateExpense from '../UpdateExpense'
import { RenderAddButton } from './RenderAddButton'

interface AddExpenseProps {
  isMobile?: boolean
}

export default function AddExpense({ isMobile }: AddExpenseProps) {
  const intl = useIntl()
  const [opened, { open, close }] = useDisclosure(false)

  const [categoriesList, setCategoriesList] = useState<selectorState[]>([])
  const [accountList, setAccountList] = useState<selectorState[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      }
      catch (error) {
        console.error('AddExpense Error fetching:', error)
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      setCategoriesList([])
      setAccountList([])
      setIsLoading(true)
    }
  }, [])

  return (
    <>
      <RenderAddButton isMobile={isMobile} accountList={accountList} categoriesList={categoriesList} isLoading={isLoading} open={open} />

      <Modal opened={opened} onClose={close} title={intl.formatMessage({ id: 'addExpense' })}>
        <UpdateExpense onClose={close} isCreating />
      </Modal>
    </>
  )
}
