export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = await useDb()
  const [rows] = await db.query<any[]>(
    'SELECT DISTINCT type, category FROM transactions ORDER BY category',
  )
  return rows
})
