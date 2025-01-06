import type { FC } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useIntl } from 'react-intl'
import classes from './WarningNotFound.module.css'

interface WarningNotFoundProps {
  children: React.ReactNode
}

const WarningNotFound: FC<WarningNotFoundProps> = ({ children }) => {
  const intl = useIntl()

  return (
    <span className={classes.warning}>
      <IconAlertTriangle />
      {' '}
      {children}
      {' '}
      {intl.formatMessage({ id: 'notFound' })}
    </span>
  )
}

export default WarningNotFound
