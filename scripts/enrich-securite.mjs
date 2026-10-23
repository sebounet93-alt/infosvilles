import pg from 'pg';
import readline from 'readline';
import { Readable } from 'stream';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// URL du jeu de données officiel SSMSI (délinquance par commune sur data.gouv.fr)
const SSMSI_CSV_URL = 'https://www.data.gouv.fr/fr/datasets/r/d8d49ee4-4be6-4443-85f0-62ca6c0e5b72';

async function run() {
  const client = await pool.connect();
  try {
    console.log('📥 Téléchargement des données de sécurité SSMSI...');
    const resp = await fetch(SSMSI_CSV_URL);
    if (!resp.ok) {
      throw new Error(`Échec du téléchargement SSMSI : ${resp.statusText}`);
    }

    console.log('⚙️ Traitement du flux CSV...');
    const stream = Readable.fromWeb(resp.body);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    // Map: code_insee -> cumul faits
    const crimeCounts = new Map();

    let isHeader = true;
    for await (const line of rl) {
      if (isHeader) {
        isHeader = false;
        continue;
      }

      // Format standard data.gouv : CODGEO_2024;annee;classe;faits;...
      const cols = line.split(';');
      const insee = cols[0]?.trim();
      const faits = parseFloat(cols[3]?.replace(',', '.'));

      if (insee && !isNaN(faits)) {
        crimeCounts.set(insee, (crimeCounts.get(insee) || 0) + faits);
      }
    }

    console.log(`📊 Statistiques chargées pour ${crimeCounts.size} communes. Mise à jour de la base...`);

    const res = await client.query('SELECT insee_code, population FROM cities WHERE insee_code IS NOT NULL');
    const cities = res.rows;

    let updated = 0;
    for (const city of cities) {
      const faits = crimeCounts.get(city.insee_code);
      if (faits !== undefined && city.population > 0) {
        // Taux pour 1 000 habitants
        const ratePer1000 = (faits / Number(city.population)) * 1000;

        // Normalisation empirique sur 10 (moyenne nationale ~40 pour 1000, max urbain ~120)
        // Plus le taux est bas, plus la note est proche de 10
        let score = 10 - (ratePer1000 / 12);
        score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

        await client.query(`
          UPDATE cities 
          SET 
            score_security = $1,
            score_overall = ROUND((($1 + score_education + score_amenities) / 3)::numeric, 1)
          WHERE insee_code = $2
        `, [score, city.insee_code]);

        updated++;
      }
    }

    console.log(`✅ Sécurité consolidée : ${updated} communes mises à jour avec les taux réels SSMSI.`);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);