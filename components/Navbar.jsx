import Link from 'next/link';
import { Zap, LayoutGrid, BookOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-tighter">
          <Zap className="text-primary fill-primary" />
          SaaD<span className="text-primary">Vibe</span>
        </Link>
        
        <div className="flex gap-6 text-sm font-medium text-muted hover:text-white transition-colors">
          <Link href="/tools" className="flex items-center gap-2 hover:text-primary transition-colors">
            <LayoutGrid size={16} /> Directorio
          </Link>
          <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
            <BookOpen size={16} /> Prompts
          </Link>
        </div>
        
        <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
          Login
        </button>
      </div>
    </nav>
  );
}