import type { FC } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { type Account, db } from '@/db'
import { useIntl } from 'react-intl'

interface DeleteAccountProps {
  account: Account
  onClose: () => void
}

const DeleteAccount: FC<DeleteAccountProps> = ({ account, onClose }) => {
  const intl = useIntl()

  const handleDelete = async () => {
    if (!account)
      return console.error('Account not found')

    await db.account.delete(account.id)
    onClose()
  }

  return (
    <DeleteModal
      title={intl.formatMessage({ id: 'deleteAccount' })}
      itemName={account.name}
      onDelete={handleDelete}
      warningMessage={intl.formatMessage({
        id: 'everythingAssociateToThisAccountWillLoseTheTargetAccount',
      })}
    />
  )
}

export default DeleteAccount
