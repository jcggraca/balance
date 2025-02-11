import { db } from '../db'

export async function getAccount(id: string) {
  const account = await db.account.get({ id })
  if (!account) {
    return false
  }
  return account
}

export function getCurrentDateString() {
  const now = new Date()

  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${day}-${month}-${year}-${hours}-${minutes}`
}
