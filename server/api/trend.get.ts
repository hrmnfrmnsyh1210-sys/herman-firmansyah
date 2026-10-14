// Monthly income vs expense for the N months ending at `month` (inclusive).
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const query = getQuery(event)
  const now = new Date()
  const month = /^\d{4}-\d{2}$/.test(String(query.month))
    ? String(query.month)
    : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const count = Math.min(Math.max(Number(query.months) || 6, 1), 24)

  const [y, m] = month.split('-').map(Number)
  const months = Array.from({ length: count }, (_, i) => {
    const d = new Date(y, m - count + i, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const db = await useDb()
  const [rows] = await db.query<any[]>(
    `SELECT DATE_FORMAT(date, '%Y-%m') AS month, type, SUM(amount) AS total
       FROM transactions
      WHERE date >= ? AND date < DATE_ADD(?, INTERVAL 1 MONTH)
      GROUP BY month, type`,
    [`${months[0]}-01`, `${month}-01`],
  )

  const byMonth = new Map(months.map((key) => [key, { month: key, income: 0, expense: 0 }]))
  for (const r of rows) {
    const entry = byMonth.get(r.month)
    if (entry) entry[r.type as 'income' | 'expense'] = Number(r.total)
  }
  return [...byMonth.values()]
})
