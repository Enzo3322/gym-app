import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infra/database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './src/infra/database/db.sqlite',
  },
} as Config; 