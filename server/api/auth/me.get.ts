export default defineEventHandler(async (event) => {
  const session = await getAdminSession(event)
  return { user: session.data.user ?? null }
})
