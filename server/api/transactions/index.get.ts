export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = await useDb()
  const filter = txFilter(getQuery(event))
  const [rows] = await db.query(
    `SELECT id, type, amount, category, description, date
       FROM transactions ${filter.sql}
      ORDER BY date DESC, id DESC
      LIMIT 1000`,
    filter.params,
  )
  return rows
})
