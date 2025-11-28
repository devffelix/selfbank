import React, { useState, useEffect } from 'react';
import { motion, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Mockup } from './ui/Mockup';
import { ArrowRight, CheckCircle2, TrendingUp, Trophy, Wallet, Zap, ShoppingBag, Brain, ChevronDown, Target, ShieldCheck, Check, Star, Quote, Lock, Smartphone, BarChart3, Clock, Play, DollarSign, XCircle, AlertTriangle, Plus } from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  
  // Mouse Position Logic for Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // 3D Tilt Logic for Hero Mockup
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]); // Inverted for natural feel
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) / 4); // Divide to dampen
      y.set((e.clientY - centerY) / 4);
  };

  const handleHeroMouseLeave = () => {
      x.set(0);
      y.set(0);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Global Spotlight Effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-bold text-xl tracking-tight text-white">SelfBank</span>
          </div>
          <div className="flex gap-4">
             <button onClick={onStart} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block">
                Entrar
             </button>
             <Button size="sm" onClick={onStart} className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                Começar Agora
             </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-visible z-10"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-center">
          <div className="space-y-8 text-center xl:text-left relative z-20 order-1">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-emerald-400 text-xs font-bold border border-zinc-800 shadow-lg mx-auto xl:mx-0"
             >
                <Zap size={14} fill="currentColor" /> MÉTODO COMPROVADO
             </motion.div>
             
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white"
             >
                Transforme sua <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 animate-pulse">Produtividade</span> em Riqueza.
             </motion.h1>
             
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-zinc-400 max-w-lg mx-auto xl:mx-0 leading-relaxed"
             >
                O único gerenciador de tarefas que paga você. Use a gamificação para hackear sua dopamina e conquistar seus objetivos reais.
             </motion.p>

             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start"
             >
                <Button size="lg" onClick={onStart} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] border-0 h-14 px-8 text-lg">
                    Criar Conta Grátis <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="secondary" onClick={onStart} className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 h-14">
                    Ver como funciona
                </Button>
             </motion.div>
             
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-6 flex items-center justify-center xl:justify-start gap-8 text-sm text-zinc-500"
             >
                 <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-500" /> Dados criptografados</div>
                 <div className="flex items-center gap-2"><Zap size={18} className="text-amber-500" /> 100% Gratuito</div>
             </motion.div>
          </div>

          {/* 3D Interactive Mockup Container */}
          <div className="relative z-10 perspective-1000 order-2 flex justify-center mt-12 xl:mt-0">
             <motion.div 
                style={{ 
                  rotateX: springRotateX, 
                  rotateY: springRotateY,
                  transformStyle: "preserve-3d"
                }}
                animate={{ y: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative"
             >
                {/* O Mockup em si */}
                <div className="relative z-10 transform transition-transform duration-100 drop-shadow-2xl scale-90 sm:scale-100 xl:scale-110">
                   <Mockup />
                </div>
                
                {/* Floating Elements (Glassmorphism Cards) */}
                <motion.div 
                  style={{ z: 50 }}
                  animate={{ x: [-10, 10, -10], y: [10, -10, 10] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="absolute -top-6 -right-2 md:top-12 md:-right-12 bg-zinc-900/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-zinc-700 shadow-2xl z-20 flex items-center gap-3 md:gap-4 max-w-[160px] md:max-w-none"
                >
                   <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                       <Trophy size={20} className="md:w-6 md:h-6" />
                   </div>
                   <div>
                       <div className="text-[10px] md:text-xs text-zinc-400 uppercase font-bold">Objetivo</div>
                       <div className="font-bold text-white text-xs md:text-sm">Comprar PS5</div>
                   </div>
                </motion.div>

                <motion.div 
                   style={{ z: 30 }}
                   animate={{ x: [10, -10, 10], y: [-10, 10, -10] }}
                   transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                   className="absolute -bottom-6 -left-4 md:bottom-20 md:-left-12 bg-zinc-900/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-zinc-700 shadow-2xl z-20 flex items-center gap-3 md:gap-4 max-w-[180px] md:max-w-none"
                >
                   <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400">
                       <Wallet size={20} className="md:w-6 md:h-6" />
                   </div>
                   <div>
                       <div className="text-[10px] md:text-xs text-zinc-400 uppercase font-bold">Saldo Atual</div>
                       <div className="font-mono font-bold text-emerald-400 text-sm md:text-lg">R$ 1.250,00</div>
                   </div>
                </motion.div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Infinite Marquee Section */}
      <section className="py-8 bg-emerald-950/20 border-y border-emerald-900/30 overflow-hidden relative z-20">
        <div className="flex whitespace-nowrap">
            <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="flex gap-12 items-center text-emerald-500/40 font-black text-4xl uppercase tracking-widest"
            >
                {[...Array(6)].map((_, i) => (
                    <React.Fragment key={i}>
                        <span>Dopamina Hack</span>
                        <span className="text-zinc-800">•</span>
                        <span>Foco Total</span>
                        <span className="text-zinc-800">•</span>
                        <span>Recompensas Reais</span>
                        <span className="text-zinc-800">•</span>
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
      </section>

      {/* --- NOVA SEÇÃO: A DOR / O PROBLEMA --- */}
      <section className="py-24 bg-zinc-950 relative">
          <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center gap-16">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1"
                  >
                      <div className="inline-flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-xs mb-4">
                        <AlertTriangle size={16} /> O Conflito Biológico
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                          Por que você não consegue <span className="text-red-500">focar</span>?
                      </h2>
                      <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                          Seu cérebro evoluiu para buscar recompensas imediatas (comida, segurança, prazer). 
                          Trabalho e estudo oferecem recompensas atrasadas (salário no fim do mês, diploma daqui 4 anos).
                      </p>
                      <p className="text-zinc-400 text-lg leading-relaxed border-l-2 border-red-500/50 pl-6">
                          <strong className="text-white">Resultado:</strong> Você procrastina porque o "custo" do esforço agora não tem um "pagamento" visível agora. O TikTok ganha porque a dopamina é instantânea.
                      </p>
                  </motion.div>

                  <div className="flex-1 w-full relative">
                      {/* Illustration of The Loop */}
                      <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 relative overflow-hidden">
                          <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full"></div>
                          
                          <div className="flex flex-col gap-6 relative z-10">
                              <div className="flex items-center justify-between opacity-50">
                                  <div className="bg-zinc-800 p-4 rounded-xl flex items-center gap-3 w-full border border-zinc-700">
                                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center"><Clock size={16}/></div>
                                      <span className="text-zinc-400 text-sm">Tarefa Chata</span>
                                  </div>
                              </div>
                              
                              <div className="flex justify-center">
                                  <ArrowRight className="rotate-90 text-zinc-600" />
                              </div>

                              <div className="bg-zinc-800 p-4 rounded-xl flex items-center gap-3 w-full border border-zinc-700 opacity-50">
                                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center"><XCircle size={16}/></div>
                                  <span className="text-zinc-400 text-sm">Sem Recompensa</span>
                              </div>

                              <div className="flex justify-center">
                                  <ArrowRight className="rotate-90 text-red-500" />
                              </div>

                              <div className="bg-red-950/30 p-4 rounded-xl flex items-center gap-3 w-full border border-red-900/50">
                                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center text-red-500"><AlertTriangle size={16}/></div>
                                  <span className="text-red-400 text-sm font-bold">Procrastinação / Celular</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- NOVA SEÇÃO: A SOLUÇÃO --- */}
      <section className="py-24 bg-zinc-900/30 border-y border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1"
                  >
                      <div className="inline-flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs mb-4">
                        <Zap size={16} /> A Ponte de Dopamina
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                          Transforme esforço em <span className="text-emerald-500">valor visível</span>.
                      </h2>
                      <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                          O SelfBank hackeia esse sistema criando um "meio de troca". Você não está apenas estudando; você está "farmando" ouro.
                      </p>
                      <ul className="space-y-4">
                          {[
                              "Cada tarefa tem um preço (R$).",
                              "O feedback auditivo libera prazer imediato.",
                              "O saldo cresce visualmente (senso de progresso).",
                              "Você compra o que gosta SEM CULPA."
                          ].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-zinc-300">
                                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                      <Check size={14} strokeWidth={3} />
                                  </div>
                                  {item}
                              </li>
                          ))}
                      </ul>
                  </motion.div>

                  <div className="flex-1 w-full">
                      {/* Illustration of The Solution */}
                      <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 relative shadow-2xl">
                          <div className="flex items-center justify-between gap-4 mb-8">
                               {/* Input */}
                               <div className="flex-1 bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-center">
                                    <div className="text-xs text-zinc-500 uppercase font-bold mb-2">Input</div>
                                    <div className="flex justify-center mb-2 text-zinc-300"><Clock size={24}/></div>
                                    <div className="text-sm font-bold">1h de Trabalho</div>
                               </div>
                               
                               {/* Process */}
                               <div className="flex flex-col items-center gap-1 text-emerald-500">
                                    <div className="w-full h-1 bg-emerald-500/20 rounded-full w-16 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-emerald-500 w-1/2 animate-shimmer"></div>
                                    </div>
                                    <ArrowRight size={20} />
                               </div>

                               {/* Output */}
                               <div className="flex-1 bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/30 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                                    <div className="text-xs text-emerald-600 uppercase font-bold mb-2 relative z-10">Output</div>
                                    <div className="flex justify-center mb-2 text-emerald-400 relative z-10"><DollarSign size={24}/></div>
                                    <div className="text-sm font-bold text-white relative z-10">+R$ 50,00</div>
                               </div>
                          </div>
                          
                          <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500"><ShoppingBag size={18}/></div>
                                    <div>
                                        <div className="text-white text-sm font-bold">Resgate</div>
                                        <div className="text-zinc-500 text-xs">Ifood / Games / Lazer</div>
                                    </div>
                                </div>
                                <Button size="sm" className="bg-emerald-500 text-white h-8">Comprar</Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Stats Section */}
      <section className="bg-zinc-900/30 backdrop-blur-sm relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-800 border-b border-zinc-800">
              {[
                  { label: "Usuários Ativos", value: "+2.000" },
                  { label: "Tarefas Concluídas", value: "+150k" },
                  { label: "Metas Atingidas", value: "+8.500" },
                  { label: "Produtividade", value: "+300%" }
              ].map((stat, i) => (
                  <div key={i} className="py-12 text-center group hover:bg-zinc-800/50 transition-colors cursor-default">
                      <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{stat.value}</div>
                      <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium">{stat.label}</div>
                  </div>
              ))}
          </div>
      </section>

      {/* VISUAL FEATURE SHOWCASE (Deep Dive) */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
            
            {/* Feature 1: The Input & List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="order-2 lg:order-1 relative"
                >
                    {/* UI Simulation: Task Input */}
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-2xl relative">
                         {/* Input Bar */}
                         <div className="flex gap-3 mb-6">
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 flex-1 flex items-center justify-between text-zinc-400 text-sm">
                                <span>Finalizar relatório...</span>
                                <span className="text-zinc-600">Enter</span>
                            </div>
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 w-24 text-center font-mono text-emerald-500">
                                R$ 50
                            </div>
                            <div className="bg-emerald-500 rounded-xl w-12 flex items-center justify-center text-zinc-900">
                                <Plus size={20} />
                            </div>
                         </div>
                         
                         {/* List Items */}
                         <div className="space-y-3">
                            <div className="bg-zinc-950/50 border border-zinc-800 p-3 rounded-xl flex items-center justify-between opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-zinc-900"><Check size={12} strokeWidth={3}/></div>
                                    <span className="text-zinc-500 line-through text-sm">Ler 10 páginas</span>
                                </div>
                                <span className="font-mono text-emerald-600 text-xs font-bold">+R$ 15</span>
                            </div>
                            <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl flex items-center justify-between shadow-lg transform scale-105 border-l-4 border-l-emerald-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-zinc-600 rounded-full"></div>
                                    <span className="text-white text-sm">Treino de Academia</span>
                                </div>
                                <span className="font-mono text-emerald-400 text-xs font-bold">+R$ 40</span>
                            </div>
                            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-zinc-700 rounded-full"></div>
                                    <span className="text-zinc-300 text-sm">Beber 2L água</span>
                                </div>
                                <span className="font-mono text-emerald-500 text-xs font-bold">+R$ 5</span>
                            </div>
                         </div>

                         {/* Background Decor */}
                         <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 blur-3xl rounded-full"></div>
                    </div>
                </motion.div>
                <div className="order-1 lg:order-2 space-y-6">
                    <div className="inline-flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                        <CheckCircle2 size={16} /> Fluxo de Trabalho
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white">Organização que <br/> dá lucro.</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Sua lista de tarefas não precisa ser chata. No SelfBank, cada item concluído gera feedback visual e sonoro imediato, transformando obrigação em satisfação.
                    </p>
                    <ul className="space-y-2">
                        {['Interface limpa e rápida', 'Separação de Tarefas e Hábitos', 'Feedback sonoro satisfatório'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-zinc-300">
                                <Check size={16} className="text-emerald-500" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Feature 2: The Shop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                        <ShoppingBag size={16} /> Marketplace Pessoal
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white">Gaste o que <br/> conquistou.</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Crie sua própria loja de recompensas. Quer pedir um delivery? Quer comprar um jogo novo? Coloque um preço e trabalhe por isso. A culpa desaparece quando você sabe que mereceu.
                    </p>
                </div>
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* UI Simulation: Shop Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex flex-col gap-4 opacity-50">
                            <div className="flex justify-between items-start">
                                <ShoppingBag className="text-zinc-600" />
                                <span className="font-mono text-zinc-600 text-xs">R$ 200</span>
                            </div>
                            <div className="h-2 w-16 bg-zinc-800 rounded-full"></div>
                        </div>
                        <div className="bg-zinc-900 p-5 rounded-2xl border border-amber-500/50 shadow-[0_0_30px_-10px_rgba(245,158,11,0.2)] flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="font-mono text-amber-500 font-bold text-sm">R$ 80</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Pedir Pizza</h4>
                                <div className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-xs rounded-lg text-center cursor-pointer transition-colors">
                                    COMPRAR
                                </div>
                            </div>
                        </div>
                        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex flex-col gap-4 col-span-2">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-500/20 p-2 rounded-lg text-purple-500">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <span className="text-white font-medium text-sm">Cinema com amigos</span>
                                </div>
                                <span className="font-mono text-zinc-400 text-xs font-bold">R$ 120</span>
                             </div>
                             <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                 <div className="w-[70%] h-full bg-zinc-600 rounded-full"></div>
                             </div>
                             <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold">
                                 <span>Progresso</span>
                                 <span>Faltam R$ 40</span>
                             </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Feature 3: History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="order-2 lg:order-1 relative"
                >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-white font-bold flex items-center gap-2"><BarChart3 size={18} className="text-emerald-500"/> Produtividade</h4>
                            <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400">Últimos 7 dias</div>
                        </div>
                        
                        {/* Fake Chart */}
                        <div className="flex items-end justify-between h-32 gap-3 mb-6">
                            {[30, 50, 20, 80, 60, 90, 40].map((h, i) => (
                                <div key={i} className="w-full bg-zinc-800 rounded-t-lg relative group">
                                    <div style={{ height: `${h}%` }} className={`absolute bottom-0 w-full rounded-t-lg transition-all ${i === 5 ? 'bg-emerald-500' : 'bg-zinc-700 group-hover:bg-zinc-600'}`}></div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                <div className="text-zinc-500 text-xs mb-1 uppercase">Total Gerado</div>
                                <div className="text-emerald-400 font-mono font-bold text-xl">R$ 1.450</div>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                <div className="text-zinc-500 text-xs mb-1 uppercase">Tarefas</div>
                                <div className="text-white font-mono font-bold text-xl">142</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <div className="order-1 lg:order-2 space-y-6">
                    <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs">
                        <TrendingUp size={16} /> Metas & Dados
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white">Visualize seu <br/> crescimento.</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Não é só sobre fazer tarefas, é sobre ver sua consistência. Acompanhe seu histórico financeiro, veja seus dias mais produtivos e entenda seus hábitos.
                    </p>
                </div>
            </div>

        </div>
      </section>

      {/* Psychology Section */}
      <section className="py-24 relative overflow-hidden bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                <Brain size={16} /> Neurociência Aplicada
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                Hackeie o sistema de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Dopamina</span>.
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed border-l-2 border-emerald-500/50 pl-6">
                O <strong>SelfBank</strong> cria um "feedback loop" curto: você faz a tarefa e recebe dinheiro virtual imediatamente. Isso "engana" seu cérebro para amar ser produtivo, substituindo a ansiedade pelo prazer da conquista.
              </p>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-6">
               {[
                   { icon: Target, color: "text-red-400", title: "Gatilho", desc: "Defina uma tarefa e um valor." },
                   { icon: Zap, color: "text-amber-400", title: "Ação", desc: "Execute o trabalho duro." },
                   { icon: Trophy, color: "text-emerald-400", title: "Prêmio", desc: "O som de 'caixa' libera prazer." },
                   { icon: ShoppingBag, color: "text-blue-400", title: "Compra", desc: "Gaste sem culpa na Loja." }
               ].map((item, i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ y: -5 }}
                     className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 hover:border-emerald-500/30 transition-all hover:bg-zinc-800"
                   >
                       <item.icon className={`${item.color} mb-4`} size={32} />
                       <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                       <p className="text-sm text-zinc-500">{item.desc}</p>
                   </motion.div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wall of Fame / Testimonials */}
      <section className="py-24 bg-zinc-900/30 border-y border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Mural da Conquista</h2>
                  <p className="text-zinc-400">Pessoas reais usando gamificação para comprar sonhos reais.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                      { name: "Carlos M.", item: "Playstation 5", cost: "R$ 3.800", quote: "Levei 3 meses juntando 'dinheiro' no app fazendo freelas extras. A sensação de comprar sem culpa foi incrível." },
                      { name: "Ana Clara", item: "Curso de Design", cost: "R$ 1.200", quote: "Transformei estudar em um jogo. Cada módulo valia R$ 50. Paguei meu curso com o próprio estudo." },
                      { name: "Rafael S.", item: "Viagem Fim de Semana", cost: "R$ 800", quote: "Parei de gastar com besteira no iFood para 'economizar' no app e atingir a meta da viagem. Mudou meu mindset." }
                  ].map((t, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 relative"
                      >
                          <Quote className="absolute top-6 right-6 text-zinc-800" size={40} />
                          <div className="flex items-center gap-2 mb-4 text-emerald-500">
                              <Star size={16} fill="currentColor" />
                              <Star size={16} fill="currentColor" />
                              <Star size={16} fill="currentColor" />
                              <Star size={16} fill="currentColor" />
                              <Star size={16} fill="currentColor" />
                          </div>
                          <p className="text-zinc-300 mb-6 relative z-10">"{t.quote}"</p>
                          <div className="flex items-center gap-4 border-t border-zinc-800 pt-4">
                              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                                  {t.name.charAt(0)}
                              </div>
                              <div>
                                  <div className="text-sm font-bold text-white">{t.name}</div>
                                  <div className="text-xs text-zinc-500">Comprou: <span className="text-emerald-400">{t.item}</span></div>
                              </div>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- NOVA SEÇÃO: O PRÓXIMO PASSO (Roadmap) --- */}
      <section className="py-24 relative overflow-hidden bg-black">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
                Comece em <span className="text-emerald-500">30 Segundos</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
                 {/* Connecting Line (Desktop) */}
                 <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-1 bg-zinc-800 z-0"></div>

                 <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 relative z-10">
                     <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 border border-zinc-700 shadow-xl">1</div>
                     <h3 className="text-xl font-bold text-white mb-2">Defina uma Meta</h3>
                     <p className="text-zinc-400 text-sm">Escolha algo que você quer muito comprar ou conquistar.</p>
                 </div>
                 <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 relative z-10">
                     <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 border border-zinc-700 shadow-xl">2</div>
                     <h3 className="text-xl font-bold text-white mb-2">Liste Tarefas</h3>
                     <p className="text-zinc-400 text-sm">Atribua valores em R$ para cada tarefa difícil.</p>
                 </div>
                 <div className="p-6 bg-emerald-900/20 rounded-3xl border border-emerald-500/20 relative z-10">
                     <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-zinc-900 mb-6 shadow-lg shadow-emerald-500/20"><Play fill="currentColor" size={24}/></div>
                     <h3 className="text-xl font-bold text-white mb-2">Comece o Jogo</h3>
                     <p className="text-emerald-200/70 text-sm">Complete a primeira tarefa e ouça o som da vitória.</p>
                 </div>
            </div>
            
            <div className="mt-12">
                <Button size="lg" onClick={onStart} className="bg-white text-black hover:bg-zinc-200 h-14 px-12 text-lg font-bold border-0 transform hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                    Jogar Agora
                </Button>
            </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-zinc-900 mb-8">
                <Lock size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">Seus dados são seus. Ponto.</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Smartphone size={18}/> Modo Offline-First</h4>
                    <p className="text-sm text-zinc-400">O app funciona 100% sem internet. Seus dados são salvos localmente no seu dispositivo primeiro.</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><ShieldCheck size={18}/> Criptografia</h4>
                    <p className="text-sm text-zinc-400">Se decidir sincronizar na nuvem, usamos criptografia de ponta a ponta via Supabase. Ninguém lê suas tarefas.</p>
                </div>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-3xl mx-auto px-6 relative z-10">
         <h2 className="text-3xl font-bold text-center mb-12 text-white">Perguntas Frequentes</h2>
         <div className="space-y-4">
            {[
                { q: "O dinheiro é de verdade?", a: "Não. É um valor simbólico para gamificar sua produtividade. Você define quanto vale cada tarefa para 'se pagar' virtualmente." },
                { q: "É realmente gratuito?", a: "Sim, 100% gratuito. Sem planos premium, sem taxas escondidas. O código é aberto." },
                { q: "Funciona offline?", a: "Sim! Se você ficar sem internet, o SelfBank salva tudo no seu dispositivo e sincroniza quando a conexão voltar." },
                { q: "Posso resetar meus dados?", a: "Claro. Nas configurações da meta, existe uma opção de 'Hard Reset' para começar do zero." }
            ].map((item, i) => (
                <div key={i} className="border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden">
                    <button 
                        type="button"
                        onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                        className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-800/50 transition-colors"
                    >
                        <span className="font-medium text-zinc-200">{item.q}</span>
                        <ChevronDown 
                            className={`text-zinc-500 transition-transform duration-300 ${activeAccordion === i ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    <AnimatePresence>
                        {activeAccordion === i && (
                            <motion.div
                                key={`accordion-content-${i}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/50">
                                    {item.a}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
         </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 px-6 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 to-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-zinc-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
              
              <div className="relative z-10 space-y-8">
                  <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Comece seu <br/> império virtual.</h2>
                  <p className="text-zinc-400 text-xl max-w-xl mx-auto">
                      Junte-se a milhares de usuários que pararam de procrastinar hoje mesmo.
                  </p>
                  <Button size="lg" onClick={onStart} className="bg-white text-black hover:bg-zinc-200 h-14 px-10 text-lg font-bold border-0 transform hover:scale-105 transition-all">
                      Acessar App Agora
                  </Button>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-zinc-600 border-t border-zinc-900 bg-black">
          <div className="flex flex-col items-center justify-center gap-6 mb-8">
               <Logo size="md" className="grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-500" />
               <div className="flex gap-8 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  <a href="#" className="hover:text-emerald-500 transition-colors">Twitter</a>
                  <a href="#" className="hover:text-emerald-500 transition-colors">GitHub</a>
                  <a href="#" className="hover:text-emerald-500 transition-colors">Discord</a>
               </div>
          </div>
          <p className="opacity-40 font-mono">© {new Date().getFullYear()} SELFBANK INC.</p>
      </footer>
    </div>
  );
};