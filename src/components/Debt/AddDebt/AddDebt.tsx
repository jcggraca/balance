import type { FC } from 'react'
import { Button, Modal } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useIntl } from 'react-intl'
import UpdateDebt from '../UpdateDebt'

const AddDebt: FC = () => {
  const intl = useIntl()
  const isMobile = useMediaQuery('(max-width: 48em)')
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      {isMobile
        ? <Button className="mobileAddButton" onClick={open}><IconPlus /></Button>
        : <Button onClick={open}>{intl.formatMessage({ id: 'addDebt' })}</Button>}

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'addDebt' })}>
        <UpdateDebt onClose={close} isCreating />
      </Modal>
    </>
  )
}

export default AddDebt