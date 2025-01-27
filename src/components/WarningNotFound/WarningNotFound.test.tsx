import { describe, expect, it } from 'vitest'
import { customRender, screen } from '../../test-utils'
import WarningNotFound from './WarningNotFound'

describe('warningNotFound component', () => {
  it('renders not found message', () => {
    customRender(<WarningNotFound>Account</WarningNotFound>)

    expect(screen.getByText(/Account/)).toBeInTheDocument()
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument()
  })
})
