import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { customRender, screen, userEvent } from '../../test-utils'
import SelectCurrency from './SelectCurrency'

vi.mock('../../stores/useSettingsStore')
const mockSetCurrency = vi.fn()

describe('selectCurrency component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSettingsStore as any).mockReturnValue({
      currency: '€',
      setCurrency: mockSetCurrency,
    })
  })

  it('renders currency selector', () => {
    customRender(<SelectCurrency />)
    expect(screen.getByRole('textbox', { name: 'Select your currency (Currency exchange/converter is not available)' })).toBeInTheDocument()
  })

  it('calls setCurrency when a new currency is selected', async () => {
    customRender(<SelectCurrency />)

    await userEvent.click(screen.getByRole('textbox', { name: 'Select your currency (Currency exchange/converter is not available)' }))
    await userEvent.click(screen.getByRole('option', { name: 'Dollar ($)' }))

    expect(mockSetCurrency).toHaveBeenCalledWith('$')
  })
})
