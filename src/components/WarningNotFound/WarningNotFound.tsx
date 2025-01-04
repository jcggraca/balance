import type { FC } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import classes from './WarningNotFound.module.css'

interface WarningNotFoundProps {
  children: React.ReactNode
}

const WarningNotFound: FC<WarningNotFoundProps> = ({ children }) => {
  return (
    <span className={classes.warning}>
      <IconAlertTriangle />
      {' '}
      {children}
      {' '}
      not found!
    </span>
  )
}

export default WarningNotFound
