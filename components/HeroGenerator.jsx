"use client";

import { useState } from 'react';
import { Sparkles, Copy, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HeroGenerator() {
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('text');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    setResult('');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input, categorySlug: category })
      });
      const data = await res.json();
      setResult(data.prompt);
    } catch (error) {
      console.error(error);
      setResult("Error al generar el prompt. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6 animate-pulse">
        <Sparkles size={12} /> Powered by GPT-4o & MSSQL
      </div>

      <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
        No busques IAs. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Domínalas.</span>
      </h1>
      
      <p className="text-lg text-muted max-w-2xl mb-10">
        Transforma ideas vagas en prompts de ingeniería perfectos para Midjourney, ChatGPT y Copilot.
      </p>

      {/* Generator Box */}
      <div className="w-full max-w-3xl bg-surface border border-white/10 rounded-2xl p-2 shadow-2xl shadow-primary/10">
        <div className="flex gap-2 p-2 border-b border-white/5 mb-2 overflow-x-auto">
          {['text', 'image', 'code'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                category === cat ? "bg-white/10 text-white" : "text-muted hover:text-white"
              )}
            >
              {cat === 'text' ? 'Texto' : cat === 'image' ? 'Imagen' : 'Código'}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ej: ${category === 'image' ? 'Un gato cyberpunk en neon...' : 'Un email de ventas agresivo...'}`}
            className="w-full bg-transparent text-white p-4 text-lg focus:outline-none min-h-[100px] resize-none placeholder:text-white/20"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className="absolute bottom-4 right-4 bg-primary hover:bg-primary/90 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
          </button>
        </div>
      </div>

      {/* Result Area */}
      {result && (
        <div className="w-full max-w-3xl mt-6 text-left animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-[#0f0f0f] border border-primary/30 rounded-xl p-6 relative group">
            <h3 className="text-xs font-bold text-primary uppercase mb-2 tracking-widest">SaaD Vibe Output</h3>
            <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
            <button 
              onClick={() => navigator.clipboard.writeText(result)}
              className="absolute top-4 right-4 text-muted hover:text-white bg-white/5 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}