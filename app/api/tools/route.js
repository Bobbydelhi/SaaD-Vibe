import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDb();
    const result = await pool.request().query(`
      SELECT TOP 20 T.ToolId, T.Name, T.Slug, T.Description, T.Rating, C.Name as CategoryName
      FROM Tools T
      JOIN Categories C ON T.CategoryId = C.CategoryId
      WHERE T.IsActive = 1
      ORDER BY T.Rating DESC
    `);
    
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}