import { describe, expect, it } from 'vitest'
import { customRender, fireEvent, screen } from '../../test-utils'
import ThemeToggle from './ThemeToggle'

describe('themeToggle component', () => {
  it('renders desktop button', () => {
    customRender(<ThemeToggle isMobile={false} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Switch theme to Dark Mode',
    )
  })

  it('renders mobile button', () => {
    customRender(<ThemeToggle isMobile={true} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Switch theme to Dark Mode')
  })

  it('toggles theme when clicked', () => {
    customRender(<ThemeToggle isMobile={false} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch theme to Dark Mode')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-label', 'Switch theme to Light Mode')
  })
})
