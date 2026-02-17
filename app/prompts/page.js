import { getDb } from '@/lib/db';
import { Star } from 'lucide-react';

// Esta función obtiene los datos directamente de la base de datos (Server Side)
async function getPrompts() {
  try {
    const pool = await getDb();
    const result = await pool.request().query(`
      SELECT TOP 50 P.PromptId, P.Title, P.Content, P.VoteCount, T.Name as ToolName, C.Name as CategoryName
      FROM Prompts P
      JOIN Tools T ON P.ToolId = T.ToolId
      JOIN Categories C ON T.CategoryId = C.CategoryId
      ORDER BY P.VoteCount DESC
    `);
    return result.recordset;
  } catch (error) {
    console.error("Error cargando prompts:", error);
    return [];
  }
}

export default async function PromptsPage() {
  const prompts = await getPrompts();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Biblioteca de Prompts</h1>
          <p className="text-muted">Descubre los mejores prompts votados por la comunidad.</p>
        </div>
        {/* El botón de subir no funcionará hasta tener Login, pero lo dejamos visualmente */}
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium transition-all">
          Subir Prompt
        </button>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <p className="text-gray-400">No hay prompts todavía. ¡Sé el primero en crear uno!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <div key={prompt.PromptId} className="bg-[#121212] border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                  {prompt.ToolName}
                </span>
                <div className="flex items-center gap-1 text-muted text-sm group-hover:text-white">
                  <Star size={14} /> {prompt.VoteCount}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{prompt.Title}</h3>
              <div className="bg-black/50 p-3 rounded-lg border border-white/5 mb-4">
                <p className="text-gray-400 font-mono text-xs line-clamp-3">
                  {prompt.Content}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                <span className="text-xs text-muted">{prompt.CategoryName}</span>
                <button className="text-xs text-white hover:text-primary font-medium">Copiar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}