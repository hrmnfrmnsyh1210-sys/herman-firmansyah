import type { RowDataPacket } from 'mysql2'

// Verified against a throwaway hash when the username is unknown, so response
// time doesn't reveal which usernames exist.
let dummyHash: Promise<string> | undefined

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  const name = String(username ?? '').trim()
  const pass = String(password ?? '')

  const db = await useDb()
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT username, password_hash FROM admins WHERE username = ? LIMIT 1',
    [name],
  )
  const admin = rows[0]
  dummyHash ??= hashPassword('dummy-password')
  const ok = await verifyPassword(pass, admin?.password_hash ?? (await dummyHash))
  if (!admin || !ok) throw createError({ statusCode: 401, statusMessage: 'Username atau password salah' })

  const session = await getAdminSession(event)
  await session.update({ user: admin.username })
  return { user: admin.username }
})
