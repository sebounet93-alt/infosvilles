import pg from 'pg';
import fs from 'fs';

let connectionString = process.env.DATABASE_URL;

if (!connectionString && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const line = envContent.split('\n').find(l => l.trim().startsWith('DATABASE_URL='));
  if (line) {
    connectionString = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
}

const pool = new pg.Pool({ connectionString });

async function verify() {
  const client = await pool.connect();
  try {
    const counts = await client.query(`
      SELECT 
        COUNT(*) as "Total communes",
        COUNT(avg_price_sqm_apt) as "Prix appart DVF",
        COUNT(avg_price_sqm_house) as "Prix maison DVF",
        COUNT(score_security) as "Scores sécurité",
        COUNT(median_income_eur) as "Revenus INSEE"
      FROM cities;
    `);
    console.log('\n--- État de remplissage de la base PostgreSQL ---');
    console.table(counts.rows);

    const sample = await client.query(`
      SELECT name, postal_code, avg_price_sqm_apt, score_security, median_income_eur 
      FROM cities 
      WHERE avg_price_sqm_apt IS NOT NULL 
      ORDER BY population DESC 
      LIMIT 5;
    `);
    console.log('\n--- Échantillon représentatif (Grandes métropoles) ---');
    console.table(sample.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

verify().catch(console.error);