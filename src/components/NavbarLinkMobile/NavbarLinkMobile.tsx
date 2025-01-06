import type { IconHome2 } from '@tabler/icons-react'
import type { FC } from 'react'
import { UnstyledButton } from '@mantine/core'
import { useIntl } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import classes from './NavbarLinkMobile.module.css'

interface NavbarLinkMobileProps {
  label: string
  to: string
  icon: typeof IconHome2
  ariaLabel: string
  onClick: () => void
}

const NavbarLinkMobile: FC<NavbarLinkMobileProps> = ({ label, to, icon: Icon, onClick, ariaLabel }) => {
  const location = useLocation()
  const intl = useIntl()

  return (
    <UnstyledButton
      onClick={onClick}
      className={classes.link}
      data-active={location.pathname === to || undefined}
      component={Link}
      to={to}
      aria-label={intl.formatMessage({ id: ariaLabel })}
    >
      <Icon className={classes.linkIcon} />
      <span>{intl.formatMessage({ id: label })}</span>
    </UnstyledButton>
  )
}

export default NavbarLinkMobile
