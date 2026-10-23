"use server";

import pool from "@/lib/db";
import { rowToCompareColumn, type CompareColumn, type CompareEntry } from "@/lib/compare";

export async function loadCompareColumns(slugs: string[]): Promise<CompareColumn[]> {
  if (!slugs || !slugs.length) return [];
  const res = await pool.query(`SELECT * FROM cities WHERE slug = ANY($1::text[])`, [slugs]);
  const bySlug = new Map(res.rows.map((r) => [r.slug, r]));
  return slugs.map((s) => bySlug.get(s)).filter(Boolean).map(rowToCompareColumn);
}

export async function getAllCompareEntries(): Promise<CompareEntry[]> {
  const res = await pool.query(`SELECT slug, name, postal_code, region_name FROM cities ORDER BY population DESC`);
  return res.rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    postalCode: r.postal_code || "",
    region: r.region_name || "",
    isDemo: false,
    source: "local",
  }));
}