import { drizzle } from 'drizzle-orm/mysql2';
import { createConnection } from 'mysql2';
import { pgGenerate } from 'drizzle-dbml-generator';
import * as schema from '../src/db/appSchema';
import * as dotenv from 'dotenv';

dotenv.config();

const connection = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db = drizzle(connection, { schema, mode: 'default' });

async function main() {
  await pgGenerate({
    schema: schema,
    out: './schema.dbml',
    relational: true
  });
}

main().finally(() => {
  connection.end();
  process.exit(0);
});
