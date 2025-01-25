import type { Category } from '@/db'
import type { FC } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { db } from '@/db'
import { useIntl } from 'react-intl'

interface DeleteCategoryProps {
  category: Category
  onClose: () => void
}

const DeleteCategory: FC<DeleteCategoryProps> = ({ category, onClose }) => {
  const intl = useIntl()

  const handleDelete = async () => {
    if (!category)
      return console.error('Tag not found')

    await db.categories.delete(category.id)
    onClose()
  }

  return (
    <DeleteModal
      title={intl.formatMessage({ id: 'deleteCategory' })}
      itemName={category.name}
      onDelete={handleDelete}
      warningMessage={intl.formatMessage({
        id: 'associatedCategoryWarning',
      })}
    />
  )
}

export default DeleteCategory
