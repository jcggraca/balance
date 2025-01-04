import { db } from '@/db'

export async function getTypeName(id: string) {
  const types = await db.types.get({ id: +id })
  if (!types) {
    return console.error(`Type with ID ${id} not found.`)
  }
  return types.name
}
