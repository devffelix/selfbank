import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Mockup } from './ui/Mockup';
import { ArrowRight, CheckCircle2, TrendingUp, Trophy, Wallet, Zap, ShoppingBag } from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-bold text-xl tracking-tight">SelfBank</span>
          </div>
          <div className="flex gap-4">
             <button onClick={onStart} className="text-sm font-medium hover:text-emerald-500 transition-colors hidden md:block">
                Entrar
             </button>
             <Button size="sm" onClick={onStart}>
                Começar Grátis
             </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[100px] opacity-50" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[80px] opacity-30" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-center md:text-left">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20"
             >
                <Zap size={12} fill="currentColor" /> 100% Gratuito para sempre
             </motion.div>
             
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
             >
                Seu Tempo é <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Dinheiro Virtual</span>.
             </motion.h1>
             
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto md:mx-0 leading-relaxed"
             >
                Pare de procrastinar. O SelfBank gamifica sua vida transformando tarefas chatas em saldo bancário para conquistar recompensas reais.
             </motion.p>

             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
             >
                <Button size="lg" onClick={onStart} className="shadow-lg shadow-emerald-500/20">
                    Criar Conta Grátis <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="secondary" onClick={onStart}>
                    Ver Demo
                </Button>
             </motion.div>
             
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-4 flex items-center justify-center md:justify-start gap-6 text-sm text-zinc-500"
             >
                 <div className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Sem cartão de crédito</div>
                 <div className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Funciona Offline</div>
             </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="relative hidden md:block perspective-1000"
          >
             <div className="relative z-10 transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-500">
                <Mockup />
             </div>
             {/* Decorative Elements behind phone */}
             <div className="absolute top-20 -right-10 bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-xl z-20 animate-bounce">
                <div className="text-xs text-zinc-400 mb-1">Meta Atingida</div>
                <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <Trophy size={16} /> Comprar PS5
                </div>
             </div>
             <div className="absolute bottom-40 -left-10 bg-white dark:bg-zinc-100 p-4 rounded-xl border border-zinc-200 shadow-xl z-20 animate-pulse text-zinc-900">
                <div className="text-xs text-zinc-500 mb-1">Saldo Adicionado</div>
                <div className="font-bold font-mono text-emerald-600 flex items-center gap-2">
                    <TrendingUp size={16} /> + R$ 50,00
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-zinc-100 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona o Grind?</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                      Enganar seu cérebro para gostar de trabalhar nunca foi tão fácil (e lucrativo).
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Feature 1 */}
                  <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-colors group">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <CheckCircle2 size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">1. Cumpra Tarefas</h3>
                      <p className="text-zinc-500 leading-relaxed">
                          Adicione suas obrigações diárias ou hábitos. Cada check vale dinheiro virtual definido por você.
                      </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 transition-colors group">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Wallet size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">2. Acumule Saldo</h3>
                      <p className="text-zinc-500 leading-relaxed">
                          Veja seu saldo crescer em tempo real. A satisfação visual do progresso mantém você focado.
                      </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/50 transition-colors group">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <ShoppingBag size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">3. Compre Recompensas</h3>
                      <p className="text-zinc-500 leading-relaxed">
                          Configure itens de desejo na Loja. Só compre aquele "lanchinho" ou "hora de jogo" se tiver saldo.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-zinc-900 dark:bg-zinc-800 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -ml-16 -mb-16" />
              
              <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para ficar rico (virtualmente)?</h2>
                  <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                      Junte-se a milhares de usuários que pararam de procrastinar usando o método SelfBank.
                  </p>
                  <Button size="lg" onClick={onStart} className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[200px]">
                      Começar Agora
                  </Button>
                  <p className="mt-4 text-xs text-zinc-500">Sem custos ocultos. Open Source.</p>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-center gap-2 mb-4">
               <Logo size="sm" className="grayscale opacity-50" />
               <span className="font-semibold opacity-50">SelfBank</span>
          </div>
          <p>© {new Date().getFullYear()} SelfBank. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};