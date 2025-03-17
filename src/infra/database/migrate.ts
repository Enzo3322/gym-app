import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import path from 'path';

// Inicializa o banco de dados SQLite
const sqlite = new Database(path.resolve(__dirname, 'db.sqlite'));
const db = drizzle(sqlite);

// Executa as migrações
console.log('Running migrations...');
migrate(db, { migrationsFolder: path.resolve(process.cwd(), 'drizzle') });
console.log('Migrations completed successfully!');

// Fecha a conexão com o banco de dados
sqlite.close(); 