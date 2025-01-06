import type { FC } from 'react'
import Navbar from '@/components/NavBar/NavBar'
import { AppShell, Burger, Group, Title } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconCalendarDollar } from '@tabler/icons-react'
import { FormattedMessage } from 'react-intl'
import { Outlet, useLocation } from 'react-router-dom'

const Layout: FC = () => {
  const [opened, { toggle }] = useDisclosure()
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const getPageName = () => {
    const path = location.pathname
    if (path === '/')
      return 'dashboard'
    return path.substring(1).charAt(0) + path.slice(2)
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 80, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      transitionDuration={0}
      padding="md"
    >

      <AppShell.Header>
        <Group h="100%" px="md">
          {isMobile && <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />}
          <IconCalendarDollar size={30} />
          <Title order={1}>
            <FormattedMessage id={getPageName()} />
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar toggle={toggle} isMobile={isMobile} />
      </AppShell.Navbar>

      <AppShell.Main><Outlet /></AppShell.Main>
    </AppShell>
  )
}

export default Layout
