import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ cities: [] });
  }

  const query = `
    SELECT name, slug, postal_code, department_name, population
    FROM cities
    WHERE name ILIKE $1 OR postal_code LIKE $2
    ORDER BY population DESC
    LIMIT 8
  `;

  const result = await pool.query(query, [`${q}%`, `${q}%`]);

  return new NextResponse(JSON.stringify({ cities: result.rows }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}