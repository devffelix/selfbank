import React from 'react';
import { Brain, Scale, Repeat, ShieldAlert } from 'lucide-react';

export const TipsWidget = () => {
  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Brain size={16} className="text-zinc-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Manual do Jogador</h3>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 space-y-6 backdrop-blur-sm">
        
        {/* Dica 1: Precificação */}
        <div className="group">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500/10 p-1.5 rounded-lg text-blue-500 group-hover:text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Scale size={18} />
            </div>
            <h4 className="text-sm font-bold text-zinc-200">Como definir valores?</h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed pl-10">
            Não use o valor real da hora. Use a <strong className="text-zinc-300">dor da tarefa</strong>.
            <br />
            <span className="block mt-1.5 opacity-80">• Tarefa chata (Lavar louça): <span className="text-emerald-500 font-mono">R$ 20</span></span>
            <span className="block opacity-80">• Tarefa fácil (Ler e-mail): <span className="text-emerald-500 font-mono">R$ 5</span></span>
            <span className="block opacity-80">• Tarefa difícil (Estudar): <span className="text-emerald-500 font-mono">R$ 50</span></span>
          </p>
        </div>

        <div className="h-px bg-zinc-800/50 w-full" />

        {/* Dica 2: Hábitos */}
        <div className="group">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-500/10 p-1.5 rounded-lg text-purple-500 group-hover:text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Repeat size={18} />
            </div>
            <h4 className="text-sm font-bold text-zinc-200">Comece Ridículo</h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed pl-10">
            Para ser consistente, o hábito inicial deve ser impossível de falhar.
            <br />
            <span className="block mt-1.5 opacity-80 italic">"Ler 1 página" é melhor que "Ler 30min" e não fazer nada. Aumente o valor conforme a dificuldade sobe.</span>
          </p>
        </div>

        <div className="h-px bg-zinc-800/50 w-full" />

        {/* Dica 3: Consistência */}
        <div className="group">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-amber-500/10 p-1.5 rounded-lg text-amber-500 group-hover:text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <ShieldAlert size={18} />
            </div>
            <h4 className="text-sm font-bold text-zinc-200">A Regra dos 2 Dias</h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed pl-10">
            Nunca fique dois dias seguidos sem completar seus hábitos diários. Falhar um dia é acidente, dois dias é o início de um novo padrão ruim.
          </p>
        </div>

      </div>
    </div>
  );
};
