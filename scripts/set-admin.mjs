// Create or update an admin account in TiDB.
//   npm run admin:set                      -> uses ADMIN_USERNAME / ADMIN_PASSWORD from .env
//   npm run admin:set -- <username> <password>
import { randomBytes, scryptSync } from 'node:crypto'
import mysql from 'mysql2/promise'

const [username = process.env.ADMIN_USERNAME, password = process.env.ADMIN_PASSWORD] = process.argv.slice(2)
if (!username || !password) {
  console.error('Username/password kosong. Isi ADMIN_USERNAME & ADMIN_PASSWORD di .env atau beri argumen.')
  process.exit(1)
}

const salt = randomBytes(16)
const hash = `scrypt$${salt.toString('hex')}$${scryptSync(password, salt, 64).toString('hex')}`
const name = process.env.DB_NAME || 'keuangan'

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
})
await db.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``)
await db.query(`USE \`${name}\``)
await db.query(`
  CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`)
await db.execute(
  'INSERT INTO admins (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)',
  [username, hash],
)
await db.end()
console.log(`Admin "${username}" tersimpan di database ${name}.admins`)
