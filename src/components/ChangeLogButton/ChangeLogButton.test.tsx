import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAlertsStore } from '../../stores/useAlertsStore'
import { customRender, fireEvent, screen } from '../../test-utils'
import ChangeLogButton from './ChangeLogButton'

vi.mock('../../stores/useAlertsStore')

const mockSetShowChangelog = vi.fn()

describe('changeLogButton component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAlertsStore as any).mockReturnValue({
      setShowChangelog: mockSetShowChangelog,
    })
  })

  it('renders mobile button', () => {
    customRender(<ChangeLogButton isMobile={true} />)

    const button = screen.getByRole('button', { name: /changelog/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass(/mantine-UnstyledButton-root/i)
    expect(button).toHaveClass(/_buttonMobile_/i)

    const changelogText = screen.getByText(/changelog/i)
    expect(changelogText).toBeInTheDocument()
  })

  it('renders desktop button', () => {
    customRender(<ChangeLogButton isMobile={false} />)

    const button = screen.getByRole('button', { name: /changelog/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass(/mantine-UnstyledButton-root/i)
    expect(button).toHaveClass(/_button_/i)

    const changelogText = screen.queryByText(/changelog/i)
    expect(changelogText).toBeNull()
  })

  it('calls setShowChangelog when the button is clicked', () => {
    customRender(<ChangeLogButton isMobile={false} />)

    const button = screen.getByRole('button', { name: /changelog/i })
    fireEvent.click(button)
    expect(mockSetShowChangelog).toHaveBeenCalledWith(true)
  })
})
