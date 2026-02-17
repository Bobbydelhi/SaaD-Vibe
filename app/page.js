import HeroGenerator from '@/components/HeroGenerator';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30" />
      
      <HeroGenerator />
      
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">¿Cómo funciona?</h2>
          <p className="text-muted mt-2">La arquitectura detrás de la magia.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "1. Input", desc: "Tú escribes una idea básica o incompleta." },
            { title: "2. Contexto MSSQL", desc: "Buscamos prompts ganadores en nuestra DB." },
            { title: "3. Metaprompting", desc: "GPT-4o reestructura todo usando ingeniería avanzada." }
          ].map((item, i) => (
            <div key={i} className="bg-surface p-6 rounded-xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}