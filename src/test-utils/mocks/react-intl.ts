import { vi } from 'vitest'

export const mockUseIntl = {
  formatMessage: vi.fn(obj => obj.defaultMessage || ''),
  formatNumber: vi.fn(num => String(num)),
  formatDate: vi.fn(date => date.toISOString()),
}

vi.mock('react-intl', async () => {
  const actual = await vi.importActual('react-intl')
  return {
    ...actual,
    useIntl: () => mockUseIntl,
  }
})
