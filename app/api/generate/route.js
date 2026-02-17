import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import OpenAI from 'openai';

// Configuración para usar Groq (Gratis) con la librería de OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1' // <--- ESTO ES LA CLAVE
});

export async function POST(req) {
  try {
    const { userInput, categorySlug } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'Input requerido' }, { status: 400 });
    }

    // 1. Conectar a DB
    const pool = await getDb();

    // 2. Recuperar contexto (Los mejores prompts de esa categoría)
    let examples = "";
    try {
      const contextResult = await pool.request()
        .input('slug', categorySlug || 'text')
        .query(`
          SELECT TOP 2 P.Content, P.Title 
          FROM Prompts P
          JOIN Tools T ON P.ToolId = T.ToolId
          JOIN Categories C ON T.CategoryId = C.CategoryId
          WHERE C.Slug = @slug 
          ORDER BY P.VoteCount DESC
        `);

      contextResult.recordset.forEach((row, i) => {
        examples += `\nEjemplo ${i+1} (${row.Title}): "${row.Content}"`;
      });
    } catch (dbError) {
      console.error("Error leyendo contexto DB:", dbError);
      // Seguimos adelante aunque falle la DB para que la IA responda igual
    }

    // 3. Prompt de Sistema
    const systemMessage = `
      Eres SaaD Vibe AI, un arquitecto de prompts experto.
      Transforma la idea del usuario en un prompt estructurado y profesional.
      
      CONTEXTO (${categorySlug}):
      ${examples ? 'Usa estos estilos exitosos como referencia:' + examples : 'Usa las mejores prácticas.'}
      
      INSTRUCCIONES:
      - Genera SOLAMENTE el prompt final mejorado.
      - No incluyas explicaciones ni texto extra.
      - Si es código, solo el código o prompt técnico.
    `;

    // 4. Llamada a Groq (Modelo Llama-3 GRATIS)
    const completion = await openai.chat.completions.create({
      model: "llama3-8b-8192", // <--- Modelo gratis y rápido
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userInput }
      ],
      temperature: 0.7,
    });

    const generatedPrompt = completion.choices[0].message.content;

    // 5. Guardar Log en SQL
    pool.request()
      .input('input', userInput)
      .input('output', generatedPrompt)
      .input('cat', categorySlug || 'general')
      .query(`
        INSERT INTO MetapromptLogs (OriginalInput, GeneratedOutput, CategoryContext)
        VALUES (@input, @output, @cat)
      `).catch(err => console.error("Error guardando log:", err));

    return NextResponse.json({ prompt: generatedPrompt });

  } catch (error) {
    console.error('Error API Generate:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}