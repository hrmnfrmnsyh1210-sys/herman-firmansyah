import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const tx = parseTxInput(await readBody(event))
  const db = await useDb()
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO transactions (type, amount, category, description, date) VALUES (?, ?, ?, ?, ?)',
    [tx.type, tx.amount, tx.category, tx.description, tx.date],
  )
  setResponseStatus(event, 201)
  return { id: result.insertId, ...tx }
})
