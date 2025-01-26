import { MantineProvider } from '@mantine/core'
import { render as testingLibraryRender } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <IntlProvider messages={{}} locale="en" defaultLocale="en">
        {children}
      </IntlProvider>
    </MantineProvider>
  )
}

function customRender(ui: React.ReactElement, options = {}) {
  return testingLibraryRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  })
}

export * from '@testing-library/react'
export { customRender as render }
