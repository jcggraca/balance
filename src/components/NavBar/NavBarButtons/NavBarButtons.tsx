import type { IconHome2 } from '@tabler/icons-react'
import type { FC } from 'react'
import { Tooltip, UnstyledButton } from '@mantine/core'
import { useIntl } from 'react-intl'
import classes from './NavBarButtons.module.css'

interface NavBarButtonsProps {
  label: string
  icon: typeof IconHome2
  isMobile?: boolean
}

const NavBarButtons: FC<NavBarButtonsProps> = ({ label, icon: Icon, isMobile, ...props }) => {
  const intl = useIntl()

  return isMobile
    ? (
        <UnstyledButton
          className={classes.buttonMobile}
          aria-label={intl.formatMessage({ id: label })}
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          <Icon className={classes.buttonMobileIcon} />
          <span>{intl.formatMessage({ id: label })}</span>
        </UnstyledButton>
      )
    : (
        <Tooltip label={intl.formatMessage({ id: label })} position="right" transitionProps={{ duration: 0 }}>
          <UnstyledButton
            className={classes.button}
            aria-label={intl.formatMessage({ id: label })}
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            <Icon />
          </UnstyledButton>
        </Tooltip>
      )
}

export default NavBarButtons
