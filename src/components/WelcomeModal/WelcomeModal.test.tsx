import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { customRender, fireEvent, screen } from '../../test-utils'
import WelcomeModal from './WelcomeModal'
import '@testing-library/jest-dom'

vi.mock('../../db', () => ({
  db: {
    categories: {
      bulkAdd: vi.fn(),
    },
  },
}))

vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}))

vi.mock('react-intl', async () => {
  const actual = await vi.importActual('react-intl')
  return {
    ...actual,
    useIntl: () => ({
      formatMessage: ({ id }: { id: string }) => id,
    }),
    FormattedMessage: ({ id }: { id: string }) => id,
  }
})

describe('welcomeModal component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSettingsStore.getState().setNewUser(true)
  })

  // TODO:
  // it('renders the welcome modal with initial state', () => {
  //   render(<WelcomeModal />)

  //   expect(screen.getByText('welcome')).toBeInTheDocument()
  //   expect(screen.getByText('welcomeDescription')).toBeInTheDocument()

  //   const defaultCategoriesCheckbox = screen.getByLabelText('defaultCategories')
  //   const termsCheckbox = screen.getByLabelText(/termsAgree/)

  //   expect(defaultCategoriesCheckbox).toBeChecked()
  //   expect(termsCheckbox).not.toBeChecked()

  //   const completeButton = screen.getByText('complete')
  //   expect(completeButton).toBeDisabled()
  // })

  it('enables complete button when terms are accepted', () => {
    customRender(<WelcomeModal />)

    const termsCheckbox = screen.getByLabelText(/termsAgree/)
    fireEvent.click(termsCheckbox)

    const completeButton = screen.getByText('complete')
    expect(completeButton).toBeEnabled()
  })

  it('adds default categories when completed with categories checkbox checked', () => {
    customRender(<WelcomeModal />)

    const termsCheckbox = screen.getByLabelText(/termsAgree/)
    fireEvent.click(termsCheckbox)

    const completeButton = screen.getByText('complete')
    fireEvent.click(completeButton)

    expect(db.categories.bulkAdd).toHaveBeenCalled()
    expect(useSettingsStore.getState().newUser).toBe(false)
  })

  it('skips adding categories when categories checkbox is unchecked', () => {
    customRender(<WelcomeModal />)

    const defaultCategoriesCheckbox = screen.getByLabelText('defaultCategories')
    fireEvent.click(defaultCategoriesCheckbox)

    const termsCheckbox = screen.getByLabelText(/termsAgree/)
    fireEvent.click(termsCheckbox)

    const completeButton = screen.getByText('complete')
    fireEvent.click(completeButton)

    expect(db.categories.bulkAdd).not.toHaveBeenCalled()
    expect(useSettingsStore.getState().newUser).toBe(false)
  })
})
