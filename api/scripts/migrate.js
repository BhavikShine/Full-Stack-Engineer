require('dotenv').config();

const dns = require('dns');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

dns.setDefaultResultOrder('ipv6first');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'api', 'migrations');

function buildClient() {
  if (process.env.DATABASE_URL) {
    return new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_PASSWORD) {
    console.error('Missing database config. Set DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD in .env');
    process.exit(1);
  }

  return new Client({
    host: DB_HOST,
    port: DB_PORT || 5432,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME || 'postgres',
    ssl: { rejectUnauthorized: false },
  });
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}

async function getAppliedMigrations(client) {
  const { rows } = await client.query('SELECT name FROM schema_migrations ORDER BY name');
  return new Set(rows.map((row) => row.name));
}

async function runMigrations() {
  const client = buildClient();

  await client.connect();

  try {
    await ensureMigrationsTable(client);
    const applied = await getAppliedMigrations(client);

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('No migration files found.');
      return;
    }

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipped (already applied): ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      console.log(`Running: ${file}`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`Applied: ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log('Migrations complete.');
  } finally {
    await client.end();
  }
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
