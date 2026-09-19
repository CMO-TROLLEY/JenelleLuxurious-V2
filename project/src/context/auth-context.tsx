import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        checkAdmin(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        (async () => {
          await checkAdmin(newSession.user.id);
        })();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkAdmin(userId: string) {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      setIsAdmin(data.is_admin);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signUp(email: string, password: string): Promise<{ error: string | null }> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    if (!data.user) return { error: null };

    if (!data.session) {
      return { error: 'Check your email to confirm your account, then sign in.' };
    }

    const { error: profileError } = await supabase.from('admin_profiles').insert({
      user_id: data.user.id,
      is_admin: true,
    });

    if (profileError) {
      return { error: profileError.message };
    }

    await checkAdmin(data.user.id);

    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
