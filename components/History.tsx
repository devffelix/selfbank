import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Calendar, CheckCircle2, DollarSign } from 'lucide-react';
import { GrindItem } from '../types';

interface HistoryProps {
  isOpen: boolean;
  onClose: () => void;
  items: GrindItem[];
}

export const History: React.FC<HistoryProps> = ({ isOpen, onClose, items }) => {
  // Filtrar apenas tarefas concluídas
  const historyItems = useMemo(() => {
    return items
      .filter(item => item.type === 'TASK' && item.completedAt)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  }, [items]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalEarned = historyItems.reduce((acc, item) => acc + item.value, 0);
    const tasksCompleted = historyItems.length;
    
    // Agrupar por dia (últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const chartData = last7Days.map(date => {
      const dayTotal = historyItems
        .filter(item => {
           if (!item.completedAt) return false;
           return new Date(item.completedAt).toISOString().split('T')[0] === date;
        })
        .reduce((acc, item) => acc + item.value, 0);
      
      const dayName = new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' });
      return { date, dayName, value: dayTotal };
    });

    const maxChartValue = Math.max(...chartData.map(d => d.value), 10); // Min 10 to avoid div by zero visuals

    return { totalEarned, tasksCompleted, chartData, maxChartValue };
  }, [historyItems]);

  // Renderiza diretamente no body para evitar problemas de z-index (Stacking Context)
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Escuro e com Blur Intenso */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          {/* Container do Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[85vh] z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" /> Estatísticas & Histórico
                </h2>
                <p className="text-xs text-zinc-500">Veja o quanto você já produziu.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 dark:text-zinc-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar bg-white dark:bg-zinc-900">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <DollarSign size={14} /> Total Gerado
                  </div>
                  <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalEarned)}
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 size={14} /> Tarefas Concluídas
                  </div>
                  <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
                    {stats.tasksCompleted}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-6">Produtividade (Últimos 7 dias)</h3>
                <div className="flex items-end justify-between h-32 gap-2">
                  {stats.chartData.map((day, i) => {
                    const heightPercent = (day.value / stats.maxChartValue) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative flex items-end h-full">
                           <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: `${heightPercent}%` }}
                             transition={{ duration: 0.5, delay: i * 0.1 }}
                             className={`w-full rounded-t-md min-h-[4px] transition-all ${day.value > 0 ? 'bg-emerald-500 group-hover:bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                           >
                              {day.value > 0 && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                                  R$ {day.value}
                                </div>
                              )}
                           </motion.div>
                        </div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold">{day.dayName.replace('.','')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* History List */}
              <div>
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
                   <Calendar size={16} /> Histórico de Conclusão
                </h3>
                
                {historyItems.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400 text-sm italic border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                    Nenhuma tarefa concluída ainda.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {historyItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div>
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 line-through decoration-zinc-300 dark:decoration-zinc-700">{item.title}</p>
                          <p className="text-[10px] text-zinc-400">
                            {item.completedAt ? new Date(item.completedAt).toLocaleString('pt-BR') : '-'}
                          </p>
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                          +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};