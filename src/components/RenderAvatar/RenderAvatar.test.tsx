import { describe, expect, it } from 'vitest'
import { customRender, screen } from '../../test-utils'
import RenderAvatar from './RenderAvatar'

describe('renderAvatar', () => {
  const mockExpense = {
    id: '1',
    name: 'Food test',
    amount: 55,
    description: 'Test expense',
    accountId: '1',
    rating: 'necessary',
    category: '1',
    budget: '',
    actionTimestamp: 1738007744152,
    createdTimestamp: 1738007744152,
    updatedTimestamp: 1738007744152,
  }

  const mockCategories = [
    {
      id: '1',
      name: 'Food',
      description: '',
      icon: 'IconShoppingCart' as const,
      color: '#fff',
      createdTimestamp: 1738007744152,
      updatedTimestamp: 1738007744152,
    },
  ]

  it('renders error avatar when displayError is true', () => {
    customRender(
      <RenderAvatar
        displayError={true}
        item={mockExpense}
        placeholderIcon="IconHome"
      />,
    )

    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveClass('mantine-Avatar-root')

    const style = getComputedStyle(avatar)
    expect(style.getPropertyValue('--avatar-bg')).toBe('var(--mantine-color-red-light)')
  })

  it('renders category icon and color when category exists', () => {
    customRender(
      <RenderAvatar
        displayError={false}
        item={mockExpense}
        placeholderIcon="IconHome"
        categories={mockCategories}
      />,
    )

    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveClass('mantine-Avatar-root')

    const style = getComputedStyle(avatar)
    expect(style.getPropertyValue('--avatar-bg')).toBe('rgba(255, 255, 255, 0.1)')
  })

  it('renders placeholder icon when category does not exist', () => {
    const itemWithoutCategory = { ...mockExpense, category: '2' }

    customRender(
      <RenderAvatar
        displayError={false}
        item={itemWithoutCategory}
        placeholderIcon="IconHome"
        categories={mockCategories}
      />,
    )

    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveClass('mantine-Avatar-root')
    const style = getComputedStyle(avatar)
    expect(style.getPropertyValue('--avatar-bg')).toBe('var(--mantine-color-green-light)')
  })
})
