import type { FC } from 'react'
import { Stack } from '@mantine/core'
import {
  IconBellDollar,
  IconBrandGithub,
  IconBuildingBank,
  IconCalendarDollar,
  IconCreditCard,
  IconHome2,
  IconMail,
  IconMoneybag,
  IconSettings,
  IconTags,
} from '@tabler/icons-react'
import ThemeToggle from '../ThemeToggle'
import classes from './NavBar.module.css'
import NavBarButtons from './NavBarButtons'
import NavbarLink from './NavbarLink'

const appLinksData = [
  { icon: IconHome2, label: 'dashboard', to: '/' },
  { icon: IconBuildingBank, label: 'accounts', to: '/accounts' },
  { icon: IconBellDollar, label: 'income', to: '/income' },
  { icon: IconMoneybag, label: 'expenses', to: '/expenses' },
  { icon: IconCalendarDollar, label: 'budget', to: '/budget' },
  { icon: IconCreditCard, label: 'debts', to: '/debts' },
  { icon: IconTags, label: 'categories', to: '/categories' },
  { icon: IconSettings, label: 'settings', to: '/settings' },
]

const linksData = [
  { icon: IconBrandGithub, label: 'giveAStar', href: 'https://github.com/jcggraca/balance' },
  { icon: IconMail, label: 'sendFeedback', href: 'mailto:mail@joaograca.dev' },
]

interface NavbarProps {
  isMobile?: boolean
  toggle: () => void
}

const Navbar: FC<NavbarProps> = ({ toggle, isMobile }) => {
  return (
    <nav className={classes.navbar}>
      <Stack className={classes.navbarMain} mb={isMobile ? 30 : 0} gap={isMobile ? 10 : 0}>
        {appLinksData.map(link => (
          <NavbarLink
            isMobile={isMobile}
            key={link.label}
            onClick={toggle}
            {...link}
          />
        ))}
      </Stack>

      <div>
        {linksData.map(link => (
          <NavBarButtons key={link.label} {...link} isMobile={isMobile} />
        ))}
        <ThemeToggle isMobile={isMobile ?? false} />
      </div>
    </nav>
  )
}

export default Navbar
