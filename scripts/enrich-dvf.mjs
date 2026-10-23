import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    // Récupérer les communes sans prix réels
    const res = await client.query('SELECT insee_code, name FROM cities WHERE insee_code IS NOT NULL');
    const cities = res.rows;
    console.log(`🔍 Enrichissement DVF pour ${cities.length} communes...`);

    let updated = 0;
    for (const city of cities) {
      try {
        // API ouverte DVF Etalab (données de ventes consolidées)
        const url = `https://api.cquest.org/dvf?code_commune=${city.insee_code}`;
        const resp = await fetch(url);
        
        if (!resp.ok) continue;
        const data = await resp.json();

        if (data && data.features && data.features.length > 0) {
          // Filtrer les mutations significatives de l'année précédente
          const mutations = data.features.map(f => f.properties).filter(p => p.valeur_fonciere && p.surface_relle_bati);
          
          const apts = mutations.filter(p => p.type_local === 'Appartement' && p.surface_relle_bati > 10);
          const houses = mutations.filter(p => p.type_local === 'Maison' && p.surface_relle_bati > 20);

          const avgApt = apts.length 
            ? Math.round(apts.reduce((acc, p) => acc + (p.valeur_fonciere / p.surface_relle_bati), 0) / apts.length)
            : null;

          const avgHouse = houses.length 
            ? Math.round(houses.reduce((acc, p) => acc + (p.valeur_fonciere / p.surface_relle_bati), 0) / houses.length)
            : null;

          if (avgApt || avgHouse) {
            await client.query(`
              UPDATE cities 
              SET 
                avg_price_sqm_apt = COALESCE($1, avg_price_sqm_apt),
                avg_price_sqm_house = COALESCE($2, avg_price_sqm_house)
              WHERE insee_code = $3
            `, [avgApt, avgHouse, city.insee_code]);
            updated++;
          }
        }

        // Petite pause pour ne pas saturer l'API publique
        await new Promise(r => setTimeout(r, 60));

        if (updated > 0 && updated % 50 === 0) {
          console.log(`⏳ ${updated} communes enrichies avec les prix réels...`);
        }
      } catch (err) {
        // Ignorer silencieusement une erreur ponctuelle sur une commune
      }
    }

    console.log(`✅ Enrichissement terminé : ${updated} communes mises à jour avec les chiffres DVF.`);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);