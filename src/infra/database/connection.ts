import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from './schema';

// Type for sqlite that avoids the naming conflict
type SqliteDatabase = any;

// Initialize the SQLite database
const dbPath = path.resolve(__dirname, '../../../sqlite/db.sqlite');
// Create the database instance and cast to our custom type
const sqliteDb = new Database(dbPath) as SqliteDatabase;
const db = drizzle(sqliteDb, { schema });

// Export with type annotations that avoid naming conflicts
export { db };
export const sqlite: SqliteDatabase = sqliteDb; 