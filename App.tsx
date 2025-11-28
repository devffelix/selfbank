import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { Shop } from './components/Shop';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { History } from './components/History';
import { RewardModal } from './components/RewardModal';
import { AppState, GrindItem, ItemType, RewardItem, Goal } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutList, Repeat, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

// Custom Hook for LocalStorage (Usado apenas no modo Offline ou como cache)
function useLocalStorage<T>(key: string, initialValue: T, userId: string | undefined): [T, (value: T | ((val: T) => T)) => void] {
  const storageKey = userId ? `${key}_${userId}` : null;
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (!storageKey) {
        setStoredValue(initialValue);
        return;
    }
    try {
      const item = window.localStorage.getItem(storageKey);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(error);
      setStoredValue(initialValue);
    }
  }, [storageKey]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? (value as (val: T) => T)(storedValue) : value;
      setStoredValue(valueToStore);
      if (storageKey) {
        window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

const INITIAL_STATE: AppState = {
  balance: 0,
  goal: { title: 'Nova Meta', targetAmount: 1000 },
  items: [],
  rewards: []
};

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  // --- SUPABASE AUTH INIT ---
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        if (session) setShowLanding(false);
      }
    }).catch((err) => console.warn("Erro conexão:", err))
      .finally(() => { if (mounted) setLoadingSession(false); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setLoadingSession(false);
        if(session) {
            setOfflineMode(false);
            setShowLanding(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id || (offlineMode ? 'offline_user' : undefined);
  
  // Local State handles the UI rendering instantly (Optimistic UI)
  const [state, setState] = useLocalStorage<AppState>('selfbank_data', INITIAL_STATE, userId);
  
  // --- DATA SYNC LOGIC ---
  useEffect(() => {
    if (!session?.user) return;

    const loadDataFromSupabase = async () => {
      try {
        const user = session.user;

        // 1. Load Settings (Balance & Goal)
        let { data: settings, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsError && settingsError.code === 'PGRST116') {
          // User doesn't exist in settings yet, create default
          const { data: newSettings, error: createError } = await supabase
            .from('user_settings')
            .insert([{ user_id: user.id, balance: 0, goal_title: 'Nova Meta', goal_amount: 1000 }])
            .select()
            .single();
          
          if (!createError) settings = newSettings;
        }

        // 2. Load Items (Include completed items for history)
        const { data: items } = await supabase
          .from('items')
          .select('*')
          .eq('user_id', user.id);

        // 3. Load Rewards
        const { data: rewards } = await supabase
          .from('rewards')
          .select('*')
          .eq('user_id', user.id);

        // Merge to State
        if (settings) {
            setState(prev => ({
                ...prev,
                balance: settings.balance,
                goal: { title: settings.goal_title, targetAmount: settings.goal_amount },
                items: items?.map((i: any) => ({
                    id: i.id,
                    title: i.title,
                    value: i.value,
                    type: i.type,
                    createdAt: Number(i.created_at),
                    lastCompletedDate: i.last_completed_date,
                    completedAt: i.completed_at ? Number(i.completed_at) : null
                })) || [],
                rewards: rewards?.map((r: any) => ({
                    id: r.id,
                    title: r.title,
                    cost: r.cost
                })) || []
            }));
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadDataFromSupabase();
  }, [session]); // Runs when session becomes available

  // Helper to sync user_settings update
  const syncSettings = async (newBalance: number, newGoal: Goal) => {
    if (!session?.user) return;
    await supabase.from('user_settings').upsert({
      user_id: session.user.id,
      balance: newBalance,
      goal_title: newGoal.title,
      goal_amount: newGoal.targetAmount
    });
  };

  const [activeTab, setActiveTab] = useState<'tasks' | 'habits' | 'shop'>('tasks');
  const [confetti, setConfetti] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
      const savedTheme = window.localStorage.getItem('grindgoal_theme') as 'dark' | 'light';
      if(savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    window.localStorage.setItem('grindgoal_theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const playSound = (type: 'coin' | 'register') => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'coin') {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  };

  // --- HANDLERS (With Supabase Sync) ---

  const handleAddItem = async (title: string, value: number, type: ItemType) => {
    const tempId = crypto.randomUUID();
    const newItem: GrindItem = {
      id: tempId,
      title,
      value,
      type,
      createdAt: Date.now(),
      lastCompletedDate: null,
      completedAt: null
    };

    // Optimistic Update
    setState(prev => ({ ...prev, items: [newItem, ...prev.items] }));

    if (session?.user) {
        const { data, error } = await supabase.from('items').insert([{
            user_id: session.user.id,
            title,
            value,
            type,
            created_at: newItem.createdAt,
            last_completed_date: null,
            completed_at: null
        }]).select().single();

        // Update local ID with real DB ID if needed, mainly for future interactions
        if (data && !error) {
            setState(prev => ({
                ...prev,
                items: prev.items.map(i => i.id === tempId ? { ...i, id: data.id } : i)
            }));
        }
    }
  };

  const handleCompleteItem = async (id: string) => {
    const item = state.items.find(i => i.id === id);
    if (!item) return;

    playSound('coin');
    if (navigator.vibrate) navigator.vibrate(50);

    const today = new Date().toISOString().split('T')[0];
    const now = Date.now();
    let newItems = [...state.items];

    // Optimistic Logic
    if (item.type === 'TASK') {
        // Instead of deleting, we set completedAt
        newItems = newItems.map(i => i.id === id ? { ...i, completedAt: now } : i);
    } else {
        // Habits
        newItems = newItems.map(i => i.id === id ? { ...i, lastCompletedDate: today } : i);
    }

    const newBalance = state.balance + item.value;
    setState(prev => ({ ...prev, balance: newBalance, items: newItems }));

    // Confetti Check
    if (newBalance >= state.goal.targetAmount && state.balance < state.goal.targetAmount) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
    }

    // Supabase Sync
    if (session?.user) {
        // Update Balance
        syncSettings(newBalance, state.goal);

        if (item.type === 'TASK') {
            await supabase.from('items').update({ completed_at: now }).eq('id', id);
        } else {
            await supabase.from('items').update({ last_completed_date: today }).eq('id', id);
        }
    }
  };

  const handleDeleteItem = async (id: string) => {
    setState(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
    if (session?.user) {
        await supabase.from('items').delete().eq('id', id);
    }
  };

  const handleAddReward = async (title: string, cost: number) => {
    const tempId = crypto.randomUUID();
    const newReward: RewardItem = { id: tempId, title, cost };
    
    setState(prev => ({ ...prev, rewards: [...prev.rewards, newReward] }));

    if (session?.user) {
        const { data } = await supabase.from('rewards').insert([{
            user_id: session.user.id,
            title,
            cost
        }]).select().single();

        if (data) {
             setState(prev => ({
                ...prev,
                rewards: prev.rewards.map(r => r.id === tempId ? { ...r, id: data.id } : r)
            }));
        }
    }
  };

  const handleRedeemReward = async (reward: RewardItem) => {
    if (state.balance < reward.cost) return;
    playSound('register');
    
    const newBalance = state.balance - reward.cost;
    setState(prev => ({ ...prev, balance: newBalance }));

    if (session?.user) {
        syncSettings(newBalance, state.goal);
    }
  };

  const handleDeleteReward = async (id: string) => {
    setState(prev => ({ ...prev, rewards: prev.rewards.filter(r => r.id !== id) }));
    if (session?.user) {
        await supabase.from('rewards').delete().eq('id', id);
    }
  };

  const handleUpdateGoal = async (newGoal: Goal) => {
      setState(prev => ({ ...prev, goal: newGoal }));
      if (session?.user) {
          syncSettings(state.balance, newGoal);
      }
  };

  const handleResetData = async () => {
      setState(INITIAL_STATE);
      if(session?.user) {
          await supabase.from('items').delete().eq('user_id', session.user.id);
          await supabase.from('rewards').delete().eq('user_id', session.user.id);
          await supabase.from('user_settings').update({ balance: 0, goal_title: 'Nova Meta', goal_amount: 1000 }).eq('user_id', session.user.id);
      }
  }

  // Loading Screen
  if (loadingSession) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-emerald-500 transition-colors">
              <Loader2 className="animate-spin" size={40} />
          </div>
      )
  }

  // Routing
  if (showLanding && !session && !offlineMode) {
      return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  if (!session && !offlineMode) {
      return <Auth 
        onOfflineClick={() => { setOfflineMode(true); setShowLanding(false); }} 
        onBackToHome={() => setShowLanding(true)}
      />;
  }

  // Filter Active Items (Exclude Completed Tasks)
  const activeItems = state.items.filter(item => {
      if (item.type === 'TASK' && item.completedAt) return false;
      return true;
  });

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300 relative overflow-hidden">
      
      {/* --- BACKGROUND GRADIENTS (AURORA EFFECT) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Top Left Orb */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal" />
          {/* Bottom Right Orb */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal" />
          {/* Center Subtle Hint */}
          <div className="absolute top-[30%] left-[20%] w-[30vw] h-[30vw] bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Confetti Overlay (Z-index high) */}
      <AnimatePresence>
        {confetti && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-emerald-500 rounded-sm"
                initial={{ x: Math.random() * window.innerWidth, y: -20, rotate: 0 }}
                animate={{ y: window.innerHeight + 20, rotate: 360, x: `calc(${Math.random() * 100}vw + ${(Math.random() - 0.5) * 200}px)` }}
                transition={{ duration: Math.random() * 2 + 2, ease: "linear", repeat: Infinity }}
                style={{ backgroundColor: ['#10b981', '#fbbf24', '#3b82f6'][Math.floor(Math.random() * 3)] }}
              />
            ))}
            <div className="text-center">
              <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400 drop-shadow-2xl">META ATINGIDA!</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <History 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        items={state.items} // Pass all items (including completed)
      />
      
      {/* GLOBAL REWARD MODAL (LIFTED STATE) */}
      <RewardModal 
        isOpen={isRewardModalOpen} 
        onClose={() => setIsRewardModalOpen(false)} 
        onConfirm={handleAddReward} 
      />

      {/* MAIN CONTENT WRAPPER (Z-INDEX 10) */}
      <div className="relative z-10">
        <Header 
            balance={state.balance} 
            goal={state.goal} 
            onUpdateGoal={handleUpdateGoal}
            onResetData={handleResetData}
            onOpenHistory={() => setIsHistoryOpen(true)}
            isDark={theme === 'dark'}
            toggleTheme={toggleTheme}
            userEmail={session?.user.email || 'Modo Offline'}
        />

        <main className="max-w-4xl mx-auto px-4 md:px-8 pt-8">
            
            <TaskInput onAdd={handleAddItem} />

            {/* Desktop View: Grid */}
            <div className="hidden md:grid grid-cols-12 gap-8">
            <div className="col-span-4 space-y-4">
                <h3 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Repeat size={18} /> Hábitos Diários</h3>
                <TaskList items={activeItems} type="HABIT" onComplete={handleCompleteItem} onDelete={handleDeleteItem} />
            </div>
            <div className="col-span-4 space-y-4">
                <h3 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><LayoutList size={18} /> Lista de Tarefas</h3>
                <TaskList items={activeItems} type="TASK" onComplete={handleCompleteItem} onDelete={handleDeleteItem} />
            </div>
            <div className="col-span-4 space-y-4 border-l border-zinc-200 dark:border-zinc-800 pl-8 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-2xl backdrop-blur-sm">
                <Shop 
                  balance={state.balance} 
                  rewards={state.rewards} 
                  onOpenAddReward={() => setIsRewardModalOpen(true)}
                  onRedeem={handleRedeemReward}
                  onDelete={handleDeleteReward}
                />
            </div>
            </div>

            {/* Mobile View: Tabs Content */}
            <div className="md:hidden pb-20">
            <AnimatePresence mode="wait">
                {activeTab === 'tasks' && (
                <motion.div 
                    key="tasks"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="mb-8">
                    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Lista de Tarefas</h3>
                    <TaskList items={activeItems} type="TASK" onComplete={handleCompleteItem} onDelete={handleDeleteItem} />
                    </div>
                </motion.div>
                )}
                
                {activeTab === 'habits' && (
                <motion.div 
                    key="habits"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="mb-8">
                    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Hábitos Diários</h3>
                    <TaskList items={activeItems} type="HABIT" onComplete={handleCompleteItem} onDelete={handleDeleteItem} />
                    </div>
                </motion.div>
                )}

                {activeTab === 'shop' && (
                <motion.div 
                    key="shop"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                >
                    <Shop 
                      balance={state.balance} 
                      rewards={state.rewards} 
                      onOpenAddReward={() => setIsRewardModalOpen(true)}
                      onRedeem={handleRedeemReward}
                      onDelete={handleDeleteReward}
                    />
                </motion.div>
                )}
            </AnimatePresence>
            </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Z-INDEX 40) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 p-2 z-40">
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => setActiveTab('habits')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors ${activeTab === 'habits' ? 'bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <Repeat size={20} />
            <span className="text-[10px] mt-1 font-medium">Hábitos</span>
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors ${activeTab === 'tasks' ? 'bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <LayoutList size={20} />
            <span className="text-[10px] mt-1 font-medium">Tarefas</span>
          </button>
          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors ${activeTab === 'shop' ? 'bg-zinc-100 dark:bg-zinc-800 text-amber-500 dark:text-amber-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <ShoppingBag size={20} />
            <span className="text-[10px] mt-1 font-medium">Loja</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default App;