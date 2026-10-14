export type TxType = 'income' | 'expense'

export interface TxInput {
  type: TxType
  amount: number
  category: string
  description: string
  date: string
}

export function parseTxInput(body: any): TxInput {
  const type = body?.type
  const amount = Number(body?.amount)
  const category = String(body?.category ?? '').trim()
  const description = String(body?.description ?? '').trim()
  const date = String(body?.date ?? '')

  const fail = (msg: string) => {
    throw createError({ statusCode: 400, statusMessage: msg })
  }
  if (type !== 'income' && type !== 'expense') fail('Jenis transaksi tidak valid')
  if (!Number.isFinite(amount) || amount <= 0) fail('Nominal harus lebih dari 0')
  if (amount >= 1e13) fail('Nominal terlalu besar')
  if (!category) fail('Kategori wajib diisi')
  if (category.length > 100) fail('Kategori maksimal 100 karakter')
  if (description.length > 255) fail('Keterangan maksimal 255 karakter')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) fail('Tanggal tidak valid')

  return { type, amount: Math.round(amount * 100) / 100, category, description, date }
}

/** Builds the WHERE clause shared by the list and summary endpoints. */
export function txFilter(query: Record<string, any>) {
  const where: string[] = []
  const params: unknown[] = []
  const month = String(query.month ?? '')
  if (/^\d{4}-\d{2}$/.test(month)) {
    where.push('date >= ? AND date < DATE_ADD(?, INTERVAL 1 MONTH)')
    params.push(`${month}-01`, `${month}-01`)
  }
  if (query.type === 'income' || query.type === 'expense') {
    where.push('type = ?')
    params.push(query.type)
  }
  const q = String(query.q ?? '').trim()
  if (q) {
    where.push('(category LIKE ? OR description LIKE ?)')
    params.push(`%${q}%`, `%${q}%`)
  }
  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', params }
}
