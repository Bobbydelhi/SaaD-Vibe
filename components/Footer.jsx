import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 text-center text-muted text-sm">
        <p className="mb-2">&copy; 2026 SaaD Vibe. Arquitectura impulsada por Next.js & MSSQL.</p>
        <p>
          Creado y vibeado por{' '}
          <a 
            href="https://github.com/Bobbydelhi" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary font-bold hover:text-white transition-colors"
          >
            BobbyDelhi
          </a>
        </p>
      </div>
    </footer>
  );
}