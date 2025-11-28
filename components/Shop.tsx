import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Check, Gift } from 'lucide-react';
import { RewardItem } from '../types';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopProps {
  balance: number;
  rewards: RewardItem[];
  onOpenAddReward: () => void;
  onRedeem: (reward: RewardItem) => void;
  onDelete: (id: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ balance, rewards, onOpenAddReward, onRedeem, onDelete }) => {
  // Track specific item currently being purchased for animation
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const handleBuy = (reward: RewardItem) => {
      onRedeem(reward);
      setPurchasingId(reward.id);
      setTimeout(() => setPurchasingId(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="text-amber-500" /> Loja
        </h2>
        <Button size="sm" variant="secondary" onClick={onOpenAddReward} className="h-auto py-2.5 px-4">
          <Plus size={16} className="mr-1" /> Nova Recompensa
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rewards.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
            <Gift className="mx-auto mb-3 opacity-20" size={48} />
            <p>Nenhuma recompensa configurada.</p>
            <button onClick={onOpenAddReward} className="text-emerald-500 text-sm mt-2 hover:underline">Criar a primeira</button>
          </div>
        )}
        
        <AnimatePresence mode="popLayout">
            {rewards.map(reward => {
            const canAfford = balance >= reward.cost;
            const isPurchasing = purchasingId === reward.id;

            return (
                <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1,
                    borderColor: isPurchasing ? '#fbbf24' : '', // Flash Amber
                    backgroundColor: isPurchasing ? 'rgba(251, 191, 36, 0.1)' : '' 
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={reward.id}
                className={`
                    relative p-5 rounded-xl border flex flex-col justify-between group overflow-hidden transition-all duration-300
                    ${canAfford && !isPurchasing
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 shadow-sm' 
                    : !isPurchasing ? 'bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-60 grayscale-[0.5]' : ''
                    }
                    ${isPurchasing ? 'border-amber-500 ring-2 ring-amber-500/20' : ''}
                `}
                >
                {/* Overlay for purchase feedback */}
                <AnimatePresence>
                    {isPurchasing && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-amber-500/90 flex items-center justify-center z-10"
                        >
                            <motion.div 
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1.2 }}
                                className="text-white font-bold flex flex-col items-center"
                            >
                                <Check size={32} strokeWidth={4} />
                                <span className="text-sm mt-1">RESGATADO!</span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 leading-tight">{reward.title}</h3>
                    <span className={`font-mono font-bold whitespace-nowrap ${canAfford ? 'text-amber-500 dark:text-amber-400' : 'text-zinc-500'}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reward.cost)}
                    </span>
                </div>
                
                <div className="flex gap-2 mt-auto">
                    <Button 
                    fullWidth 
                    size="sm" 
                    disabled={!canAfford || isPurchasing}
                    onClick={() => handleBuy(reward)}
                    className={canAfford ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-900/20' : ''}
                    >
                    {canAfford ? 'Comprar' : 'Faltam fundos'}
                    </Button>
                    <button 
                    onClick={() => onDelete(reward.id)}
                    className="p-2 text-zinc-400 dark:text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Excluir recompensa"
                    disabled={isPurchasing}
                    >
                    <Trash2 size={16} />
                    </button>
                </div>
                </motion.div>
            );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};