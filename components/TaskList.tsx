import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Repeat, Trash2, CalendarClock } from 'lucide-react';
import { GrindItem } from '../types';

interface TaskListProps {
  items: GrindItem[];
  type: 'TASK' | 'HABIT';
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ items, type, onComplete, onDelete }) => {
  const filteredItems = items.filter(item => {
      if (type === 'TASK') return item.type === 'TASK';
      if (type === 'HABIT') return item.type === 'HABIT';
      return false;
  });

  const isHabit = type === 'HABIT';

  // Sort: Tasks -> newest first. Habits -> completed ones at bottom.
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (isHabit) {
      // Check if completed today
      const today = new Date().toISOString().split('T')[0];
      const aDone = a.lastCompletedDate === today;
      const bDone = b.lastCompletedDate === today;
      if (aDone === bDone) return b.createdAt - a.createdAt;
      return aDone ? 1 : -1;
    }
    return b.createdAt - a.createdAt;
  });

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-4 text-zinc-500">
           {isHabit ? <Repeat size={20} /> : <CalendarClock size={20} />}
        </div>
        <p className="text-zinc-500 text-sm">Nenhum(a) {isHabit ? 'hábito' : 'tarefa'} encontrado(a). Adicione acima para começar o grind.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode='popLayout'>
        {sortedItems.map((item) => {
          const today = new Date().toISOString().split('T')[0];
          const isDoneToday = isHabit && item.lastCompletedDate === today;

          return (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              className={`
                group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                ${isDoneToday 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 opacity-70' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg shadow-zinc-200/50 dark:shadow-black/50'
                }
              `}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => onComplete(item.id)}
                  disabled={isDoneToday}
                  className={`
                    flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-200
                    ${isDoneToday 
                      ? 'bg-emerald-500 border-emerald-500 text-white cursor-default' 
                      : 'border-zinc-400 dark:border-zinc-600 text-transparent hover:border-emerald-500 hover:text-emerald-500 active:scale-90'
                    }
                  `}
                >
                  <Check size={14} strokeWidth={3} />
                </button>
                
                <div className="flex-1">
                  <h4 className={`text-sm font-medium transition-all ${isDoneToday ? 'text-zinc-400 dark:text-zinc-500 line-through decoration-zinc-400 dark:decoration-zinc-700' : 'text-zinc-700 dark:text-zinc-200'}`}>
                    {item.title}
                  </h4>
                  {isHabit && (
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
                       <Repeat size={10} /> Reseta Diariamente
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className={`font-mono font-bold text-sm ${isDoneToday ? 'text-zinc-400 dark:text-zinc-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
                 </div>
                 
                 <button 
                   onClick={() => onDelete(item.id)}
                   className="text-zinc-400 dark:text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                 >
                    <Trash2 size={16} />
                 </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};