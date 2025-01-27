import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { customRender, screen, userEvent } from '../../test-utils'
import SelectLanguage from './SelectLanguage'

vi.mock('../../stores/useSettingsStore')
const mockSetLanguage = vi.fn()

describe('selectLanguage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSettingsStore as any).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
    })
  })

  it('renders language selector', () => {
    customRender(<SelectLanguage />)
    expect(screen.getByRole('textbox', { name: 'Select your language' })).toBeInTheDocument()
  })

  it('calls setLanguage when a new language is selected', async () => {
    customRender(<SelectLanguage />)

    await userEvent.click(screen.getByRole('textbox', { name: 'Select your language' }))
    await userEvent.click(screen.getByRole('option', { name: 'Portuguese' }))

    expect(mockSetLanguage).toHaveBeenCalledWith('pt')
  })
})
