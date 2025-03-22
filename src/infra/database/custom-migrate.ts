import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Inicializa o banco de dados SQLite
const dbPath = path.resolve(__dirname, '../../../sqlite/db.sqlite');
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

// Executa a migração personalizada
console.log('Running user table migration...');

const userMigrationSQL = fs.readFileSync(
  path.resolve(process.cwd(), 'drizzle/0002_users_migration.sql'),
  'utf-8'
);

// Executa cada instrução SQL da migração
const statements = userMigrationSQL.split('--> statement-breakpoint');
for (const statement of statements) {
  const trimmedStatement = statement.trim();
  if (trimmedStatement) {
    try {
      sqlite.exec(trimmedStatement);
      console.log('Executed:', trimmedStatement.substring(0, 40) + '...');
    } catch (error) {
      console.error('Error executing SQL:', error);
      throw error;
    }
  }
}

console.log('User table migration completed successfully!');

// Fecha a conexão com o banco de dados
sqlite.close();