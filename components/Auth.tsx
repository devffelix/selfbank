import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, CheckCircle, WifiOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Button } from './ui/Button';
import { Logo, LogoPath } from './Logo';

interface AuthProps {
  onOfflineClick: () => void;
  onBackToHome: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onOfflineClick, onBackToHome }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const translateError = (msg: string) => {
    if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (msg.includes('User already registered')) return 'Este e-mail já está cadastrado.';
    if (msg.includes('Password should be at least')) return 'A senha deve ter no mínimo 6 caracteres.';
    if (msg.includes('valid email')) return 'Insira um e-mail válido.';
    if (msg.includes('Failed to fetch')) return 'connection_error';
    return msg;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Verifica se o login foi imediato ou requer confirmação
        if (data.user && !data.session) {
            setSuccessMsg("Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro antes de entrar.");
            setIsSignUp(false); // Volta para tela de login
        } else if (data.session) {
            // Login automático (se email confirm estiver desligado no supabase)
            // O App.tsx vai detectar a sessão automaticamente
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      const msg = translateError(err.message || 'Ocorreu um erro desconhecido.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors relative overflow-hidden">
      
      {/* Background Logo Effect */}
      <motion.svg
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 0.03, scale: 1, rotate: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute -right-20 -bottom-20 w-[150%] h-[150%] md:w-[800px] md:h-[800px] text-emerald-500 pointer-events-none"
      >
         <path d={LogoPath} />
      </motion.svg>

      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
        <button 
            onClick={onBackToHome}
            className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors font-medium text-sm px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
            <ArrowLeft size={20} /> Voltar para o início
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden z-10"
      >
        <div className="text-center mb-8 relative z-10">
            <div className="flex justify-center mb-6">
                <Logo size="lg" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">SelfBank</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
                {isSignUp ? 'Crie sua conta para salvar o progresso.' : 'Entre para continuar seu grind.'}
            </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
            <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm p-4 rounded-xl flex items-start gap-3 mb-4"
              >
                <CheckCircle size={18} className="mt-0.5 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg flex flex-col items-center text-center mb-4"
              >
                {error === 'connection_error' ? (
                    <div className="space-y-2 w-full">
                         <div className="flex items-center justify-center gap-2 font-bold">
                            <WifiOff size={16} /> Falha na Conexão
                         </div>
                         <p className="text-xs opacity-90">Não foi possível conectar ao servidor.</p>
                         <Button 
                            type="button" 
                            size="sm"
                            variant="secondary"
                            fullWidth 
                            onClick={onOfflineClick}
                            className="mt-2 bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 border-0"
                         >
                            Entrar Offline
                         </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-zinc-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder-zinc-400"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-zinc-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder-zinc-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
            className="h-12 text-base shadow-emerald-500/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
                <span className="flex items-center justify-center gap-2">
                    {isSignUp ? 'Criar Conta' : 'Entrar'} <ArrowRight size={18} />
                </span>
            )}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">Ou</span>
            </div>
          </div>

          <Button type="button" variant="secondary" fullWidth onClick={onOfflineClick} className="text-sm">
            <WifiOff size={16} className="mr-2" /> Usar Modo Offline (Sem Login)
          </Button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            <button
              onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccessMsg(null);
              }}
              className="ml-2 font-medium text-emerald-600 dark:text-emerald-400 hover:underline focus:outline-none"
            >
              {isSignUp ? 'Fazer Login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};