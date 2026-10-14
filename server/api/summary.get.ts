export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = await useDb()
  const query = getQuery(event)
  // Summary ignores the type/search filters so the cards always show both sides.
  const filter = txFilter({ month: query.month })

  const [totals] = await db.query<any[]>(
    `SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS expense,
        COUNT(*) AS count
       FROM transactions ${filter.sql}`,
    filter.params,
  )
  const [categories] = await db.query<any[]>(
    `SELECT type, category, SUM(amount) AS total
       FROM transactions ${filter.sql}
      GROUP BY type, category
      ORDER BY total DESC`,
    filter.params,
  )
  const [daily] = await db.query<any[]>(
    `SELECT date, type, SUM(amount) AS total
       FROM transactions ${filter.sql}
      GROUP BY date, type
      ORDER BY date`,
    filter.params,
  )
  const [[allTime]] = await db.query<any[]>(
    `SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS balance
       FROM transactions`,
  )

  const income = Number(totals[0].income)
  const expense = Number(totals[0].expense)
  return {
    income,
    expense,
    net: income - expense,
    count: Number(totals[0].count),
    balance: Number(allTime.balance),
    daily: daily.map((d) => ({ date: d.date, type: d.type, total: Number(d.total) })),
    categories: categories.map((c) => ({ type: c.type, category: c.category, total: Number(c.total) })),
  }
})
