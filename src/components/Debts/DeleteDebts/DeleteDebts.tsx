import type { FC } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { db, type Debts } from '@/db'
import { useIntl } from 'react-intl'

interface DeleteDebtsProps {
  debt: Debts
  onClose: () => void
}

const DeleteDebts: FC<DeleteDebtsProps> = ({ debt, onClose }) => {
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

export default DeleteDebts
