import type { FC } from 'react'
import type { selectorState } from '../../../utils/interfaces'
import { Button, Modal, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../../db'
import UpdateExpense from '../UpdateExpense'

const AddExpense: FC<{ isMobile?: boolean }> = ({ isMobile }) => {
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
        console.error('Error fetching:', error)
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

  const RenderAddButton = () => {
    if (isMobile) {
      if ((accountList.length === 0 || categoriesList.length === 0) && !isLoading) {
        return (
          <Tooltip
            opened
            label={intl.formatMessage({
              id: accountList.length === 0 ? 'oneAccountAddExpense' : 'oneCategoryAddExpense',
            })}
          >
            <Button disabled className="mobileAddButton"><IconPlus /></Button>
          </Tooltip>
        )
      }
      return <Button className="mobileAddButton" onClick={open}><IconPlus /></Button>
    }
    else {
      if ((accountList.length === 0 || categoriesList.length === 0) && !isLoading) {
        return (
          <Tooltip
            label={intl.formatMessage({
              id: accountList.length === 0 ? 'oneAccountAddExpense' : 'oneCategoryAddExpense',
            })}
          >
            <Button disabled>{intl.formatMessage({ id: 'addExpense' })}</Button>
          </Tooltip>
        )
      }
      return <Button onClick={open}>{intl.formatMessage({ id: 'addExpense' })}</Button>
    }
  }

  return (
    <>
      <RenderAddButton />

      <Modal opened={opened} onClose={close} title={intl.formatMessage({ id: 'addExpense' })}>
        <UpdateExpense onClose={close} isCreating />
      </Modal>
    </>
  )
}

export default AddExpense
