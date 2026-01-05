import initSqlJs, { Database } from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../mizan.db');

let db: Database;

async function initDB() {
  const SQL = await initSqlJs();
  
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

function saveDB() {
  if (db) {
    const data = db.export();
    writeFileSync(DB_PATH, data);
  }
}

// Wrapper for db.run that auto-saves
function run(sql: string, params: any[] = []) {
  db.run(sql, params);
  saveDB();
}

// Wrapper for db.exec that auto-saves
function exec(sql: string) {
  db.exec(sql);
  saveDB();
}

// Initialize database tables
export async function initDatabase() {
  db = await initDB();
  
  // Users table
  exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      access_code TEXT UNIQUE,
      subscription_tier TEXT DEFAULT 'free',
      trial_ends_at DATETIME,
      subscription_ends_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add subscription columns if they don't exist (for existing databases)
  // SQLite doesn't support adding multiple columns in one ALTER, so we do them one at a time
  try {
    db.exec(`ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free'`);
    console.log('✓ Added subscription_tier column');
  } catch (e) {
    // Column already exists
  }
  
  try {
    db.exec(`ALTER TABLE users ADD COLUMN trial_ends_at DATETIME`);
    console.log('✓ Added trial_ends_at column');
  } catch (e) {
    // Column already exists
  }
  
  try {
    db.exec(`ALTER TABLE users ADD COLUMN subscription_ends_at DATETIME`);
    console.log('✓ Added subscription_ends_at column');
  } catch (e) {
    // Column already exists
  }

  // Checkins table - stores daily accountability data
  exec(`
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      categories TEXT NOT NULL,
      penalties INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    )
  `);

  // Cycles table - stores 7-day cycle progress
  exec(`
    CREATE TABLE IF NOT EXISTS cycles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      cycle_number INTEGER NOT NULL,
      days TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, cycle_number)
    )
  `);

  // Settings table
  exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      settings TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Premium tokens table - single use activation tokens
  exec(`
    CREATE TABLE IF NOT EXISTS premium_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      plan TEXT DEFAULT 'premium',
      created_for_user_id INTEGER,
      expires_at DATETIME,
      redeemed_at DATETIME,
      redeemed_by_user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_for_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (redeemed_by_user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database initialized');
}

export function getDB() {
  return db;
}

export { run, exec, saveDB };
