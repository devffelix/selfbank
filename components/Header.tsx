import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Target, Sun, Moon, LogOut, BarChart3, Edit3, Wallet, TrendingUp } from 'lucide-react';
import { Goal } from '../types';
import { Button } from './ui/Button';
import { supabase } from '../supabaseClient';
import { Logo } from './Logo';

interface HeaderProps {
  balance: number;
  goal: Goal;
  onUpdateGoal: (goal: Goal) => void;
  onResetData: () => void;
  onOpenHistory: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  userEmail?: string;
}

export const Header = ({ 
  balance, 
  goal, 
  onUpdateGoal, 
  onResetData, 
  onOpenHistory,
  isDark, 
  toggleTheme, 
  userEmail 
}: HeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [tempGoalTitle, setTempGoalTitle] = useState(goal.title);
  const [tempGoalAmount, setTempGoalAmount] = useState(goal.targetAmount.toString());
  
  // Track previous balance to determine animation color
  const prevBalanceRef = useRef(balance);
  const [balanceChangeType, setBalanceChangeType] = useState<'increase' | 'decrease' | 'neutral'>('neutral');

  useEffect(() => {
    if (balance > prevBalanceRef.current) setBalanceChangeType('increase');
    else if (balance < prevBalanceRef.current) setBalanceChangeType('decrease');
    prevBalanceRef.current = balance;
  }, [balance]);

  const progress = Math.min((balance / (goal.targetAmount || 1)) * 100, 100);
  
  const handleSave = () => {
    onUpdateGoal({
      title: tempGoalTitle,
      targetAmount: parseFloat(tempGoalAmount) || 0
    });
    setIsEditing(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = async () => {
      await supabase.auth.signOut();
      setIsLogoutConfirmOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <header className="relative z-20 pt-6 pb-2 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                 <Logo size="sm" className="opacity-90 shadow-none" />
                 <div className="flex flex-col">
                    <span className="font-bold tracking-tight text-zinc-900 dark:text-white leading-none">SelfBank</span>
                    <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase mt-0.5">{userEmail || 'Offline'}</span>
                 </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <button
                    onClick={onOpenHistory}
                    title="Estatísticas"
                    className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                    <BarChart3 size={18} />
                </button>
                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700"></div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                    onClick={handleLogoutClick}
                    title="Sair"
                    className="p-2 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>

        {/* FINANCIAL CARD - HERO SECTION */}
        <div className="relative group">
            {/* Card Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black rounded-[2rem] shadow-2xl opacity-100 dark:opacity-100 overflow-hidden">
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                
                {/* Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full mix-blend-screen"></div>
            </div>

            {/* Card Content */}
            <div className="relative z-10 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-inner">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    
                    {/* Goal Section */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 text-zinc-400">
                            <Target size={14} className="text-amber-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">Objetivo Atual</span>
                        </div>
                        <div 
                            onClick={() => setIsEditing(true)}
                            className="group/edit cursor-pointer flex items-center gap-3 transition-opacity hover:opacity-80"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                {goal.title}
                            </h2>
                            <div className="bg-white/5 p-1.5 rounded-lg opacity-0 group-hover/edit:opacity-100 transition-all border border-white/10">
                                <Edit3 size={14} className="text-zinc-300" />
                            </div>
                        </div>
                    </div>

                    {/* Balance Section */}
                    <div className="text-left md:text-right">
                        <div className="flex items-center gap-2 mb-2 text-zinc-400 md:justify-end">
                            <Wallet size={14} className="text-emerald-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">Saldo Disponível</span>
                        </div>
                        <motion.div 
                            key={balance}
                            initial={{ scale: 1.1, filter: "brightness(1.5)" }}
                            animate={{ scale: 1, filter: "brightness(1)" }}
                            className="text-4xl md:text-5xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                            {formatCurrency(balance)}
                        </motion.div>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="relative">
                    <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                        <span className="flex items-center gap-1.5">
                            <TrendingUp size={12} className={progress >= 100 ? "text-emerald-400" : "text-zinc-600"} /> 
                            {Math.round(progress)}% Concluído
                        </span>
                        <span className="text-zinc-500">Alvo: <span className="text-zinc-300">{formatCurrency(goal.targetAmount)}</span></span>
                    </div>
                    
                    {/* The Bar Track */}
                    <div className="h-3 md:h-4 bg-zinc-900/80 rounded-full overflow-hidden border border-white/5 shadow-inner relative backdrop-blur-sm">
                        {/* The Fill */}
                        <motion.div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 40, damping: 15 }}
                        >
                             {/* Glow Effect on the Bar */}
                             <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/50 blur-[4px]"></div>
                        </motion.div>
                        
                        {/* Shimmer overlay */}
                        <motion.div
                            className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
                            animate={{ x: ['-100%', '400%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 1 }}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Goal Edit Modal */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
              >
                {/* Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Target className="text-amber-500" /> Configurar Meta
                  </h3>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Nome do Objetivo</label>
                    <input 
                      type="text" 
                      value={tempGoalTitle}
                      onChange={(e) => setTempGoalTitle(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                      placeholder="Ex: Viagem para Europa"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Valor Alvo (R$)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-zinc-500 font-mono">R$</span>
                        <input 
                        type="number" 
                        value={tempGoalAmount}
                        onChange={(e) => setTempGoalAmount(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3.5 text-zinc-900 dark:text-white font-mono font-bold text-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                        />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button variant="secondary" fullWidth onClick={() => setIsEditing(false)}>Cancelar</Button>
                    <Button fullWidth onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20">Salvar Alterações</Button>
                  </div>
                  
                  <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <button 
                      onClick={() => {
                        if(window.confirm('Tem certeza que deseja apagar todos os dados desta conta? Esta ação é irreversível.')) {
                            onResetData();
                            setIsEditing(false);
                        }
                      }}
                      className="text-xs font-medium text-red-500 hover:text-red-600 w-full text-center hover:bg-red-50 dark:hover:bg-red-900/10 py-2 rounded-lg transition-colors"
                    >
                      Resetar Tudo (Começar do Zero)
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Logout Confirmation Modal */}
        <AnimatePresence>
          {isLogoutConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center"
              >
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                    <LogOut size={28} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Encerrar Sessão?</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    Seus dados estão salvos, mas você precisará fazer login novamente.
                  </p>

                  <div className="flex gap-3 w-full">
                    <Button variant="secondary" fullWidth onClick={() => setIsLogoutConfirmOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="danger" fullWidth onClick={confirmLogout}>
                      Sair Agora
                    </Button>
                  </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};