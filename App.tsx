import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { Shop } from './components/Shop';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { AppState, GrindItem, ItemType, RewardItem } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutList, Repeat, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

// Custom Hook for LocalStorage that respects User ID
function useLocalStorage<T>(key: string, initialValue: T, userId: string | undefined): [T, (value: T) => void] {
  // Construct a key that includes the User ID so users don't see each other's data
  const storageKey = userId ? `${key}_${userId}` : null;

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load data when userId or key changes
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

  const setValue = (value: T) => {
    if (!storageKey) return;
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
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

  // Initialize Supabase Auth Listener
  useEffect(() => {
    let mounted = true;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        if (session) setShowLanding(false); // Skip landing if logged in
      }
    }).catch((err) => {
      console.warn("Supabase connection error (offline?):", err);
    }).finally(() => {
      if (mounted) setLoadingSession(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

  // Determine effective User ID (Supabase ID or Local Offline ID)
  const userId = session?.user?.id || (offlineMode ? 'offline_user' : undefined);

  // Pass user ID to storage hook to isolate data
  const [state, setState] = useLocalStorage<AppState>('selfbank_data', INITIAL_STATE, userId);
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits' | 'shop'>('tasks');
  const [confetti, setConfetti] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load theme from generic local storage (shared across users on same device is fine for theme)
  useEffect(() => {
      const savedTheme = window.localStorage.getItem('grindgoal_theme') as 'dark' | 'light';
      if(savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    window.localStorage.setItem('grindgoal_theme', newTheme);
  };

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Sound Effect Simulation
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

  // Reset Habits Daily logic
  useEffect(() => {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    const lastResetKey = `grindgoal_last_reset_${userId}`;
    const lastReset = localStorage.getItem(lastResetKey);
    
    if (lastReset !== today) {
      localStorage.setItem(lastResetKey, today);
    }
  }, [userId]);

  const handleAddItem = (title: string, value: number, type: ItemType) => {
    const newItem: GrindItem = {
      id: crypto.randomUUID(),
      title,
      value,
      type,
      createdAt: Date.now(),
      lastCompletedDate: null
    };
    setState({ ...state, items: [newItem, ...state.items] });
  };

  const handleCompleteItem = (id: string) => {
    const item = state.items.find(i => i.id === id);
    if (!item) return;

    playSound('coin');

    // Vibration on mobile
    if (navigator.vibrate) navigator.vibrate(50);

    const today = new Date().toISOString().split('T')[0];
    let newItems = [...state.items];

    if (item.type === 'TASK') {
      newItems = newItems.filter(i => i.id !== id);
    } else {
      newItems = newItems.map(i => i.id === id ? { ...i, lastCompletedDate: today } : i);
    }

    const newBalance = state.balance + item.value;
    setState({
      ...state,
      balance: newBalance,
      items: newItems
    });

    // Confetti Check
    if (newBalance >= state.goal.targetAmount && state.balance < state.goal.targetAmount) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
    }
  };

  const handleDeleteItem = (id: string) => {
    setState({ ...state, items: state.items.filter(i => i.id !== id) });
  };

  const handleAddReward = (title: string, cost: number) => {
    const newReward: RewardItem = { id: crypto.randomUUID(), title, cost };
    setState({ ...state, rewards: [...state.rewards, newReward] });
  };

  const handleRedeemReward = (reward: RewardItem) => {
    if (state.balance < reward.cost) return;
    playSound('register');
    setState({ ...state, balance: state.balance - reward.cost });
  };

  const handleDeleteReward = (id: string) => {
    setState({ ...state, rewards: state.rewards.filter(r => r.id !== id) });
  };

  if (loadingSession) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-emerald-500 transition-colors">
              <Loader2 className="animate-spin" size={40} />
          </div>
      )
  }

  // --- ROUTING LOGIC ---

  // 1. Logged in OR Offline Mode -> Show App
  if (session || offlineMode) {
    return (
        <div className="min-h-screen pb-24 md:pb-12 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
          
          {/* Confetti Overlay */}
          <AnimatePresence>
            {confetti && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
              >
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-500 rounded-sm"
                    initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: -20, 
                      rotate: 0 
                    }}
                    animate={{ 
                      y: window.innerHeight + 20, 
                      rotate: 360,
                      x: `calc(${Math.random() * 100}vw + ${(Math.random() - 0.5) * 200}px)`
                    }}
                    transition={{ 
                      duration: Math.random() * 2 + 2, 
                      ease: "linear",
                      repeat: Infinity 
                    }}
                    style={{
                      backgroundColor: ['#10b981', '#fbbf24', '#3b82f6'][Math.floor(Math.random() * 3)]
                    }}
                  />
                ))}
                <div className="text-center">
                  <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400 drop-shadow-2xl">META ATINGIDA!</h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    
          <Header 
            balance={state.balance} 
            goal={state.goal} 
            onUpdateGoal={(g) => setState({ ...state, goal: g })}
            onResetData={() => setState(INITIAL_STATE)}
            isDark={theme === 'dark'}
            toggleTheme={toggleTheme}
            userEmail={session?.user.email || 'Offline Mode'}
          />
    
          <main className="max-w-4xl mx-auto px-4 md:px-8 pt-8">
            
            <TaskInput onAdd={handleAddItem} />
    
            {/* Desktop View: Grid */}
            <div className="hidden md:grid grid-cols-12 gap-8">
              <div className="col-span-4 space-y-4">
                <h3 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Repeat size={18} /> Hábitos Diários</h3>
                <TaskList items={state.items} type="HABIT" onComplete={handleCompleteItem} onDelete={handleDeleteItem} />
              </div>
              <div className="col-span-4 space-y-4">
                <h3 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><LayoutList size={18} /> Lista de Tarefas</h3>
                <TaskList items={state.items} type="TASK" onComplete={handleCompleteItem} onDelete={handleDeleteItem} />
              </div>
              <div className="col-span-4 space-y-4 border-l border-zinc-200 dark:border-zinc-800 pl-8">
                 <Shop 
                   balance={state.balance} 
                   rewards={state.rewards} 
                   onAddReward={handleAddReward}
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
                      <TaskList items={state.items} type="TASK" onComplete={handleCompleteItem} onDelete={handleDeleteItem} />
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
                      <TaskList items={state.items} type="HABIT" onComplete={handleCompleteItem} onDelete={handleDeleteItem} />
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
                      onAddReward={handleAddReward}
                      onRedeem={handleRedeemReward}
                      onDelete={handleDeleteReward}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
    
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 p-2 z-40">
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

  // 2. Landing Page
  if (showLanding) {
      return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  // 3. Auth
  return <Auth 
    onOfflineClick={() => {
      setOfflineMode(true);
      setShowLanding(false); // Ensure landing doesn't reappear
    }} 
    onBackToHome={() => setShowLanding(true)}
  />;
}

export default App;