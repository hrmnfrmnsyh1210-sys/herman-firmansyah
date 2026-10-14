import type { H3Event } from 'h3'

type AdminSession = { user?: string }

export function getAdminSession(event: H3Event) {
  const password = process.env.SESSION_SECRET
  if (!password || password.length < 32)
    throw createError({ statusCode: 500, statusMessage: 'SESSION_SECRET minimal 32 karakter' })
  return useSession<AdminSession>(event, {
    password,
    name: 'admin_session',
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, sameSite: 'lax', secure: !import.meta.dev },
  })
}

export async function requireAdmin(event: H3Event) {
  const session = await getAdminSession(event)
  if (!session.data.user) throw createError({ statusCode: 401, statusMessage: 'Belum login' })
  return session.data.user
}
