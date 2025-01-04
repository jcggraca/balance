import type { IconHome2 } from '@tabler/icons-react'
import type { FC } from 'react'
import { Tooltip, UnstyledButton } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'
import classes from './NavbarLink.module.css'

interface NavbarLinkProps {
  label: string
  to: string
  icon: typeof IconHome2
}

const NavbarLink: FC<NavbarLinkProps> = ({ label, to, icon: Icon }) => {
  const location = useLocation()

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton className={classes.link} data-active={location.pathname === to || undefined} component={Link} to={to}>
        <Icon />
      </UnstyledButton>
    </Tooltip>
  )
}

export default NavbarLink
