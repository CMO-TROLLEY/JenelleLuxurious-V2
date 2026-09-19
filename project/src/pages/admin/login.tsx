import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useSEO } from '@/hooks/use-seo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AdminLoginPage() {
  useSEO({ title: 'Admin Login | Jenelle Luxurious', description: 'Sign in to the Jenelle Luxurious admin dashboard.', canonical: 'https://jenelleluxurious.co.sz/admin/login', noindex: true });

  const { signIn, signUp, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAdmin) navigate('/admin', { replace: true });
  }, [isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full gradient-rose"><Sparkles className="h-7 w-7 text-white" aria-hidden="true" /></div>
          <h1 className="font-serif text-2xl font-semibold text-plum">Jenelle Luxurious</h1>
          <p className="mt-1 text-sm text-muted-foreground">Admin Dashboard Access</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@jenelleluxurious.co.sz" required /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} /></div>

            {error && <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <Button type="submit" disabled={submitting} className="w-full rounded-full bg-primary py-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {submitting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" /> : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
              className={cn('text-xs text-muted-foreground transition-colors hover:text-primary')}>
              {mode === 'signin' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to="/book" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="h-3 w-3" />Back to booking site</Link>
        </div>
      </motion.div>
    </div>
  );
}
