import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock `getComputedStyle`
const { getComputedStyle } = window
window.getComputedStyle = elt => getComputedStyle(elt)

// Mock `scrollIntoView`
window.HTMLElement.prototype.scrollIntoView = () => {}

// Mock `matchMedia`
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver which Mantine needs
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
