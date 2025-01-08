import type { FC } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { db, type Types } from '@/db'
import { useIntl } from 'react-intl'

interface DeleteTypesProps {
  type: Types
  onClose: () => void
}

const DeleteTypes: FC<DeleteTypesProps> = ({ type, onClose }) => {
  const intl = useIntl()

  const handleDelete = async () => {
    if (!type)
      return console.error('Type not found')

    await db.types.delete(type.id)
    onClose()
  }

  return (
    <DeleteModal
      title={intl.formatMessage({ id: 'deleteType' })}
      itemName={type.name}
      onDelete={handleDelete}
      warningMessage={intl.formatMessage({
        id: 'everythingAssociatedWithThisTypeWillLoseItsTargetType',
      })}
    />
  )
}

export default DeleteTypes
