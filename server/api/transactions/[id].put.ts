import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' })
  const tx = parseTxInput(await readBody(event))
  const db = await useDb()
  const [result] = await db.execute<ResultSetHeader>(
    'UPDATE transactions SET type = ?, amount = ?, category = ?, description = ?, date = ? WHERE id = ?',
    [tx.type, tx.amount, tx.category, tx.description, tx.date, id],
  )
  if (!result.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Transaksi tidak ditemukan' })
  return { id, ...tx }
})
