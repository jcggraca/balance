import type { Debt } from '@/db'
import type { FC } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { db } from '@/db'
import { useIntl } from 'react-intl'

interface DeleteDebtProps {
  debt: Debt
  onClose: () => void
}

const DeleteDebt: FC<DeleteDebtProps> = ({ debt, onClose }) => {
  const intl = useIntl()

  const handleDelete = async () => {
    if (!debt)
      return console.error('Budget not found')

    await db.debts.delete(debt.id)
    onClose()
  }

  return (
    <DeleteModal
      title={intl.formatMessage({ id: 'deleteDebt' })}
      itemName={debt.name}
      onDelete={handleDelete}
    />
  )
}

export default DeleteDebt
