import type { IconHome2 } from '@tabler/icons-react'
import type { FC } from 'react'
import { Tooltip, UnstyledButton } from '@mantine/core'
import { Link, useLocation } from '@tanstack/react-router'
import { useIntl } from 'react-intl'
import classes from './NavbarLink.module.css'

interface NavbarLinkProps {
  label: string
  to: string
  icon: typeof IconHome2
  onClick: () => void
  isMobile?: boolean
}

const NavbarLink: FC<NavbarLinkProps> = ({ isMobile, onClick, label, to, icon: Icon }) => {
  const location = useLocation()
  const intl = useIntl()

  return (
    isMobile
      ? (
          <UnstyledButton
            onClick={onClick}
            className={classes.linkMobile}
            data-active={location.pathname === to || undefined}
            component={Link}
            to={to}
            aria-label={intl.formatMessage({ id: label })}
          >
            <Icon className={classes.linkIcon} />
            <span>{intl.formatMessage({ id: label })}</span>
          </UnstyledButton>
        )
      : (
          <Tooltip label={intl.formatMessage({ id: label })} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton
              className={classes.link}
              data-active={location.pathname === to || undefined}
              component={Link}
              to={to}
              aria-label={intl.formatMessage({ id: label })}
            >
              <Icon />
            </UnstyledButton>
          </Tooltip>
        )
  )
}

export default NavbarLink
