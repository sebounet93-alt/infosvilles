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

async function run() {
  const client = await pool.connect();
  try {
    // 1. Lister les colonnes réelles de la table cities
    const cols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cities' 
      ORDER BY ordinal_position;
    `);
    console.log('--- Colonnes existantes dans la table cities ---');
    console.table(cols.rows);

    // 2. Ajouter median_income_eur et poverty_rate si absentes
    await client.query(`
      ALTER TABLE cities 
      ADD COLUMN IF NOT EXISTS median_income_eur INT,
      ADD COLUMN IF NOT EXISTS poverty_rate NUMERIC(4,1);
    `);
    console.log('✅ Colonnes INSEE median_income_eur et poverty_rate prêtes.');

    // 3. Vérifier les données actuelles
    const stats = await client.query(`
      SELECT 
        COUNT(*) as "Total communes",
        COUNT(avg_price_sqm_apt) as "Avec DVF apt",
        COUNT(avg_price_sqm_house) as "Avec DVF maison",
        COUNT(score_security) as "Avec score sécurité",
        COUNT(median_income_eur) as "Avec revenus INSEE"
      FROM cities;
    `);
    console.log('\n--- État de remplissage des indicateurs ---');
    console.table(stats.rows);

    // 4. Échantillon des 5 plus grandes communes
    const sample = await client.query(`
      SELECT name, postal_code, population, score_overall, score_security, avg_price_sqm_apt 
      FROM cities 
      ORDER BY population DESC 
      LIMIT 5;
    `);
    console.log('\n--- Échantillon de données (Top 5) ---');
    console.table(sample.rows);

  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);