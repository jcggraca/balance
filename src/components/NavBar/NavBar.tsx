import { Center, Stack } from '@mantine/core'
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
import classes from './Navbar.module.css'

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

function Navbar() {
  const links = linksData.map(link => (
    <NavbarLink
      {...link}
      key={link.label}
    />
  ))

  return (
    <nav className={classes.navbar}>
      <Center>
        <IconCalendarDollar />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <MailUs />
      </Stack>

      <Stack justify="center" gap={0}>
        <ThemeToggle />
      </Stack>
    </nav>
  )
}

export default Navbar
