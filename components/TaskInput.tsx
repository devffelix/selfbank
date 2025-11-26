import React, { useState } from 'react';
import { Plus, Repeat, CheckSquare } from 'lucide-react';
import { Button } from './ui/Button';
import { ItemType } from '../types';

interface TaskInputProps {
  onAdd: (title: string, value: number, type: ItemType) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState<ItemType>('TASK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !value) return;
    
    onAdd(title, parseFloat(value), type);
    setTitle('');
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 mb-8 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Type Toggle */}
        <div className="md:col-span-3 flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setType('TASK')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
              type === 'TASK' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <CheckSquare size={14} /> Tarefa
          </button>
          <button
            type="button"
            onClick={() => setType('HABIT')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
              type === 'HABIT' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Repeat size={14} /> Hábito
          </button>
        </div>

        {/* Inputs */}
        <div className="md:col-span-5">
          <input
            type="text"
            placeholder={type === 'TASK' ? "O que precisa ser feito?" : "Nome do hábito diário..."}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-2 relative">
          <span className="absolute left-3 top-2.5 text-emerald-600 dark:text-emerald-500 font-mono">R$</span>
          <input
            type="number"
            placeholder="0,00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-zinc-900 dark:text-white font-mono placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <Button type="submit" fullWidth className="h-full">
            <Plus size={18} className="mr-1" /> Adicionar
          </Button>
        </div>
      </div>
    </form>
  );
};