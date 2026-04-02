import type { selectorState } from '../../../utils/interfaces'
import { Button, Tooltip } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useIntl } from 'react-intl'

interface RenderAddButtonProps {
  isMobile?: boolean
  accountList: selectorState[]
  categoriesList: selectorState[]
  isLoading: boolean
  open: () => void
}

export function RenderAddButton({ isMobile, accountList, categoriesList, isLoading, open }: RenderAddButtonProps) {
  const intl = useIntl()

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
