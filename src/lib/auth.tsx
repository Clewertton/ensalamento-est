import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: 'admin' | 'user' | 'pending' | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | 'pending' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setRole(data.role as 'admin' | 'user' | 'pending');
    } else {
      setRole(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchRole(session.user.id);
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    // Validate UEA domain
    if (!email.endsWith('@uea.edu.br')) {
      return { error: { message: 'Apenas emails do domínio @uea.edu.br são permitidos.' } as AuthError };
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/validate`,
      },
    });

    if (authError || !authData.user) {
      return { error: authError };
    }

    // Check if this is the first user
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    const isFirstUser = !usersError && (!existingUsers || existingUsers.length === 0);

    // Create user record
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          role: isFirstUser ? 'admin' : 'pending',
        },
      ]);

    if (insertError) {
      return { error: insertError };
    }

    // If not first user, send approval request to admins
    if (!isFirstUser) {
      try {
        const { data: admins } = await supabase
          .from('users')
          .select('email')
          .eq('role', 'admin');

        if (admins && admins.length > 0) {
          console.log(`Notificação de aprovação enviada aos admins para novo cadastro: ${email}`);
        }
      } catch (err) {
        console.error('Error notifying admins:', err);
      }
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('email', email)
      .single();

    if (userError || userData?.role === 'pending') {
      await supabase.auth.signOut();
      return {
        error: {
          message: 'Sua conta está aguardando aprovação de um administrador. Você receberá um email em breve.',
        } as AuthError,
      };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    role,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};