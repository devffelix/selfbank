import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Gift, Lightbulb, ArrowRight, X } from 'lucide-react';
import { RewardItem } from '../types';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopProps {
  balance: number;
  rewards: RewardItem[];
  onAddReward: (title: string, cost: number) => void;
  onRedeem: (reward: RewardItem) => void;
  onDelete: (id: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ balance, rewards, onAddReward, onRedeem, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1 = Dica, 2 = Form
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');

  const handleOpenModal = () => {
    setStep(1);
    setTitle('');
    setCost('');
    setIsModalOpen(true);
  };

  const handleNext = () => setStep(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !cost) return;
    onAddReward(title, parseFloat(cost));
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="text-amber-500" /> Loja
        </h2>
        <Button size="sm" variant="secondary" onClick={handleOpenModal}>
          <Plus size={16} className="mr-1" /> Nova Recompensa
        </Button>
      </div>

      {/* MODAL DE CRIAÇÃO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 px-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
            >
              {/* Botão Fechar */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors z-10 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full"
              >
                <X size={18} />
              </button>

              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    /* PASSO 1: DICA */
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6 text-center"
                    >
                      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-2">
                        <Lightbulb size={32} />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Definindo Recompensas</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Recompensas funcionam melhor quando são itens de "desejo imediato" ou "luxos" que você evita comprar.
                          <br /><br />
                          Ao colocar um preço nelas aqui, você transforma a culpa do gasto em <strong>conquista por mérito</strong>.
                        </p>
                        <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 text-left mx-2">
                            <strong>Exemplos:</strong>
                            <ul className="list-disc ml-4 mt-1 space-y-1">
                                <li>Pedir Ifood (R$ 60,00)</li>
                                <li>Skin no Jogo (R$ 45,00)</li>
                                <li>1h de TikTok sem culpa (R$ 20,00)</li>
                            </ul>
                        </div>
                      </div>

                      <Button fullWidth onClick={handleNext} className="mt-4 bg-amber-500 hover:bg-amber-600 text-white">
                        Entendi, criar agora <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </motion.div>
                  ) : (
                    /* PASSO 2: FORMULÁRIO */
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Nova Recompensa</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">O que vamos conquistar hoje?</p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">Nome</label>
                          <input
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder-zinc-400"
                            placeholder="Ex: Jantar Japonês"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            autoFocus
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">Custo para Resgatar</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3.5 text-zinc-400 dark:text-zinc-500 font-bold">R$</span>
                            <input
                              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder-zinc-400"
                              type="number"
                              placeholder="0,00"
                              value={cost}
                              onChange={e => setCost(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" fullWidth onClick={() => setStep(1)}>
                          Voltar
                        </Button>
                        <Button type="submit" fullWidth className="bg-amber-500 hover:bg-amber-600 text-white">
                          Salvar Recompensa
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {rewards.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
            <Gift className="mx-auto mb-3 opacity-20" size={48} />
            <p>Nenhuma recompensa configurada.</p>
          </div>
        )}
        
        <AnimatePresence mode="popLayout">
            {rewards.map(reward => {
            const canAfford = balance >= reward.cost;
            return (
                <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={reward.id}
                className={`
                    relative p-5 rounded-xl border flex flex-col justify-between group overflow-hidden transition-colors
                    ${canAfford 
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 shadow-sm' 
                    : 'bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-60 grayscale-[0.5]'
                    }
                `}
                >
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
                    disabled={!canAfford}
                    onClick={() => onRedeem(reward)}
                    className={canAfford ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-900/20' : ''}
                    >
                    {canAfford ? 'Comprar' : 'Faltam fundos'}
                    </Button>
                    <button 
                    onClick={() => onDelete(reward.id)}
                    className="p-2 text-zinc-400 dark:text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Excluir recompensa"
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