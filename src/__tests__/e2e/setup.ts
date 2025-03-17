import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { beforeAll, afterAll, beforeEach } from '@jest/globals';
import * as schema from '../../infra/database/schema';
import path from 'path';
import fs from 'fs';

// Configurando variáveis de ambiente de teste
process.env.NODE_ENV = 'test';
process.env.PORT = '3000'; // Porta 0 faz com que o Express não inicie o servidor
process.env.DISABLE_RATE_LIMIT = 'true'; // Desativa o rate limiter durante os testes

// Caminho para o banco de dados de teste
const TEST_DB_PATH = path.join(process.cwd(), 'test.db');

// Função para criar/limpar o banco de dados de teste
export const setupTestDatabase = () => {
  // Crie uma nova conexão com o banco de dados em memória
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });
  
  // Crie as tabelas diretamente em vez de usar migrações
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      body_part TEXT,
      equipment TEXT,
      gif_url TEXT,
      target TEXT
    );
  `);

  return { db, sqlite };
};

// Variáveis para armazenar a conexão com o banco de dados
let dbConnection: any;
let sqliteConnection: any;

// Configure o ambiente de teste antes de todos os testes
beforeAll(() => {
  // Configure a variável de ambiente para usar o banco de dados de teste
  process.env.DATABASE_URL = TEST_DB_PATH;
  
  // Inicialize o banco de dados de teste
  const { db, sqlite } = setupTestDatabase();
  dbConnection = db;
  sqliteConnection = sqlite;
});

// Limpe as tabelas antes de cada teste
beforeEach(async () => {
  // Limpa todas as tabelas do banco de dados antes de cada teste
  if (dbConnection) {
    try {
      await dbConnection.delete(schema.exercises);
      // Limpe outras tabelas conforme necessário
    } catch (error) {
      console.error('Error cleaning test database:', error);
    }
  }
});

// Limpe o ambiente de teste após todos os testes
afterAll(() => {
  // Feche a conexão com o banco de dados
  if (sqliteConnection) {
    sqliteConnection.close();
  }
  
  // Não é necessário remover o arquivo de banco de dados, pois estamos usando um banco em memória
});

export { dbConnection }; 