import { motion } from 'framer-motion';
import { Check, ShoppingBag, Battery, Wifi, Signal } from 'lucide-react';

export const Mockup = () => {
  return (
    <div className="relative mx-auto border-zinc-800 bg-zinc-950 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl flex flex-col overflow-hidden select-none">
      {/* Notch / Status Bar */}
      <div className="h-8 bg-zinc-950 w-full absolute top-0 left-0 z-20 flex items-center justify-between px-6">
        <span className="text-[10px] font-medium text-white">9:41</span>
        <div className="flex gap-1.5 text-white">
            <Signal size={10} />
            <Wifi size={10} />
            <Battery size={10} />
        </div>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-zinc-950 rounded-b-3xl z-20"></div>

      {/* App Content Simulation */}
      <div className="flex-1 bg-zinc-950 pt-12 px-4 pb-4 overflow-hidden relative">
        
        {/* Header Sim */}
        <div className="mb-6">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <div className="text-zinc-500 text-[10px]">Meta Atual</div>
                    <div className="text-white font-bold text-lg">PS5 Pro</div>
                </div>
                <div className="text-right">
                    <div className="text-zinc-500 text-[10px]">Saldo</div>
                    <div className="text-emerald-400 font-mono font-bold text-xl">R$ 450,00</div>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-1">
                <motion.div 
                    initial={{ width: "10%" }}
                    animate={{ width: "45%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                    className="h-full bg-emerald-500" 
                />
            </div>
            <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
                <span>45%</span>
                <span>Meta: R$ 1.000</span>
            </div>
        </div>

        {/* Input Sim */}
        <div className="bg-zinc-900 rounded-xl p-3 mb-6 border border-zinc-800 flex gap-2 items-center">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <span className="text-xs font-bold">+</span>
            </div>
            <div className="h-2 w-24 bg-zinc-800 rounded-full"></div>
            <div className="ml-auto h-4 w-12 bg-zinc-800 rounded-md"></div>
        </div>

        {/* List Sim */}
        <div className="space-y-3">
            <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Hoje</div>
            
            {/* Item 1 */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center"></div>
                    <div className="space-y-1">
                        <div className="w-24 h-2 bg-zinc-700 rounded-full"></div>
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full"></div>
                    </div>
                </div>
                <div className="text-emerald-500 text-xs font-mono font-bold">+R$ 20</div>
            </motion.div>

             {/* Item 2 (Checking animation) */}
             <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-zinc-950">
                        <Check size={10} strokeWidth={4} />
                    </div>
                    <div className="space-y-1">
                        <div className="w-20 h-2 bg-zinc-600 rounded-full opacity-50"></div>
                    </div>
                </div>
                <div className="text-zinc-600 text-xs font-mono font-bold line-through">+R$ 15</div>
            </motion.div>

            {/* Item 3 */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between opacity-60"
            >
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-zinc-600"></div>
                    <div className="space-y-1">
                        <div className="w-28 h-2 bg-zinc-700 rounded-full"></div>
                    </div>
                </div>
                <div className="text-emerald-500 text-xs font-mono font-bold">+R$ 50</div>
            </motion.div>
        </div>

        {/* Shop Teaser */}
        <div className="mt-8">
            <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Recompensas</div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50 flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                    <ShoppingBag size={14} />
                </div>
                <div className="w-20 h-2 bg-zinc-700 rounded-full"></div>
            </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="h-1 bg-white/20 w-1/3 mx-auto rounded-full mb-2 absolute bottom-2 left-1/2 -translate-x-1/2"></div>
    </div>
  );
};