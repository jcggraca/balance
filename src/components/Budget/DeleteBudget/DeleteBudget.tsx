import type { FC } from 'react'
import type { Budget } from '../../../db'
import { useIntl } from 'react-intl'
import { db } from '../../../db'
import DeleteModal from '../../DeleteModal'

interface DeleteBudgetProps {
  budget: Budget
  onClose: () => void
}

const DeleteBudget: FC<DeleteBudgetProps> = ({ budget, onClose }) => {
  const intl = useIntl()

  const handleDelete = async () => {
    if (!budget)
      return console.error('Budget not found')

    await db.budget.delete(budget.id)
    onClose()
  }

  return (
    <DeleteModal
      title={intl.formatMessage({ id: 'deleteBudget' })}
      itemName={budget.name}
      onDelete={handleDelete}
      warningMessage={intl.formatMessage({
        id: 'associatedBudgetWarning',
      })}
    />
  )
}

export default DeleteBudget
