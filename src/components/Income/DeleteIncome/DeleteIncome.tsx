import type { FC } from 'react'
import type { Income } from '../../../db'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { db } from '../../../db'
import DeleteModal from '../../DeleteModal'

interface DeleteIncomeProps {
  income: Income
  onClose: () => void
}

const DeleteIncome: FC<DeleteIncomeProps> = ({ income, onClose }) => {
  const intl = useIntl()

  const handleDelete = async () => {
    if (!income)
      return console.error('Income not found')

    await db.income.delete(income.id)

    const date = dayjs().valueOf()

    if (income.accountId) {
      const account = await db.account.get({ id: income.accountId })
      if (account) {
        account.amount -= income.amount
        account.updatedTimestamp = date
        await db.account.put(account)
      }
    }

    onClose()
  }

  return (
    <DeleteModal
      title={intl.formatMessage({ id: 'deleteIncome' })}
      itemName={income.name}
      onDelete={handleDelete}
      warningMessage={intl.formatMessage({ id: 'associatedIncomeWarning' })}
    />
  )
}

export default DeleteIncome
