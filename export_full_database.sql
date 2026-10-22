-- =====================================================================
-- InfosVilles — Export complet de la base de données
-- Généré le 2026-10-22
--
-- Ce fichier contient :
--   1. Le schéma complet (CREATE TABLE, contraintes, index, RLS)
--   2. Toutes les données actuelles (INSERT) pour les 7 tables
--
-- Compatible PostgreSQL 14+.
-- Pour import sur un VPS : psql -U <user> -d <dbname> -f export_full_database.sql
-- =====================================================================

-- Extension pour gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- ====== site_metadata ======
CREATE TABLE IF NOT EXISTS site_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =====================================================================
-- Row Level Security (RLS)
-- =====================================================================

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE communes ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE commune_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE strengths ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_metadata ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
DROP POLICY IF EXISTS "public_read_departments" ON departments;
CREATE POLICY "public_read_departments" ON departments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_communes" ON communes;
CREATE POLICY "public_read_communes" ON communes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_indicators" ON indicators;
CREATE POLICY "public_read_indicators" ON indicators
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_commune_indicators" ON commune_indicators;
CREATE POLICY "public_read_commune_indicators" ON commune_indicators
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_strengths" ON strengths;
CREATE POLICY "public_read_strengths" ON strengths
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "public_insert_testimonials" ON testimonials;
CREATE POLICY "public_insert_testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_site_metadata" ON site_metadata;
CREATE POLICY "public_read_site_metadata" ON site_metadata
  FOR SELECT USING (true);

-- =====================================================================
-- DONNÉES
-- =====================================================================

-- ====== departments (6 lignes) ======
INSERT INTO departments (id, code, name, region, slug, is_demo) VALUES
('d3da7268-c662-4d51-a2ae-7f7a4dde46be', '13', 'Bouches-du-Rhône', 'Provence-Alpes-Côte d''Azur', 'bouches-du-rhone', true),
('e92ace84-eb8b-4519-8bf9-e26a5508fa43', '31', 'Haute-Garonne', 'Occitanie', 'haute-garonne', true),
('c4c5788d-2b18-47b8-954a-0167812f60c0', '44', 'Loire-Atlantique', 'Pays de la Loire', 'loire-atlantique', true),
('2dc4aa22-1492-438d-97e3-7c4ef782d2d3', '67', 'Bas-Rhin', 'Grand Est', 'bas-rhin', true),
('15bb5e06-2b28-4753-815e-4c2c16f723a9', '69', 'Rhône', 'Auvergne-Rhône-Alpes', 'rhone', true),
('2c3041e5-58e5-46e0-9b08-6517e3dfbdec', '75', 'Paris', 'Île-de-France', 'paris', true)
ON CONFLICT (code) DO NOTHING;

-- ====== communes (6 lignes) ======
INSERT INTO communes (id, slug, name, postal_code, department_code, region, population, area_km2, latitude, longitude, short_description, is_demo) VALUES
('652b3361-8476-418a-bb0d-608b449d609f', 'paris-7e', 'Paris 7e arrondissement', '75007', '75', 'Île-de-France', 52300, 4.09, 48.8546, 2.3113, 'Arrondissement central de Paris, entre Tour Eiffel, Invalides et musées. (Exemple de démonstration)', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'marseille-8e', 'Marseille 8e arrondissement', '13008', '13', 'Provence-Alpes-Côte d''Azur', 76800, 22.43, 43.2697, 5.3837, 'Secteur littoral et résidentiel de Marseille, du Roucas-Blanc à la Pointe Rouge. (Exemple de démonstration)', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'lyon-6e', 'Lyon 6e arrondissement', '69006', '69', 'Auvergne-Rhône-Alpes', 50500, 3.78, 45.7674, 4.8557, 'Quartier bourgeois de Lyon, entre Parc de la Tête d''Or et commerce de prestige. (Exemple de démonstration)', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'nantes-centre', 'Nantes Centre', '44000', '44', 'Pays de la Loire', 147000, 6.68, 47.2184, -1.5534, 'Hyper-centre de Nantes, cœur historique et culturel de la métropole. (Exemple de démonstration)', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'toulouse-centre', 'Toulouse Centre', '31000', '31', 'Occitanie', 156000, 11.83, 43.6043, 1.4428, 'Centre historique de Toulouse, la Ville Rose. (Exemple de démonstration)', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'strasbourg-centre', 'Strasbourg Centre', '67000', '67', 'Grand Est', 145000, 8.43, 48.5734, 7.7521, 'Centre de Strasbourg, capitale européenne, cœur historique classé UNESCO. (Exemple de démonstration)', true)
ON CONFLICT (slug) DO NOTHING;

-- ====== indicators (10 lignes) ======
INSERT INTO indicators (id, key, label, category, unit, source_name, source_url, description, is_demo) VALUES
('e5b65776-a9a5-4524-a8a9-a245435360cd', 'median_price_m2', 'Prix médian au m²', 'Logement', '€/m²', 'Notaires de France (Exemple)', 'https://www.notaires.fr', 'Prix médian des transactions immobilières (Exemple de démonstration)', true),
('4dbc6514-74b7-4b95-b828-76e9e8791930', 'rental_yield', 'Rendement locatif', 'Logement', '%', 'CLAMEUR (Exemple)', 'https://www.clameur.fr', 'Rendement locatif annuel moyen (Exemple de démonstration)', true),
('913710d6-1a23-4804-8263-01028f47b891', 'unemployment_rate', 'Taux de chômage', 'Emploi', '%', 'INSEE (Exemple)', 'https://www.insee.fr', 'Taux de chômage au sens du BIT (Exemple de démonstration)', true),
('808457f2-76c9-4fa2-b480-c9204752d0cf', 'average_income', 'Revenu médian', 'Économie', '€/an', 'INSEE (Exemple)', 'https://www.insee.fr', 'Revenu médian des ménages (Exemple de démonstration)', true),
('161068c9-fec2-4fcd-b201-abe065d4b946', 'crime_rate', 'Incidence de la délinquance', 'Sécurité', '‰', 'SSMSI (Exemple)', 'https://www.interieur.gouv.fr', 'Indicateur de délinquance (Exemple de démonstration)', true),
('628475fc-ea44-4b39-9078-0c6e644d8b12', 'school_score', 'Indice scolaire', 'Éducation', '/20', 'Éducation nationale (Exemple)', 'https://www.education.gouv.fr', 'Indice synthétique scolaire (Exemple de démonstration)', true),
('517dc2a2-1a14-4866-a20a-df47456a2da7', 'transport_score', 'Desserte transports', 'Transport', '/10', 'OpenStreetMap (Exemple)', 'https://www.openstreetmap.org', 'Qualité de la desserte en transports (Exemple de démonstration)', true),
('cfa667b8-6ef1-4b3f-9334-372bdd1ed890', 'green_space_pct', 'Espaces verts', 'Cadre de vie', '%', 'Corine Land Cover (Exemple)', 'https://land.copernicus.eu', 'Part d''espaces verts et naturels (Exemple de démonstration)', true),
('5f4235f5-dbf1-4fc1-a6d2-9240772426f9', 'air_quality', 'Qualité de l''air', 'Cadre de vie', '/10', 'ATMO France (Exemple)', 'https://www.atmo-france.org', 'Indice de qualité de l''air (Exemple de démonstration)', true),
('2e9aa5d2-aa36-4a0c-94dd-0763bbb65b54', 'shops_per_1000', 'Commerces de proximité', 'Services', '/1000 hab', 'INSEE - SIRENE (Exemple)', 'https://www.insee.fr', 'Nombre de commerces pour 1000 habitants (Exemple de démonstration)', true)
ON CONFLICT (key) DO NOTHING;

-- ====== commune_indicators (60 lignes) ======

-- Paris 7e
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo) VALUES
('652b3361-8476-418a-bb0d-608b449d609f', 'median_price_m2', 11800.0000, '11 800 €/m²', '2024-01-15', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'rental_yield', 3.1000, '3,1 %', '2024-01-15', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'unemployment_rate', 5.4000, '5,4 %', '2024-01-15', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'average_income', 52000.0000, '52 000 €/an', '2024-01-15', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'crime_rate', 28.5000, '28,5 ‰', '2024-01-15', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'school_score', 17.5000, '17,5/20', '2024-01-15', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'transport_score', 9.5000, '9,5/10', '2024-01-15', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'green_space_pct', 22.0000, '22 %', '2024-01-15', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'air_quality', 6.5000, '6,5/10', '2024-01-15', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'shops_per_1000', 18.2000, '18,2/1000', '2024-01-15', true)
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Marseille 8e
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo) VALUES
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'median_price_m2', 4900.0000, '4 900 €/m²', '2024-01-15', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'rental_yield', 4.8000, '4,8 %', '2024-01-15', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'unemployment_rate', 11.2000, '11,2 %', '2024-01-15', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'average_income', 27500.0000, '27 500 €/an', '2024-01-15', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'crime_rate', 52.3000, '52,3 ‰', '2024-01-15', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'school_score', 12.5000, '12,5/20', '2024-01-15', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'transport_score', 6.0000, '6,0/10', '2024-01-15', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'green_space_pct', 35.0000, '35 %', '2024-01-15', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'air_quality', 7.0000, '7,0/10', '2024-01-15', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'shops_per_1000', 11.0000, '11/1000', '2024-01-15', true)
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Lyon 6e
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo) VALUES
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'median_price_m2', 6100.0000, '6 100 €/m²', '2024-01-15', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'rental_yield', 3.6000, '3,6 %', '2024-01-15', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'unemployment_rate', 7.1000, '7,1 %', '2024-01-15', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'average_income', 41500.0000, '41 500 €/an', '2024-01-15', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'crime_rate', 35.2000, '35,2 ‰', '2024-01-15', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'school_score', 16.0000, '16,0/20', '2024-01-15', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'transport_score', 8.0000, '8,0/10', '2024-01-15', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'green_space_pct', 28.0000, '28 %', '2024-01-15', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'air_quality', 7.5000, '7,5/10', '2024-01-15', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'shops_per_1000', 15.5000, '15,5/1000', '2024-01-15', true)
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Nantes Centre
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo) VALUES
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'median_price_m2', 4200.0000, '4 200 €/m²', '2024-01-15', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'rental_yield', 4.2000, '4,2 %', '2024-01-15', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'unemployment_rate', 8.5000, '8,5 %', '2024-01-15', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'average_income', 31200.0000, '31 200 €/an', '2024-01-15', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'crime_rate', 39.0000, '39,0 ‰', '2024-01-15', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'school_score', 14.5000, '14,5/20', '2024-01-15', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'transport_score', 8.5000, '8,5/10', '2024-01-15', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'green_space_pct', 24.0000, '24 %', '2024-01-15', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'air_quality', 8.0000, '8,0/10', '2024-01-15', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'shops_per_1000', 14.0000, '14/1000', '2024-01-15', true)
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Toulouse Centre
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo) VALUES
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'median_price_m2', 3800.0000, '3 800 €/m²', '2024-01-15', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'rental_yield', 4.5000, '4,5 %', '2024-01-15', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'unemployment_rate', 9.2000, '9,2 %', '2024-01-15', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'average_income', 29800.0000, '29 800 €/an', '2024-01-15', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'crime_rate', 41.5000, '41,5 ‰', '2024-01-15', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'school_score', 13.8000, '13,8/20', '2024-01-15', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'transport_score', 7.5000, '7,5/10', '2024-01-15', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'green_space_pct', 18.0000, '18 %', '2024-01-15', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'air_quality', 7.5000, '7,5/10', '2024-01-15', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'shops_per_1000', 13.5000, '13,5/1000', '2024-01-15', true)
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- Strasbourg Centre
INSERT INTO commune_indicators (commune_id, indicator_key, value, value_label, updated_at, is_demo) VALUES
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'median_price_m2', 3600.0000, '3 600 €/m²', '2024-01-15', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'rental_yield', 4.3000, '4,3 %', '2024-01-15', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'unemployment_rate', 8.8000, '8,8 %', '2024-01-15', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'average_income', 30600.0000, '30 600 €/an', '2024-01-15', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'crime_rate', 37.2000, '37,2 ‰', '2024-01-15', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'school_score', 14.0000, '14,0/20', '2024-01-15', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'transport_score', 8.8000, '8,8/10', '2024-01-15', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'green_space_pct', 26.0000, '26 %', '2024-01-15', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'air_quality', 7.5000, '7,5/10', '2024-01-15', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'shops_per_1000', 13.0000, '13/1000', '2024-01-15', true)
ON CONFLICT (commune_id, indicator_key) DO NOTHING;

-- ====== strengths (24 lignes) ======
INSERT INTO strengths (commune_id, label, type, category, is_demo) VALUES
-- Paris 7e
('652b3361-8476-418a-bb0d-608b449d609f', 'Accès métro/RER exceptionnel', 'strength', 'Transport', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'Densité d''équipements culturels', 'strength', 'Cadre de vie', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'Prix de l''immobilier très élevé', 'limitation', 'Logement', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'Trafic automobile dense', 'limitation', 'Cadre de vie', true),
-- Marseille 8e
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'Proimité littoral et plages', 'strength', 'Cadre de vie', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'Espaces verts généreux', 'strength', 'Cadre de vie', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'Desserte transports limitée', 'limitation', 'Transport', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'Insécurité ressentie signalée', 'limitation', 'Sécurité', true),
-- Lyon 6e
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'Parc de la Tête d''Or', 'strength', 'Cadre de vie', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'Offre scolaire réputée', 'strength', 'Éducation', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'Coût de la vie élevé', 'limitation', 'Économie', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'Stationnement difficile', 'limitation', 'Transport', true),
-- Nantes Centre
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'Dynamisme économique et étudiant', 'strength', 'Économie', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'Réseau de transports étendu', 'strength', 'Transport', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'Tension sur le logement', 'limitation', 'Logement', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'Qualité de l''air en progrès', 'strength', 'Cadre de vie', true),
-- Toulouse Centre
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'Bassin d''emploi aéronautique', 'strength', 'Économie', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'Vie étudiante intense', 'strength', 'Éducation', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'Congestion routière aux heures de pointe', 'limitation', 'Transport', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'Espaces verts centraux limités', 'limitation', 'Cadre de vie', true),
-- Strasbourg Centre
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'Réseau vélo et tramway exemplaire', 'strength', 'Transport', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'Patrimoine UNESCO', 'strength', 'Cadre de vie', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'Marché immobilier tendu', 'limitation', 'Logement', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'Hivers rigoureux', 'limitation', 'Cadre de vie', true)
ON CONFLICT DO NOTHING;

-- ====== testimonials (7 lignes) ======
INSERT INTO testimonials (commune_id, author_name, rating, title, body, resident_since, status, is_demo) VALUES
('652b3361-8476-418a-bb0d-608b449d609f', 'Anne', 4, 'Quartier sûr et prestigieux', 'Habiter près du Champ-de-Mars reste un privilège. Les écoles sont excellentes. (Exemple de démonstration)', 2018, 'approved', true),
('652b3361-8476-418a-bb0d-608b449d609f', 'Marc', 3, 'Trop cher pour les familles', 'Magnifique mais le budget logement est écrasant. (Exemple de démonstration)', 2015, 'approved', true),
('d3192d3a-c08b-4c7f-b684-1794defe1e72', 'Sophie', 5, 'Bord de mer au quotidien', 'Les plages à pied, le soleil, c''est un quotidien rare. (Exemple de démonstration)', 2020, 'approved', true),
('dbf7d369-496e-48ee-8925-ebf20b0d69b5', 'Julien', 4, 'Parfait pour les enfants', 'Le parc et les écoles en font un secteur familial idéal. (Exemple de démonstration)', 2017, 'approved', true),
('dfe64cd3-fa63-427b-a864-c08cbd6cf446', 'Camille', 5, 'Ville qui bouge', 'Culture, transports, entrepreneuriat : Nantes est vivante. (Exemple de démonstration)', 2019, 'approved', true),
('c42a50ab-6874-4bfb-ad4c-42ec8d77b258', 'Karim', 4, 'Emploi et jeunesse', 'L''emploi aéronautique attire, et l''ambiance étudiante est top. (Exemple de démonstration)', 2021, 'approved', true),
('ea7fe31e-eaf7-4a9a-915d-ceb83a17b51d', 'Léa', 5, 'À vélo partout', 'Avoir tout à vélo, c''est devenu indispensable. (Exemple de démonstration)', 2016, 'approved', true)
ON CONFLICT DO NOTHING;

-- ====== site_metadata (0 ligne — table vide) ======
-- Aucune donnée pour l''instant.

-- =====================================================================
-- Fin de l''export
-- Vérification : SELECT count(*) FROM <table> pour contrôler les imports
--   departments         → 6
--   communes            → 6
--   indicators          → 10
--   commune_indicators  → 60
--   strengths           → 24
--   testimonials        → 7
--   site_metadata       → 0
-- =====================================================================
