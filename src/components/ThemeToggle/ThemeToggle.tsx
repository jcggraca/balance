import type { FC } from 'react'
import { Tooltip, UnstyledButton, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useIntl } from 'react-intl'
import classes from './ThemeToggle.module.css'

interface ThemeToggleProps {
  isMobile: boolean
}

const ThemeToggle: FC<ThemeToggleProps> = ({ isMobile }) => {
  const intl = useIntl()
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const nextScheme = colorScheme === 'dark' ? intl.formatMessage({ id: 'light' }) : intl.formatMessage({ id: 'dark' })

  if (isMobile) {
    return (
      <UnstyledButton
        className={classes.buttonMobile}
        onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
        aria-label={`${intl.formatMessage({ id: 'switchTheme' })} ${nextScheme} ${intl.formatMessage({ id: 'mode' })}`}
      >
        {colorScheme === 'dark' ? <IconMoon className={classes.buttonMobileIcon} /> : <IconSun className={classes.buttonMobileIcon} />}
        <span>
          {intl.formatMessage({ id: 'switchTheme' })}
          {' '}
          {nextScheme}
          {' '}
          {intl.formatMessage({ id: 'mode' })}
        </span>
      </UnstyledButton>
    )
  }

  return (
    <Tooltip
      label={`${intl.formatMessage({ id: 'switchTheme' })} ${nextScheme} ${intl.formatMessage({ id: 'mode' })}`}
      position="right"
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        className={classes.button}
        onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
        aria-label={`${intl.formatMessage({ id: 'switchTheme' })} ${nextScheme} ${intl.formatMessage({ id: 'mode' })}`}
      >
        {colorScheme === 'dark' ? <IconMoon /> : <IconSun />}
      </UnstyledButton>
    </Tooltip>
  )
}

export default ThemeToggle
