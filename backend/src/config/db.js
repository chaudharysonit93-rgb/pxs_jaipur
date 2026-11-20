import { env } from './env.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbClient = null;
let isPostgres = false;

// Initialize Database connection
if (env.DATABASE_URL && (env.DATABASE_URL.startsWith('postgres://') || env.DATABASE_URL.startsWith('postgresql://'))) {
  try {
    const { default: pg } = await import('pg');
    const pool = new pg.Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    dbClient = pool;
    isPostgres = true;
    console.log('✅ [DB] Connected to PostgreSQL database.');
  } catch (err) {
    console.warn('⚠️ [DB] PostgreSQL connection failed, falling back to local SQLite:', err.message);
  }
}

if (!dbClient) {
  // Built-in zero-dependency Node SQLite engine
  const { DatabaseSync } = await import('node:sqlite');
  const dbDir = path.resolve(__dirname, '../../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'pxs.db');
  const sqlite = new DatabaseSync(dbPath);
  
  // Enable foreign keys and WAL mode for high concurrency
  sqlite.exec('PRAGMA foreign_keys = ON;');
  sqlite.exec('PRAGMA journal_mode = WAL;');
  
  dbClient = sqlite;
  isPostgres = false;
  console.log(`✅ [DB] Connected to built-in local database: ${dbPath}`);
}

/**
 * Universal parameterized query executor
 * Normalizes $1, $2 (Postgres syntax) to ? (SQLite syntax) when running on SQLite
 * Returns { rows: Array, rowCount: Number }
 */
export async function query(sql, params = []) {
  if (isPostgres) {
    const res = await dbClient.query(sql, params);
    return { rows: res.rows, rowCount: res.rowCount };
  } else {
    // Translate $1, $2, ... to ? for SQLite
    let paramIndex = 0;
    const normalizedSql = sql.replace(/\$(\d+)/g, () => '?');
    
    const trimmed = normalizedSql.trim();
    const isSelect = /^SELECT\b|^PRAGMA\b/i.test(trimmed);

    try {
      const stmt = dbClient.prepare(normalizedSql);
      if (isSelect) {
        const rows = stmt.all(...params);
        return { rows, rowCount: rows.length };
      } else {
        const result = stmt.run(...params);
        return {
          rows: [],
          rowCount: result.changes,
          lastInsertRowid: result.lastInsertRowid
        };
      }
    } catch (err) {
      console.error('❌ SQL Execution Error:', err.message, '\nQuery:', normalizedSql, '\nParams:', params);
      throw err;
    }
  }
}

export { isPostgres };
