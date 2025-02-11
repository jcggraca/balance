import type { Mock } from 'vitest'
import { v4 as uuidv4 } from 'uuid'
import { describe, expect, it, vi } from 'vitest'
import { db } from '../db'
import { getAccount, getCurrentDateString } from './utils'

vi.mock('../db', () => ({
  db: {
    account: {
      get: vi.fn(),
    },
  },
}))

describe('getAccount', () => {
  it('should return account data when found', async () => {
    const id = uuidv4()
    const mockAccount = { id, name: 'João Graça' }
    ;(db.account.get as Mock).mockResolvedValue(mockAccount)

    const result = await getAccount(id)

    expect(result).toEqual(mockAccount)
    expect(db.account.get).toHaveBeenCalledWith({ id })
  })

  it('should return false when account is not found', async () => {
    const id = uuidv4()
    ;(db.account.get as Mock).mockResolvedValue(null)

    const result = await getAccount(id)

    expect(result).toBe(false)
    expect(db.account.get).toHaveBeenCalledWith({ id })
  })
})

describe('getCurrentDateString', () => {
  it('should return the correct formatted date string', () => {
    const mockDate = new Date('2025-02-11T13:08:00Z')

    vi.useFakeTimers()
    vi.setSystemTime(mockDate)

    const result = getCurrentDateString()
    expect(result).toBe('11-02-2025-13-08')
    vi.useRealTimers()
  })
})
