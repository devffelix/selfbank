import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, ArrowRight, Gift, Star } from 'lucide-react';
import { Button } from './ui/Button';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string, cost: number) => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Dica, 2 = Form
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTitle('');
      setCost('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !cost) return;
    
    // Replace comma with dot for brazilian currency input
    const cleanCost = cost.replace(',', '.');
    onConfirm(title, parseFloat(cleanCost));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop Escuro Focado */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-800"
          >
            {/* Botão Fechar */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-20 p-2 hover:bg-zinc-800 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  /* PASSO 1: DICA */
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-6 border border-amber-500/20 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]">
                      <Lightbulb size={32} />
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <h3 className="text-2xl font-bold text-white">Psicologia do Prêmio</h3>
                      <p className="text-zinc-400 leading-relaxed text-sm">
                        Recompensas funcionam melhor quando são itens de <strong>"desejo imediato"</strong> ou luxos que você evita comprar.
                      </p>
                      
                      <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 text-left">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Bons Exemplos:</div>
                          <ul className="space-y-3">
                              <li className="flex items-center gap-3 text-sm text-zinc-300">
                                  <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-[10px]"><Star size={10} fill="currentColor"/></div>
                                  Pedir Delivery (R$ 60,00)
                              </li>
                              <li className="flex items-center gap-3 text-sm text-zinc-300">
                                  <div className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-[10px]"><Star size={10} fill="currentColor"/></div>
                                  Skin no Jogo (R$ 45,00)
                              </li>
                          </ul>
                      </div>
                    </div>

                    <Button fullWidth onClick={() => setStep(2)} className="bg-amber-500 hover:bg-amber-600 text-white h-12 shadow-amber-500/20">
                      Entendi, vamos criar <ArrowRight size={18} className="ml-2" />
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
                    className="space-y-6 pt-2"
                  >
                    <div className="text-center mb-8">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-4 border border-emerald-500/20">
                          <Gift size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Nova Recompensa</h3>
                      <p className="text-sm text-zinc-400">O que vamos conquistar hoje?</p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide ml-1">Nome do Item</label>
                        <input
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder-zinc-600"
                          placeholder="Ex: Jantar Japonês"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          autoFocus
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wide ml-1">Custo (R$)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5 text-zinc-500 font-bold text-lg">R$</span>
                          <input
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-white font-mono text-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder-zinc-600"
                            type="number"
                            placeholder="0,00"
                            value={cost}
                            onChange={e => setCost(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-6">
                      <Button type="button" variant="secondary" fullWidth onClick={() => setStep(1)} className="h-12 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white">
                        Voltar
                      </Button>
                      <Button type="submit" fullWidth className="bg-amber-500 hover:bg-amber-600 text-white h-12 shadow-amber-500/20">
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
  );
};