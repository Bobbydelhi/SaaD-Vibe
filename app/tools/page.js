import ToolCard from '@/components/ToolCard';
import { getDb } from '@/lib/db';

// Server Component: Fetch directo a DB para máxima velocidad y SEO
async function getTools() {
  const pool = await getDb();
  const result = await pool.request().query(`
    SELECT TOP 50 T.ToolId, T.Name, T.Slug, T.Description, T.Rating, T.WebsiteUrl, C.Name as CategoryName
    FROM Tools T
    JOIN Categories C ON T.CategoryId = C.CategoryId
    WHERE T.IsActive = 1
    ORDER BY T.Rating DESC
  `);
  return result.recordset; // MSSQL devuelve los datos en .recordset
}

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Directorio de IA</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.ToolId} tool={tool} />
        ))}
      </div>
    </div>
  );
}