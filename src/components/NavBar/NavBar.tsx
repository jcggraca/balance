import type { FC } from 'react'
import { Stack } from '@mantine/core'
import {
  IconBellDollar,
  IconBuildingBank,
  IconCalendarDollar,
  IconCreditCard,
  IconHome2,
  IconMoneybag,
  IconSettings,
  IconTags,
} from '@tabler/icons-react'
import MailUs from '../MailUs'
import NavbarLink from '../NavbarLink'
import ThemeToggle from '../ThemeToggle'
import classes from './NavBar.module.css'

const linksData = [
  { icon: IconHome2, label: 'Dashboard', to: '/' },
  { icon: IconBuildingBank, label: 'Accounts', to: '/accounts' },
  { icon: IconBellDollar, label: 'Income', to: '/income' },
  { icon: IconMoneybag, label: 'Expenses', to: '/expenses' },
  { icon: IconCalendarDollar, label: 'Budget', to: '/budget' },
  { icon: IconCreditCard, label: 'Debts', to: '/debts' },
  { icon: IconTags, label: 'Types', to: '/types' },
  { icon: IconSettings, label: 'Settings', to: '/settings' },
]

interface NavbarProps {
  toggle?: () => void
}

const Navbar: FC<NavbarProps> = ({ toggle }) => {
  const links = linksData.map(link => (
    <NavbarLink
      {...link}
      key={link.label}
      onClick={toggle}
    />
  ))

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <div>
        <MailUs />
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar
