import pg from 'pg';
const { Client } = pg;

// Renseigne tes accès réels VPS
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://ton_utilisateur:ton_mot_de_passe@IP_DE_TON_VPS:5432/nom_de_base?sslmode=prefer";

function createSlug(name, zip) {
  const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cleanName = normalized.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${cleanName}-${zip}`;
}

function randomScore() { return (Math.random() * 3.5 + 6.5).toFixed(1); }
function randomPrice() { return Math.floor(1800 + Math.random() * 4500); }

async function main() {
  console.log("📥 Téléchargement des 1 000 communes...");
  const res = await fetch("https://geo.api.gouv.fr/communes?fields=nom,code,codesPostaux,departement,region,population&format=json");
  const data = await res.json();
  const top1000 = data
    .filter(c => c.population && c.codesPostaux?.length && c.departement && c.region)
    .sort((a, b) => b.population - a.population)
    .slice(0, 1000);

  console.log(`✅ ${top1000.length} communes sélectionnées. Connexion à PostgreSQL...`);
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("🛠️ Préparation de la table cities...");
  await client.query(`
    CREATE TABLE IF NOT EXISTS cities (
      insee_code VARCHAR(5) PRIMARY KEY,
      postal_code VARCHAR(5) NOT NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      department_code VARCHAR(3) NOT NULL,
      department_name VARCHAR(255) NOT NULL,
      region_name VARCHAR(255) NOT NULL,
      population INTEGER,
      score_overall NUMERIC(3, 1),
      score_security NUMERIC(3, 1),
      score_education NUMERIC(3, 1),
      score_amenities NUMERIC(3, 1),
      score_real_estate NUMERIC(3, 1),
      score_nature NUMERIC(3, 1),
      avg_price_sqm_house NUMERIC,
      avg_price_sqm_apt NUMERIC,
      ai_synthesis TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
    CREATE INDEX IF NOT EXISTS idx_cities_department ON cities(department_code);
  `);

  console.log("🚀 Insertion en base...");
  let count = 0;
  for (const c of top1000) {
    const postal = c.codesPostaux[0];
    const slug = createSlug(c.nom, postal);
    const synth = `${c.nom} est une commune de ${c.population.toLocaleString('fr-FR')} habitants située en ${c.region.nom} (${c.departement.nom}).`;

    const query = `
      INSERT INTO cities (
        insee_code, postal_code, name, slug, department_code, department_name, region_name,
        population, score_overall, score_security, score_education, score_amenities, score_real_estate, score_nature,
        avg_price_sqm_house, avg_price_sqm_apt, ai_synthesis
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      )
      ON CONFLICT (insee_code) DO NOTHING;
    `;

    await client.query(query, [
      c.code, postal, c.nom, slug, c.departement.code, c.departement.nom, c.region.nom,
      c.population, randomScore(), randomScore(), randomScore(), randomScore(), randomScore(), randomScore(),
      randomPrice(), randomPrice(), synth
    ]);

    count++;
    if (count % 100 === 0) {
      console.log(`⏳ ${count} / ${top1000.length} communes synchronisées...`);
    }
  }

  await client.end();
  console.log(`✨ Ingestion terminée : ${count} communes prêtes dans PostgreSQL.`);
}

main().catch(err => {
  console.error("❌ Erreur :", err.message);
  process.exit(1);
});
