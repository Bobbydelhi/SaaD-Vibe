import { ExternalLink, Star } from 'lucide-react';

export default function ToolCard({ tool }) {
  return (
    <div className="group bg-surface border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{tool.Name}</h3>
          <span className="text-xs text-muted bg-white/5 px-2 py-1 rounded mt-1 inline-block">
            {tool.CategoryName}
          </span>
        </div>
        <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
          <Star size={14} fill="currentColor" /> {tool.Rating}
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-6 line-clamp-2">
        {tool.Description}
      </p>
      <a 
        href={tool.WebsiteUrl} 
        target="_blank" 
        className="inline-flex items-center gap-2 text-sm font-medium text-white hover:underline decoration-primary underline-offset-4"
      >
        Visitar <ExternalLink size={14} />
      </a>
    </div>
  );
}