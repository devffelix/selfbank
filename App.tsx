import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { Shop } from './components/Shop';
import { TipsWidget } from './components/TipsWidget'; // IMPORT ADDED
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { History } from './components/History';
import { RewardModal } from './components/RewardModal';
import { AppState, GrindItem, ItemType, RewardItem, Goal } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutList, Repeat, Loader2 } from 'lucide-react';
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

  const handleLogout = async () => {
    if (offlineMode) {
        setOfflineMode(false);
        setShowLanding(true);
    } else {
        await supabase.auth.signOut();
        setSession(null);
        setShowLanding(true);
    }
  };

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
                style={{ backgroundColor: ['#10b981', '#fbbf24', '#3b82f6'][i % 3] }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        {/* HEADER */}
        <Header 
            balance={state.balance} 
            goal={state.goal} 
            items={state.items}
            onUpdateGoal={handleUpdateGoal}
            onResetData={handleResetData}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onLogout={handleLogout}
            isDark={theme === 'dark'}
            toggleTheme={toggleTheme}
            userEmail={session?.user?.email || (offlineMode ? 'Modo Offline' : undefined)}
        />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 max-w-4xl mx-auto lg:max-w-none">
            
            {/* LEFT COLUMN: PRODUCTION ZONE (65%) */}
            <div className="lg:col-span-8 space-y-8">
                <TaskInput onAdd={handleAddItem} />

                {/* HABITS SECTION */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <Repeat size={18} className="text-zinc-400" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Hábitos Diários</h3>
                    </div>
                    {/* Using simple flex wrap for habits if TaskList renders items as flex rows */}
                    <div className="grid grid-cols-1 gap-3">
                        <TaskList 
                            items={state.items} 
                            type="HABIT" 
                            onComplete={handleCompleteItem} 
                            onDelete={handleDeleteItem} 
                        />
                    </div>
                </section>

                {/* TASKS SECTION */}
                <section>
                     <div className="flex items-center gap-2 mb-4 px-2">
                        <LayoutList size={18} className="text-zinc-400" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Lista de Tarefas</h3>
                    </div>
                    <TaskList 
                        items={state.items} 
                        type="TASK" 
                        onComplete={handleCompleteItem} 
                        onDelete={handleDeleteItem} 
                    />
                </section>
            </div>

            {/* RIGHT COLUMN: CONSUMPTION ZONE (35%) */}
            <div className="lg:col-span-4">
                <div className="sticky top-24">
                    <Shop 
                        balance={state.balance} 
                        rewards={state.rewards} 
                        onOpenAddReward={() => setIsRewardModalOpen(true)} 
                        onRedeem={handleRedeemReward} 
                        onDelete={handleDeleteReward}
                    />
                    
                    {/* TIPS WIDGET ADDED HERE */}
                    <TipsWidget />
                </div>
            </div>
        </div>
      </div>

      {/* MODALS */}
      <History 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        items={state.items} 
      />
      
      <RewardModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        onConfirm={handleAddReward}
      />
    </div>
  );
}

export default App;