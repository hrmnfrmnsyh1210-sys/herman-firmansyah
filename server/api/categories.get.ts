// Every category ever used, ranked by all-time total per type. The admin UI
// derives stable chart colours from this rank, so it must not depend on the month.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = await useDb()
  const [rows] = await db.query<any[]>(
    `SELECT type, category, SUM(amount) AS total
       FROM transactions
      GROUP BY type, category
      ORDER BY total DESC, category`,
  )
  return rows.map((r) => ({ type: r.type, category: r.category, total: Number(r.total) }))
})
