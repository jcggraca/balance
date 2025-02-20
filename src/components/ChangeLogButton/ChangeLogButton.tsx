import type { FC } from 'react'
import { Tooltip, UnstyledButton } from '@mantine/core'
import { IconHistory } from '@tabler/icons-react'
import { useAlertsStore } from '../../stores/useAlertsStore'
import classes from './ChangeLogButton.module.css'

interface ChangeLogButtonProps {
  isMobile: boolean
}

const ChangeLogButton: FC<ChangeLogButtonProps> = ({ isMobile }) => {
  const { setShowChangelog } = useAlertsStore()

  if (isMobile) {
    return (
      <UnstyledButton
        className={classes.buttonMobile}
        onClick={() => setShowChangelog(true)}
        aria-label="Changelog"
      >
        <IconHistory className={classes.buttonMobileIcon} />
        <span>Changelog</span>
      </UnstyledButton>
    )
  }

  return (
    <Tooltip
      label="Changelog"
      position="right"
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        className={classes.button}
        onClick={() => setShowChangelog(true)}
        aria-label="Changelog"
      >
        <IconHistory />
      </UnstyledButton>
    </Tooltip>
  )
}

export default ChangeLogButton
