import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { userInput, categorySlug } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'Input requerido' }, { status: 400 });
    }

    // 1. Conectar a DB
    const pool = await getDb();

    // 2. Recuperar contexto (Los mejores prompts de esa categoría)
    // Esto enseña al modelo qué estilo usar (Few-Shot Learning simple)
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

    let examples = "";
    contextResult.recordset.forEach((row, i) => {
      examples += `\nEjemplo ${i+1} (${row.Title}): "${row.Content}"`;
    });

    // 3. Prompt de Sistema (Ingeniería de Prompts)
    const systemMessage = `
      Eres SaaD Vibe AI, un arquitecto de prompts experto.
      
      TU MISIÓN:
      Transformar la idea vaga del usuario en un prompt estructurado y profesional para herramientas de IA.
      
      CONTEXTO (${categorySlug}):
      ${examples ? 'Usa estos estilos exitosos como referencia:' + examples : 'Usa las mejores prácticas generales.'}
      
      INSTRUCCIONES:
      - Si es para Imagen: Detalla estilo, iluminación, cámara y relación de aspecto.
      - Si es para Texto: Define Rol, Tarea, Contexto y Formato de salida.
      - Si es para Código: Define lenguaje, eficiencia y manejo de errores.
      
      SALIDA:
      Devuelve SOLAMENTE el prompt final mejorado. Sin explicaciones extra.
    `;

    // 4. Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // O gpt-3.5-turbo si quieres ahorrar
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userInput }
      ],
      temperature: 0.7,
    });

    const generatedPrompt = completion.choices[0].message.content;

    // 5. Guardar Log en SQL (Asíncrono - no bloqueamos la respuesta)
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
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}