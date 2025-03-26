import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infra/database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './sqlite/db.sqlite',
  },
} as Config; 