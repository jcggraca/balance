import type { FC } from 'react'
import { AppShell, Burger, Group, Title } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconCalendarDollar } from '@tabler/icons-react'
import { Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import Navbar from '../components/NavBar'

const Layout: FC = () => {
  const intl = useIntl()
  const [opened, { toggle }] = useDisclosure()
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width: 48em)')

  useEffect(() => {
    if (opened && isMobile) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
    }
    else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [opened, isMobile])

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
            {intl.formatMessage({ id: getPageName() })}
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar toggle={toggle} isMobile={isMobile} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default Layout
