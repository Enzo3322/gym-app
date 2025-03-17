import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from './schema';

// Inicializa o banco de dados SQLite
const sqlite = new Database(path.resolve(__dirname, 'db.sqlite'));
const db = drizzle(sqlite, { schema });

export { db, sqlite }; 