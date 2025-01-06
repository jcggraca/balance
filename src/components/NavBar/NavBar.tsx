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
import { useIntl } from 'react-intl'
import MailUs from '../MailUs'
import NavbarLink from '../NavbarLink'
import NavbarLinkMobile from '../NavbarLinkMobile'
import ThemeToggle from '../ThemeToggle'
import classes from './NavBar.module.css'

const linksData = [
  { icon: IconHome2, label: 'dashboard', to: '/', ariaLabel: 'goToDashboard' },
  { icon: IconBuildingBank, label: 'accounts', to: '/accounts', ariaLabel: 'viewAllAccounts' },
  { icon: IconBellDollar, label: 'incomes', to: '/incomes', ariaLabel: 'manageIncomes' },
  { icon: IconMoneybag, label: 'expenses', to: '/expenses', ariaLabel: 'trackExpenses' },
  { icon: IconCalendarDollar, label: 'budget', to: '/budget', ariaLabel: 'viewBudget' },
  { icon: IconCreditCard, label: 'debts', to: '/debts', ariaLabel: 'manageDebts' },
  { icon: IconTags, label: 'types', to: '/types', ariaLabel: 'configureTypes' },
  { icon: IconSettings, label: 'settings', to: '/settings', ariaLabel: 'adjustSettings' },
]

interface NavbarProps {
  isMobile?: boolean
  toggle: () => void
}

const Navbar: FC<NavbarProps> = ({ toggle, isMobile }) => {
  const intl = useIntl()

  const links = linksData.map((link) => {
    if (isMobile) {
      return <NavbarLinkMobile {...link} key={link.label} onClick={toggle} />
    }
    return <NavbarLink {...link} key={link.label} />
  })

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={isMobile ? 10 : 0}>
          {links}
        </Stack>
      </div>

      <div>
        {isMobile
          ? (
              <UnstyledButton
                component="a"
                href="https://github.com/jcggraca/my-personal-finance"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.buttonMobile}
                aria-label={intl.formatMessage({ id: 'viewCode' })}
              >
                <IconBrandGithub className={classes.buttonMobileIcon} />
                <span>{intl.formatMessage({ id: 'giveAStar' })}</span>
              </UnstyledButton>
            )
          : (
              <Tooltip label={intl.formatMessage({ id: 'giveAStar' })} position="right" transitionProps={{ duration: 0 }}>
                <UnstyledButton
                  component="a"
                  href="https://github.com/jcggraca/my-personal-finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.button}
                  aria-label={intl.formatMessage({ id: 'viewCode' })}
                >
                  <IconBrandGithub />
                </UnstyledButton>
              </Tooltip>
            )}
        <MailUs isMobile={isMobile ?? false} />
        <ThemeToggle isMobile={isMobile ?? false} />
      </div>
    </nav>
  )
}

export default Navbar
