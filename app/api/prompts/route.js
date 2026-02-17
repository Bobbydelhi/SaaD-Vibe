import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    // 1. Conectamos a la Base de Datos
    const pool = await getDb();

    // 2. Pedimos los prompts con sus categorías y herramientas
    const result = await pool.request().query(`
      SELECT TOP 50 
        P.PromptId, 
        P.Title, 
        P.Content, 
        P.VoteCount, 
        T.Name as ToolName, 
        C.Name as CategoryName
      FROM Prompts P
      JOIN Tools T ON P.ToolId = T.ToolId
      JOIN Categories C ON T.CategoryId = C.CategoryId
      ORDER BY P.VoteCount DESC
    `);

    // 3. Devolvemos los datos en formato JSON
    return NextResponse.json(result.recordset);

  } catch (error) {
    console.error("Error obteniendo prompts:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}