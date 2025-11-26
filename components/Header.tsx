import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Target, Sun, Moon, LogOut, User } from 'lucide-react';
import { Goal } from '../types';
import { Button } from './ui/Button';
import { supabase } from '../supabaseClient';
import { Logo } from './Logo';

interface HeaderProps {
  balance: number;
  goal: Goal;
  onUpdateGoal: (goal: Goal) => void;
  onResetData: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  userEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({ balance, goal, onUpdateGoal, onResetData, isDark, toggleTheme, userEmail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoalTitle, setTempGoalTitle] = useState(goal.title);
  const [tempGoalAmount, setTempGoalAmount] = useState(goal.targetAmount.toString());

  const progress = Math.min((balance / (goal.targetAmount || 1)) * 100, 100);
  
  const handleSave = () => {
    onUpdateGoal({
      title: tempGoalTitle,
      targetAmount: parseFloat(tempGoalAmount) || 0
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <header className="sticky top-0 z-20 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 pb-6 pt-4 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* User Info Bar */}
        <div className="flex justify-between items-center text-xs text-zinc-400 dark:text-zinc-600">
            <div className="flex items-center gap-2">
                 <Logo size="sm" className="opacity-80" />
                 <span className="font-bold tracking-tight text-zinc-500 dark:text-zinc-400">SelfBank</span>
                 <span className="mx-2 text-zinc-300 dark:text-zinc-700">|</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="font-mono">{userEmail || 'Usuário'}</span>
            </div>
            <div className="hidden md:block">v1.2</div>
        </div>

        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">Meta Atual</h1>
            <div 
              onClick={() => setIsEditing(true)}
              className="group cursor-pointer flex items-center gap-2"
            >
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                {goal.title}
              </h2>
              <Settings size={16} className="text-zinc-400 dark:text-zinc-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
          </div>
          
          <div className="flex items-start gap-4">
             <div className="text-right">
                <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">Saldo</h3>
                <div className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                  {formatCurrency(balance)}
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                    onClick={handleLogout}
                    title="Sair"
                    className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                    <LogOut size={18} />
                </button>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="relative pt-2">
          <div className="flex justify-between text-xs font-mono text-zinc-500 mb-2">
            <span>{Math.round(progress)}% Concluído</span>
            <span className="text-amber-600 dark:text-amber-400">Meta: {formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute top-0 left-0 h-full w-20 bg-white/20 skew-x-[-20deg]"
              animate={{ x: ['-100%', '1000%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 3 }}
            />
          </div>
        </div>

        {/* Goal Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Target className="text-amber-500" /> Configurar Meta
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Nome da Meta</label>
                  <input 
                    type="text" 
                    value={tempGoalTitle}
                    onChange={(e) => setTempGoalTitle(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Valor Alvo (R$)</label>
                  <input 
                    type="number" 
                    value={tempGoalAmount}
                    onChange={(e) => setTempGoalAmount(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button variant="secondary" fullWidth onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button fullWidth onClick={handleSave}>Salvar</Button>
                </div>
                
                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                   <button 
                    onClick={() => {
                       if(window.confirm('Tem certeza que deseja apagar todos os dados desta conta?')) {
                           onResetData();
                           setIsEditing(false);
                       }
                    }}
                    className="text-xs text-red-500 hover:text-red-400 w-full text-center"
                   >
                     Resetar Tudo (Hard Reset)
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </header>
  );
};