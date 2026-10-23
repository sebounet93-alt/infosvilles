import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE cities 
      ADD COLUMN IF NOT EXISTS median_income_eur INT,
      ADD COLUMN IF NOT EXISTS poverty_rate NUMERIC(4,1);
    `);
    console.log('✅ Colonnes median_income_eur et poverty_rate vérifiées/ajoutées.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);