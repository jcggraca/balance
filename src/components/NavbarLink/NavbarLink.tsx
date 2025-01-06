import type { IconHome2 } from '@tabler/icons-react'
import type { FC } from 'react'
import { Tooltip, UnstyledButton } from '@mantine/core'
import { useIntl } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import classes from './NavbarLink.module.css'

interface NavbarLinkProps {
  label: string
  to: string
  icon: typeof IconHome2
  ariaLabel: string
}

const NavbarLink: FC<NavbarLinkProps> = ({ label, to, icon: Icon, ariaLabel }) => {
  const location = useLocation()
  const intl = useIntl()

  return (
    <Tooltip label={intl.formatMessage({ id: label })} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        className={classes.link}
        data-active={location.pathname === to || undefined}
        component={Link}
        to={to}
        aria-label={intl.formatMessage({ id: ariaLabel })}
      >
        <Icon />
      </UnstyledButton>
    </Tooltip>
  )
}

export default NavbarLink
