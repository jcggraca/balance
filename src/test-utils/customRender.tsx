import { MantineProvider } from '@mantine/core'
import { render } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { messages } from '../lang/en'

export function customRender(ui: React.ReactNode) {
  return render(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <IntlProvider messages={messages} locale="en">
        <MantineProvider>{children}</MantineProvider>
      </IntlProvider>
    ),
  })
}
