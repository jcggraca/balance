import type { FC } from 'react'
import { Stack, Tooltip, UnstyledButton } from '@mantine/core'
import {
  IconBellDollar,
  IconBrandGithub,
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
  { icon: IconHome2, label: 'Dashboard', to: '/', ariaLabel: 'Go to Dashboard' },
  { icon: IconBuildingBank, label: 'Accounts', to: '/accounts', ariaLabel: 'View all Accounts' },
  { icon: IconBellDollar, label: 'Income', to: '/income', ariaLabel: 'Manage Income' },
  { icon: IconMoneybag, label: 'Expenses', to: '/expenses', ariaLabel: 'Track Expenses' },
  { icon: IconCalendarDollar, label: 'Budget', to: '/budget', ariaLabel: 'View Budget' },
  { icon: IconCreditCard, label: 'Debts', to: '/debts', ariaLabel: 'Manage Debts' },
  { icon: IconTags, label: 'Types', to: '/types', ariaLabel: 'Configure Types' },
  { icon: IconSettings, label: 'Settings', to: '/settings', ariaLabel: 'Adjust Settings' },
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
        <Tooltip label="Github" position="right" transitionProps={{ duration: 0 }}>
          <UnstyledButton
            component="a"
            href="https://github.com/jcggraca/my-personal-finance"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.button}
            aria-label="View project source code on GitHub"
          >
            <IconBrandGithub />
          </UnstyledButton>
        </Tooltip>
        <MailUs />
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar
