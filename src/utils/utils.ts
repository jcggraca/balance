import { db } from '../db'

export async function getAccount(id: string) {
  const account = await db.account.get({ id })
  if (!account) {
    return false
  }
  return account
}
