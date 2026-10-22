/*
# InfosVilles — schéma principal

Crée les tables pour la plateforme InfosVilles.com d'analyse du cadre de vie
et de l'immobilier des communes françaises.

## 1. Nouvelles tables
- `departments` : départements français (code, nom, région).
- `communes` : communes (slug, nom, code postal, département, population, coordonnées).
- `indicators` : définitions d'indicateurs (logement, emploi, transport, etc.) avec source et unité.
- `commune_indicators` : valeurs d'indicateurs par commune, avec date de mise à jour.
- `strengths` : points forts/limites synthétiques par commune (libellé, type, catégorie).
- `testimonials` : témoignages d'habitants (modérés, non vérifiés par défaut).
- `metadata` : table générique clé/valeur pour la config du site.

## 2. Sécurité (RLS)
- RLS activée sur toutes les tables.
- Lecture publique (anon + authenticated) sur les tables de contenu.
- Insertion publique pour `testimonials` (les avis habitants sont soumis par les visiteurs),
  modération via la colonne `status`.
- Pas de mise à jour / suppression publique : réservé à l'administration (policies authenticated
  sur les tables de référence — pas implémenté ici car pas d'écran admin demandé).

## 3. Données de démonstration
- Toutes les données insérées sont ÉTIQUETÉES « Exemple de démonstration » via la colonne
  `is_demo` sur `communes` et `commune_indicators`, et le statut explicite dans les libellés.
- Ces données seront remplacées par des sources réelles (Insee, Notaires de France, etc.).
*/

-- ====== departments ======
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  region text NOT NULL,
  slug text NOT NULL UNIQUE,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_departments" ON departments;
CREATE POLICY "public_read_departments" ON departments
  FOR SELECT TO anon, authenticated USING (true);

-- ====== communes ======
CREATE TABLE IF NOT EXISTS communes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  postal_code text NOT NULL,
  department_code text NOT NULL REFERENCES departments(code) ON DELETE CASCADE,
  region text NOT NULL,
  population integer NOT NULL DEFAULT 0,
  area_km2 numeric(10,2) DEFAULT 0,
  latitude numeric(9,6),
  longitude numeric(9,6),
  short_description text,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_communes_department ON communes(department_code);
CREATE INDEX IF NOT EXISTS idx_communes_name ON communes(name);
CREATE INDEX IF NOT EXISTS idx_communes_slug ON communes(slug);

ALTER TABLE communes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_communes" ON communes;
CREATE POLICY "public_read_communes" ON communes
  FOR SELECT TO anon, authenticated USING (true);

-- ====== indicators ======
CREATE TABLE IF NOT EXISTS indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  category text NOT NULL,
  unit text,
  source_name text NOT NULL,
  source_url text,
  description text,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_indicators" ON indicators;
CREATE POLICY "public_read_indicators" ON indicators
  FOR SELECT TO anon, authenticated USING (true);

-- ====== commune_indicators ======
CREATE TABLE IF NOT EXISTS commune_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commune_id uuid NOT NULL REFERENCES communes(id) ON DELETE CASCADE,
  indicator_key text NOT NULL REFERENCES indicators(key) ON DELETE CASCADE,
  value numeric(14,4) NOT NULL,
  value_label text,
  updated_at date NOT NULL DEFAULT CURRENT_DATE,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE (commune_id, indicator_key)
);
CREATE INDEX IF NOT EXISTS idx_ci_commune ON commune_indicators(commune_id);

ALTER TABLE commune_indicators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_commune_indicators" ON commune_indicators;
CREATE POLICY "public_read_commune_indicators" ON commune_indicators
  FOR SELECT TO anon, authenticated USING (true);

-- ====== strengths ======
CREATE TABLE IF NOT EXISTS strengths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commune_id uuid NOT NULL REFERENCES communes(id) ON DELETE CASCADE,
  label text NOT NULL,
  type text NOT NULL CHECK (type IN ('strength','limitation')),
  category text NOT NULL,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_strengths_commune ON strengths(commune_id);

ALTER TABLE strengths ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_strengths" ON strengths;
CREATE POLICY "public_read_strengths" ON strengths
  FOR SELECT TO anon, authenticated USING (true);

-- ====== testimonials ======
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commune_id uuid NOT NULL REFERENCES communes(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  body text NOT NULL,
  resident_since integer,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_testimonials_commune ON testimonials(commune_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials
  FOR SELECT TO anon, authenticated USING (status = 'approved');

DROP POLICY IF EXISTS "public_insert_testimonials" ON testimonials;
CREATE POLICY "public_insert_testimonials" ON testimonials
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ====== metadata ======
CREATE TABLE IF NOT EXISTS site_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_metadata ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_site_metadata" ON site_metadata;
CREATE POLICY "public_read_site_metadata" ON site_metadata
  FOR SELECT TO anon, authenticated USING (true);

-- ====== Données de démonstration ======
-- Départements (Exemple de démonstration)
INSERT INTO departments (code, name, region, slug, is_demo) VALUES
('75','Paris','Île-de-France','paris',true),
('13','Bouches-du-Rhône','Provence-Alpes-Côte d''Azur','bouches-du-rhone',true),
('69','Rhône','Auvergne-Rhône-Alpes','rhone',true),
('44','Loire-Atlantique','Pays de la Loire','loire-atlantique',true),
('31','Haute-Garonne','Occitanie','haute-garonne',true),
('67','Bas-Rhin','Grand Est','bas-rhin',true)
ON CONFLICT (code) DO NOTHING;

-- Indicateurs (Exemple de démonstration)
INSERT INTO indicators (key, label, category, unit, source_name, source_url, description, is_demo) VALUES
('median_price_m2','Prix médian au m²','Logement','€/m²','Notaires de France (Exemple)','https://www.notaires.fr','Prix médian des transactions immobilières (Exemple de démonstration)',true),
('rental_yield','Rendement locatif','Logement','%','CLAMEUR (Exemple)','https://www.clameur.fr','Rendement locatif annuel moyen (Exemple de démonstration)',true),
('unemployment_rate','Taux de chômage','Emploi','%','INSEE (Exemple)','https://www.insee.fr','Taux de chômage au sens du BIT (Exemple de démonstration)',true),
('average_income','Revenu médian','Économie','€/an','INSEE (Exemple)','https://www.insee.fr','Revenu médian des ménages (Exemple de démonstration)',true),
('crime_rate','Incidence de la délinquance','Sécurité','‰','SSMSI (Exemple)','https://www.interieur.gouv.fr','Indicateur de délinquance (Exemple de démonstration)',true),
('school_score','Indice scolaire','Éducation','/20','Éducation nationale (Exemple)','https://www.education.gouv.fr','Indice synthétique scolaire (Exemple de démonstration)',true),
('transport_score','Desserte transports','Transport','/10','OpenStreetMap (Exemple)','https://www.openstreetmap.org','Qualité de la desserte en transports (Exemple de démonstration)',true),
('green_space_pct','Espaces verts','Cadre de vie','%','Corine Land Cover (Exemple)','https://land.copernicus.eu','Part d''espaces verts et naturels (Exemple de démonstration)',true),
('air_quality','Qualité de l''air','Cadre de vie','/10','ATMO France (Exemple)','https://www.atmo-france.org','Indice de qualité de l''air (Exemple de démonstration)',true),
('shops_per_1000','Commerces de proximité','Services','/1000 hab','INSEE - SIRENE (Exemple)','https://www.insee.fr','Nombre de commerces pour 1000 habitants (Exemple de démonstration)',true)
ON CONFLICT (key) DO NOTHING;

-- Communes (Exemple de démonstration)
INSERT INTO communes (slug, name, postal_code, department_code, region, population, area_km2, latitude, longitude, short_description, is_demo) VALUES
('paris-7e','Paris 7e arrondissement','75007','75','Île-de-France',52300,4.09,48.8546,2.3113,'Arrondissement central de Paris, entre Tour Eiffel, Invalides et musées. (Exemple de démonstration)',true),
('marseille-8e','Marseille 8e arrondissement','13008','13','Provence-Alpes-Côte d''Azur',76800,22.43,43.2697,5.3837,'Secteur littoral et résidentiel de Marseille, du Roucas-Blanc à la Pointe Rouge. (Exemple de démonstration)',true),
('lyon-6e','Lyon 6e arrondissement','69006','69','Auvergne-Rhône-Alpes',50500,3.78,45.7674,4.8557,'Quartier bourgeois de Lyon, entre Parc de la Tête d''Or et commerce de prestige. (Exemple de démonstration)',true),
('nantes-centre','Nantes Centre','44000','44','Pays de la Loire',147000,6.68,47.2184,-1.5534,'Hyper-centre de Nantes, cœur historique et culturel de la métropole. (Exemple de démonstration)',true),
('toulouse-centre','Toulouse Centre','31000','31','Occitanie',156000,11.83,43.6043,1.4428,'Centre historique de Toulouse, la Ville Rose. (Exemple de démonstration)',true),
('strasbourg-centre','Strasbourg Centre','67000','67','Grand Est',145000,8.43,48.5734,7.7521,'Centre de Strasbourg, capitale européenne, cœur historique classé UNESCO. (Exemple de démonstration)',true)
ON CONFLICT (slug) DO NOTHING;

-- Valeurs d'indicateurs (Exemple de démonstration)
-- Paris 7e
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo)
SELECT c.id, k.v_key, k.v_val, k.v_label, k.v_date, true
FROM communes c
CROSS JOIN (VALUES
  ('median_price_m2', 11800, '11 800 €/m²', '2024-01-15'::date),
  ('rental_yield', 3.1, '3,1 %', '2024-01-15'::date),
  ('unemployment_rate', 5.4, '5,4 %', '2024-01-15'::date),
  ('average_income', 52000, '52 000 €/an', '2024-01-15'::date),
  ('crime_rate', 28.5, '28,5 ‰', '2024-01-15'::date),
  ('school_score', 17.5, '17,5/20', '2024-01-15'::date),
  ('transport_score', 9.5, '9,5/10', '2024-01-15'::date),
  ('green_space_pct', 22.0, '22 %', '2024-01-15'::date),
  ('air_quality', 6.5, '6,5/10', '2024-01-15'::date),
  ('shops_per_1000', 18.2, '18,2/1000', '2024-01-15'::date)
) AS k(v_key, v_val, v_label, v_date)
WHERE c.slug = 'paris-7e'
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Marseille 8e
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo)
SELECT c.id, k.v_key, k.v_val, k.v_label, k.v_date, true
FROM communes c
CROSS JOIN (VALUES
  ('median_price_m2', 4900, '4 900 €/m²', '2024-01-15'::date),
  ('rental_yield', 4.8, '4,8 %', '2024-01-15'::date),
  ('unemployment_rate', 11.2, '11,2 %', '2024-01-15'::date),
  ('average_income', 27500, '27 500 €/an', '2024-01-15'::date),
  ('crime_rate', 52.3, '52,3 ‰', '2024-01-15'::date),
  ('school_score', 12.5, '12,5/20', '2024-01-15'::date),
  ('transport_score', 6.0, '6,0/10', '2024-01-15'::date),
  ('green_space_pct', 35.0, '35 %', '2024-01-15'::date),
  ('air_quality', 7.0, '7,0/10', '2024-01-15'::date),
  ('shops_per_1000', 11.0, '11/1000', '2024-01-15'::date)
) AS k(v_key, v_val, v_label, v_date)
WHERE c.slug = 'marseille-8e'
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Lyon 6e
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo)
SELECT c.id, k.v_key, k.v_val, k.v_label, k.v_date, true
FROM communes c
CROSS JOIN (VALUES
  ('median_price_m2', 6100, '6 100 €/m²', '2024-01-15'::date),
  ('rental_yield', 3.6, '3,6 %', '2024-01-15'::date),
  ('unemployment_rate', 7.1, '7,1 %', '2024-01-15'::date),
  ('average_income', 41500, '41 500 €/an', '2024-01-15'::date),
  ('crime_rate', 35.2, '35,2 ‰', '2024-01-15'::date),
  ('school_score', 16.0, '16,0/20', '2024-01-15'::date),
  ('transport_score', 8.0, '8,0/10', '2024-01-15'::date),
  ('green_space_pct', 28.0, '28 %', '2024-01-15'::date),
  ('air_quality', 7.5, '7,5/10', '2024-01-15'::date),
  ('shops_per_1000', 15.5, '15,5/1000', '2024-01-15'::date)
) AS k(v_key, v_val, v_label, v_date)
WHERE c.slug = 'lyon-6e'
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Nantes Centre
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo)
SELECT c.id, k.v_key, k.v_val, k.v_label, k.v_date, true
FROM communes c
CROSS JOIN (VALUES
  ('median_price_m2', 4200, '4 200 €/m²', '2024-01-15'::date),
  ('rental_yield', 4.2, '4,2 %', '2024-01-15'::date),
  ('unemployment_rate', 8.5, '8,5 %', '2024-01-15'::date),
  ('average_income', 31200, '31 200 €/an', '2024-01-15'::date),
  ('crime_rate', 39.0, '39,0 ‰', '2024-01-15'::date),
  ('school_score', 14.5, '14,5/20', '2024-01-15'::date),
  ('transport_score', 8.5, '8,5/10', '2024-01-15'::date),
  ('green_space_pct', 24.0, '24 %', '2024-01-15'::date),
  ('air_quality', 8.0, '8,0/10', '2024-01-15'::date),
  ('shops_per_1000', 14.0, '14/1000', '2024-01-15'::date)
) AS k(v_key, v_val, v_label, v_date)
WHERE c.slug = 'nantes-centre'
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Toulouse Centre
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo)
SELECT c.id, k.v_key, k.v_val, k.v_label, k.v_date, true
FROM communes c
CROSS JOIN (VALUES
  ('median_price_m2', 3800, '3 800 €/m²', '2024-01-15'::date),
  ('rental_yield', 4.5, '4,5 %', '2024-01-15'::date),
  ('unemployment_rate', 9.2, '9,2 %', '2024-01-15'::date),
  ('average_income', 29800, '29 800 €/an', '2024-01-15'::date),
  ('crime_rate', 41.5, '41,5 ‰', '2024-01-15'::date),
  ('school_score', 13.8, '13,8/20', '2024-01-15'::date),
  ('transport_score', 7.5, '7,5/10', '2024-01-15'::date),
  ('green_space_pct', 18.0, '18 %', '2024-01-15'::date),
  ('air_quality', 7.5, '7,5/10', '2024-01-15'::date),
  ('shops_per_1000', 13.5, '13,5/1000', '2024-01-15'::date)
) AS k(v_key, v_val, v_label, v_date)
WHERE c.slug = 'toulouse-centre'
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Strasbourg Centre
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo)
SELECT c.id, k.v_key, k.v_val, k.v_label, k.v_date, true
FROM communes c
CROSS JOIN (VALUES
  ('median_price_m2', 3600, '3 600 €/m²', '2024-01-15'::date),
  ('rental_yield', 4.3, '4,3 %', '2024-01-15'::date),
  ('unemployment_rate', 8.8, '8,8 %', '2024-01-15'::date),
  ('average_income', 30600, '30 600 €/an', '2024-01-15'::date),
  ('crime_rate', 37.2, '37,2 ‰', '2024-01-15'::date),
  ('school_score', 14.0, '14,0/20', '2024-01-15'::date),
  ('transport_score', 8.8, '8,8/10', '2024-01-15'::date),
  ('green_space_pct', 26.0, '26 %', '2024-01-15'::date),
  ('air_quality', 7.5, '7,5/10', '2024-01-15'::date),
  ('shops_per_1000', 13.0, '13/1000', '2024-01-15'::date)
) AS k(v_key, v_val, v_label, v_date)
WHERE c.slug = 'strasbourg-centre'
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Points forts / limites (Exemple de démonstration)
INSERT INTO strengths (commune_id, label, type, category, is_demo)
SELECT c.id, s.label, s.type, s.category, true
FROM communes c
JOIN (VALUES
  ('paris-7e','Accès métro/RER exceptionnel','strength','Transport'),
  ('paris-7e','Densité d''équipements culturels','strength','Cadre de vie'),
  ('paris-7e','Prix de l''immobilier très élevé','limitation','Logement'),
  ('paris-7e','Trafic automobile dense','limitation','Cadre de vie'),
  ('marseille-8e','Proimité littoral et plages','strength','Cadre de vie'),
  ('marseille-8e','Espaces verts généreux','strength','Cadre de vie'),
  ('marseille-8e','Desserte transports limitée','limitation','Transport'),
  ('marseille-8e','Insécurité ressentie signalée','limitation','Sécurité'),
  ('lyon-6e','Parc de la Tête d''Or','strength','Cadre de vie'),
  ('lyon-6e','Offre scolaire réputée','strength','Éducation'),
  ('lyon-6e','Coût de la vie élevé','limitation','Économie'),
  ('lyon-6e','Stationnement difficile','limitation','Transport'),
  ('nantes-centre','Dynamisme économique et étudiant','strength','Économie'),
  ('nantes-centre','Réseau de transports étendu','strength','Transport'),
  ('nantes-centre','Tension sur le logement','limitation','Logement'),
  ('nantes-centre','Qualité de l''air en progrès','strength','Cadre de vie'),
  ('toulouse-centre','Bassin d''emploi aéronautique','strength','Économie'),
  ('toulouse-centre','Vie étudiante intense','strength','Éducation'),
  ('toulouse-centre','Congestion routière aux heures de pointe','limitation','Transport'),
  ('toulouse-centre','Espaces verts centraux limités','limitation','Cadre de vie'),
  ('strasbourg-centre','Réseau vélo et tramway exemplaire','strength','Transport'),
  ('strasbourg-centre','Patrimoine UNESCO','strength','Cadre de vie'),
  ('strasbourg-centre','Marché immobilier tendu','limitation','Logement'),
  ('strasbourg-centre','Hivers rigoureux','limitation','Cadre de vie')
) AS s(slug, label, type, category)
ON c.slug = s.slug
ON CONFLICT DO NOTHING;

-- Témoignages approuvés (Exemple de démonstration)
INSERT INTO testimonials (commune_id, author_name, rating, title, body, resident_since, status, is_demo)
SELECT c.id, t.author, t.rating, t.title, t.body, t.since, 'approved', true
FROM communes c
JOIN (VALUES
  ('paris-7e','Anne',4,'Quartier sûr et prestigieux','Habiter près du Champ-de-Mars reste un privilège. Les écoles sont excellentes. (Exemple de démonstration)',2018),
  ('paris-7e','Marc',3,'Trop cher pour les familles','Magnifique mais le budget logement est écrasant. (Exemple de démonstration)',2015),
  ('marseille-8e','Sophie',5,'Bord de mer au quotidien','Les plages à pied, le soleil, c''est un quotidien rare. (Exemple de démonstration)',2020),
  ('lyon-6e','Julien',4,'Parfait pour les enfants','Le parc et les écoles en font un secteur familial idéal. (Exemple de démonstration)',2017),
  ('nantes-centre','Camille',5,'Ville qui bouge','Culture, transports, entrepreneuriat : Nantes est vivante. (Exemple de démonstration)',2019),
  ('toulouse-centre','Karim',4,'Emploi et jeunesse','L''emploi aéronautique attire, et l''ambiance étudiante est top. (Exemple de démonstration)',2021),
  ('strasbourg-centre','Léa',5,'À vélo partout','Avoir tout à vélo, c''est devenu indispensable. (Exemple de démonstration)',2016)
) AS t(slug, author, rating, title, body, since)
ON c.slug = t.slug
ON CONFLICT DO NOTHING;
