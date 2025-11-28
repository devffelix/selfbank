import React, { useState, useEffect } from 'react';
import { motion, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Mockup } from './ui/Mockup';
import { ArrowRight, CheckCircle2, TrendingUp, Trophy, Wallet, Zap, ShoppingBag, Brain, X, ChevronDown, Target, ShieldCheck, Plus, Check } from 'lucide-react';
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

        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center xl:text-left relative z-20">
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

          {/* 3D Interactive Mockup */}
          <motion.div 
             style={{ 
               rotateX: springRotateX, 
               rotateY: springRotateY,
               transformStyle: "preserve-3d"
             }}
             className="relative hidden xl:block perspective-1000"
          >
             <div className="relative z-10 transform transition-transform duration-100 drop-shadow-2xl">
                <Mockup />
             </div>
             
             {/* Floating Elements (Parallax) */}
             <motion.div 
               style={{ z: 50, x: -50, y: -50 }}
               className="absolute top-20 right-0 bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border border-zinc-700 shadow-2xl z-20 flex items-center gap-4"
             >
                <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                    <Trophy size={24} />
                </div>
                <div>
                    <div className="text-xs text-zinc-400 uppercase font-bold">Objetivo</div>
                    <div className="font-bold text-white">Comprar PS5</div>
                </div>
             </motion.div>

             <motion.div 
                style={{ z: 30, x: 40, y: 40 }}
                className="absolute bottom-40 -left-10 bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border border-zinc-700 shadow-2xl z-20 flex items-center gap-4"
             >
                <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400">
                    <Wallet size={24} />
                </div>
                <div>
                    <div className="text-xs text-zinc-400 uppercase font-bold">Saldo Atual</div>
                    <div className="font-mono font-bold text-emerald-400 text-lg">R$ 1.250,00</div>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-zinc-800 bg-zinc-900/30 backdrop-blur-sm relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-800">
              {[
                  { label: "Usuários Ativos", value: "+2.000" },
                  { label: "Tarefas Concluídas", value: "+150k" },
                  { label: "Metas Atingidas", value: "+8.500" },
                  { label: "Produtividade", value: "+300%" }
              ].map((stat, i) => (
                  <div key={i} className="py-8 text-center group hover:bg-zinc-800/50 transition-colors cursor-default">
                      <div className="text-3xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{stat.value}</div>
                      <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium">{stat.label}</div>
                  </div>
              ))}
          </div>
      </section>

      {/* TUTORIAL / HOW IT WORKS SECTION (NEW) */}
      <section className="py-24 relative overflow-hidden bg-black/50">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Como funciona o <span className="text-emerald-500">SelfBank</span>?</h2>
                <p className="text-zinc-400">Três passos simples para hackear sua mente.</p>
            </div>

            <div className="space-y-24">
                
                {/* Step 1: Define Goal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="order-2 md:order-1 relative"
                    >
                        {/* Mockup UI: Goal Card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl group hover:border-zinc-700 transition-colors">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px]"></div>
                             
                             <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Seu Sonho</div>
                                    <div className="text-2xl font-bold text-white">Viagem Europa</div>
                                </div>
                                <Target className="text-amber-500" size={32} />
                             </div>
                             
                             <div className="flex justify-between items-end mb-2">
                                <div className="text-xs text-zinc-400">Progresso</div>
                                <div className="text-xl font-mono font-bold text-emerald-400">R$ 3.500,00</div>
                             </div>
                             <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-[35%] bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"></div>
                             </div>
                             <div className="mt-2 text-right text-[10px] text-zinc-500 font-mono">Meta: R$ 10.000</div>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="order-1 md:order-2 space-y-6"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-bold text-white">1</div>
                        <h3 className="text-3xl font-bold text-white">Defina seu "Norte"</h3>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Crie uma meta financeira clara. Pode ser um novo videogame, uma viagem ou apenas um jantar chique. Dê um nome e um valor. Isso transforma tarefas abstratas em progresso concreto.
                        </p>
                    </motion.div>
                </div>

                {/* Step 2: Work */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                         <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-bold text-white">2</div>
                        <h3 className="text-3xl font-bold text-white">Trabalhe e Lucre</h3>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Adicione tarefas e atribua um valor em R$ para cada uma. Tarefas chatas valem mais. Quando você conclui, o som de "Caixa Registradora" toca e seu saldo aumenta.
                        </p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        {/* Mockup UI: Task List */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative space-y-3">
                             {/* Task Item 1 (Done) */}
                             <div className="bg-emerald-900/10 border border-emerald-900/30 p-4 rounded-xl flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-zinc-900">
                                        <Check size={14} strokeWidth={4} />
                                    </div>
                                    <span className="text-zinc-500 line-through text-sm font-medium">Estudar Inglês (1h)</span>
                                </div>
                                <span className="font-mono font-bold text-emerald-600 text-sm">+R$ 20,00</span>
                             </div>
                             
                             {/* Task Item 2 (Active) */}
                             <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex justify-between items-center shadow-lg transform scale-105 border-l-4 border-l-emerald-500">
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full border-2 border-zinc-700"></div>
                                    <span className="text-white text-sm font-medium">Terminar Projeto</span>
                                </div>
                                <span className="font-mono font-bold text-emerald-400 text-sm">+R$ 150,00</span>
                             </div>

                             {/* Task Item 3 */}
                             <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex justify-between items-center opacity-60">
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full border-2 border-zinc-700"></div>
                                    <span className="text-zinc-300 text-sm font-medium">Academia</span>
                                </div>
                                <span className="font-mono font-bold text-emerald-500 text-sm">+R$ 15,00</span>
                             </div>
                        </div>
                    </motion.div>
                </div>

                {/* Step 3: Reward */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="order-2 md:order-1 relative"
                    >
                        {/* Mockup UI: Shop Grid */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl grid grid-cols-2 gap-4">
                             {/* Reward 1 */}
                             <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3 group hover:border-amber-500/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <ShoppingBag size={20} className="text-amber-500" />
                                    <span className="font-mono text-xs text-zinc-500">R$ 45</span>
                                </div>
                                <div className="text-sm font-medium text-white">Skin no Jogo</div>
                                <div className="mt-auto w-full h-8 bg-zinc-800 rounded-lg text-xs flex items-center justify-center text-zinc-500">Comprar</div>
                             </div>

                             {/* Reward 2 (Active) */}
                             <div className="bg-zinc-950 p-4 rounded-2xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] flex flex-col gap-3 relative overflow-hidden">
                                <div className="absolute inset-0 bg-amber-500/5"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <ShoppingBag size={20} className="text-amber-500" />
                                    <span className="font-mono text-xs text-amber-500 font-bold">R$ 80</span>
                                </div>
                                <div className="text-sm font-medium text-white relative z-10">Pedir Pizza</div>
                                <div className="mt-auto w-full h-8 bg-amber-500 rounded-lg text-xs flex items-center justify-center text-black font-bold cursor-pointer relative z-10">RESGATAR</div>
                             </div>

                             {/* Add New */}
                             <div className="col-span-2 border border-dashed border-zinc-800 rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-600 text-sm">
                                <Plus size={16} /> Nova Recompensa
                             </div>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="order-1 md:order-2 space-y-6"
                    >
                         <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-bold text-white">3</div>
                        <h3 className="text-3xl font-bold text-white">Gaste sem Culpa</h3>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Acumulou saldo? Vá até a Loja e compre suas recompensas personalizadas. Se você tem o dinheiro virtual, você <strong>mereceu</strong> o prêmio real. Sem remorso.
                        </p>
                    </motion.div>
                </div>

            </div>
        </div>
      </section>

      {/* Psychology Section */}
      <section className="py-24 relative overflow-hidden">
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
                Tarefas difíceis geram recompensa a longo prazo. O cérebro odeia isso.
                <br/><br/>
                O <strong>SelfBank</strong> cria um "feedback loop" curto: você faz a tarefa e recebe dinheiro virtual imediatamente. Isso "engana" seu cérebro para amar ser produtivo.
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

      {/* Bento Grid Features */}
      <section className="py-24 bg-zinc-900/20">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Seu novo Sistema Operacional</h2>
                  <p className="text-zinc-400 max-w-2xl mx-auto">
                      Simples o suficiente para não atrapalhar. Poderoso o suficiente para mudar sua vida.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                  {/* Big Card 1 */}
                  <div className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl p-8 border border-zinc-800 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                          <CheckCircle2 size={120} className="text-emerald-500" />
                      </div>
                      <div className="relative z-10 h-full flex flex-col justify-end">
                          <h3 className="text-2xl font-bold text-white mb-2">Tarefas & Hábitos</h3>
                          <p className="text-zinc-400">Separe tarefas únicas de hábitos recorrentes. Hábitos resetam diariamente para manter seu streak.</p>
                      </div>
                  </div>

                  {/* Tall Card */}
                  <div className="md:row-span-2 bg-zinc-900 rounded-3xl p-8 border border-zinc-800 flex flex-col items-center text-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-900/20 group-hover:to-emerald-900/40 transition-colors"></div>
                       <div className="w-full flex-1 flex items-center justify-center relative">
                           {/* Simulated Store UI */}
                           <div className="w-full space-y-3 opacity-80 group-hover:opacity-100 transition-opacity">
                               <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center">
                                   <div className="text-xs text-white">Pizza</div>
                                   <div className="text-amber-500 font-mono text-xs">R$ 60</div>
                               </div>
                               <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center scale-105 shadow-xl border-emerald-500/50">
                                   <div className="text-xs text-white">Videogame</div>
                                   <div className="text-amber-500 font-mono text-xs">R$ 0</div>
                               </div>
                               <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center">
                                   <div className="text-xs text-white">Cinema</div>
                                   <div className="text-amber-500 font-mono text-xs">R$ 30</div>
                               </div>
                           </div>
                       </div>
                       <div className="relative z-10 mt-6">
                           <h3 className="text-xl font-bold text-white mb-2">Loja de Recompensas</h3>
                           <p className="text-zinc-400 text-sm">Gaste seu saldo suado em coisas que você ama, sem culpa.</p>
                       </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 group hover:border-amber-500/30 transition-colors">
                      <Wallet size={40} className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-white mb-2">Saldo em Tempo Real</h3>
                      <p className="text-zinc-400 text-sm">Feedback visual instantâneo. Veja o dinheiro entrar a cada check.</p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 group hover:border-blue-500/30 transition-colors">
                      <TrendingUp size={40} className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-white mb-2">Estatísticas</h3>
                      <p className="text-zinc-400 text-sm">Acompanhe sua produtividade semanal e histórico financeiro.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Comparison Section (Simplified) */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
            {/* Old Way */}
            <div className="bg-red-950/10 p-10 rounded-3xl md:rounded-r-none md:rounded-l-3xl border border-red-900/30">
              <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                <X size={24} /> To-Do Lists Normais
              </h3>
              <ul className="space-y-4 text-zinc-400">
                <li className="flex gap-3"><X size={18} className="text-red-500 shrink-0" /> Listas infinitas que geram ansiedade.</li>
                <li className="flex gap-3"><X size={18} className="text-red-500 shrink-0" /> Culpa ao gastar dinheiro.</li>
                <li className="flex gap-3"><X size={18} className="text-red-500 shrink-0" /> Tédio e procrastinação.</li>
              </ul>
            </div>

            {/* SelfBank Way */}
            <div className="bg-emerald-950/10 p-10 rounded-3xl md:rounded-l-none md:rounded-r-3xl border border-emerald-900/30 relative">
              <div className="absolute -top-3 right-8 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                SELF BANK
              </div>
              <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                <CheckCircle2 size={24} /> 
              </h3>
              <ul className="space-y-4 text-zinc-300 font-medium">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Missões claras com recompensas.</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Gastos com mérito e orgulho.</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Vício positivo em produtividade.</li>
              </ul>
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