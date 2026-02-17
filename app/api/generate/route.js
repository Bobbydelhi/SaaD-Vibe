import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configuración de Groq
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
  baseURL: 'https://api.groq.com/openai/v1' 
});

export async function POST(req) {
  try {
    // 1. Recibir el mensaje
    const body = await req.json();
    const { userInput } = body;

    console.log("🟢 Recibido en servidor:", userInput); // Esto saldrá en los logs de Vercel

    if (!userInput) {
      return NextResponse.json({ error: 'Escribe algo por favor' }, { status: 400 });
    }

    // 2. Llamar a Groq (Sin tocar base de datos)
    const completion = await openai.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Eres un experto mejorando prompts para IAs generativas. Responde solo con el prompt mejorado, sin explicaciones." },
        { role: "user", content: `Mejora este prompt: ${userInput}` }
      ],
      temperature: 0.7,
    });

    const generatedPrompt = completion.choices[0].message.content;
    console.log("✅ Groq respondió:", generatedPrompt);

    // 3. Devolver respuesta
    return NextResponse.json({ prompt: generatedPrompt });

  } catch (error) {
    console.error('🔴 Error CRÍTICO:', error);
    return NextResponse.json({ error: error.message || 'Error desconocido' }, { status: 500 });
  }
}