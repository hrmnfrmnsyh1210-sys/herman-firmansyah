import { readFileSync } from 'node:fs'
import mysql from 'mysql2/promise'

// One pool per server process. TiDB Cloud requires TLS; Node's bundled CA
// store already trusts its certificate, so DB_CA_PATH is optional.
let pool: mysql.Pool | undefined
let ready: Promise<void> | undefined

function env(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback
  if (value === undefined || value === '') throw new Error(`Env ${name} belum di-set`)
  return value
}

function createPool() {
  const ca = process.env.DB_CA_PATH ? readFileSync(process.env.DB_CA_PATH) : undefined
  return mysql.createPool({
    host: env('DB_HOST'),
    port: Number(env('DB_PORT', '4000')),
    user: env('DB_USER'),
    password: env('DB_PASSWORD'),
    database: env('DB_NAME', 'keuangan'),
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true, ...(ca && { ca }) },
    connectionLimit: 5,
    dateStrings: true,
    decimalNumbers: true,
  })
}

async function migrate(db: mysql.Pool) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      type ENUM('income', 'expense') NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description VARCHAR(255) NOT NULL DEFAULT '',
      date DATE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_date (date),
      KEY idx_type_date (type, date)
    )
  `)
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(64) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  // First run: seed the admin account from .env so there is always a way in.
  const [rows] = await db.query<mysql.RowDataPacket[]>('SELECT COUNT(*) AS n FROM admins')
  const user = process.env.ADMIN_USERNAME
  const pass = process.env.ADMIN_PASSWORD
  if (Number(rows[0].n) === 0 && user && pass)
    await db.execute('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [user, await hashPassword(pass)])
}

export async function useDb() {
  if (!pool) {
    // The database itself must exist before the pool can select it.
    const name = env('DB_NAME', 'keuangan')
    if (!/^\w+$/.test(name)) throw new Error('DB_NAME tidak valid')
    const bootstrap = await mysql.createConnection({
      host: env('DB_HOST'),
      port: Number(env('DB_PORT', '4000')),
      user: env('DB_USER'),
      password: env('DB_PASSWORD'),
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    })
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``)
    await bootstrap.end()
    pool = createPool()
  }
  ready ??= migrate(pool).catch((err) => {
    ready = undefined
    throw err
  })
  await ready
  return pool
}
