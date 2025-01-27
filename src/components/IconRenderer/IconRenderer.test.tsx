import { describe, expect, it, vi } from 'vitest'
import { customRender, screen } from '../../test-utils'
import IconRenderer from '../IconRenderer'

vi.mock('../iconsMap', () => ({
  testIcon: () => <div data-testid="test-icon">Test Icon</div>,
}))

describe('iconRenderer component', () => {
  it('renders the icon component when icon exists', () => {
    customRender(<IconRenderer icon="IconHome" />)

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('renders error message when icon does not exist', () => {
    customRender(<IconRenderer icon={'SomeRandomIcon' as any} />)

    expect(screen.getByText('Icon not found')).toBeInTheDocument()
    expect(screen.getByText('Icon not found')).toHaveStyle({ color: 'var(--mantine-color-red-text)' })
  })
})
