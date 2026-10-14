import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' })
  const db = await useDb()
  const [result] = await db.execute<ResultSetHeader>('DELETE FROM transactions WHERE id = ?', [id])
  if (!result.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Transaksi tidak ditemukan' })
  return { ok: true }
})
