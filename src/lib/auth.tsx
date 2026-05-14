import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: 'admin' | 'user' | 'pending' | null;
  loading: boolean;
  signUp: (email: string, password: string, assignedRole?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
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
    try {
      // Por que: Garantimos que falhas na consulta de papéis não quebrem a aplicação inteira.
      // Escondemos o erro real do banco por segurança e retornamos um estado nulo como fallback preventivo.
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        // Por que: .maybeSingle() evita que o Supabase lance um erro HTTP 406 (Not Acceptable)
        // caso o usuário ainda não exista na tabela pública, permitindo um tratamento gracioso.
        .maybeSingle();

      if (error) throw error;
      setRole(data?.role as 'admin' | 'user' | 'pending');
    } catch (err) {
      // Por que: Logs internos são essenciais para debugar, mas nunca vazamos isso para a interface do usuário.
      console.error("Falha silenciosa ao buscar permissões do usuário.", err);
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

  const signUp = async (email: string, password: string, assignedRole?: string) => {
    try {
      // Por que: Restringimos o cadastro apenas para administradores logados.
      // Essa trava impede abusos em endpoints públicos e garante governança dos acessos.
      if (role !== 'admin') {
        return { error: new Error('Acesso negado. Apenas administradores podem cadastrar novos usuários.') };
      }

      // Por que: Tratamos explicitamente o payload do front-end. Aplicamos o princípio do menor privilégio
      // garantindo que, se houver injeção de dados ou valores inválidos, o usuário nascerá com permissão básica.
      const safeRole = ['admin', 'user'].includes(assignedRole || '') ? assignedRole : 'user';

      // Validate UEA domain
      if (!email.endsWith('@uea.edu.br')) {
        return { error: new Error('Apenas e-mails institucionais (@uea.edu.br) são válidos para cadastro.') };
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/validate`,
          data: { role: safeRole }
        },
      });

      if (authError || !authData.user) {
        // Por que: Lançamos o erro original internamente para tratá-lo no catch e ser mascarado genericamente.
        throw authError;
      }

      return { error: null };
    } catch (err) {
      // Por que: Escondemos detalhes de infraestrutura (como falhas no Supabase) dos usuários finais.
      console.error("Erro interno durante o cadastro:", err);
      return { error: new Error('Não foi possível concluir o cadastro. Verifique as informações e tente novamente.') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .maybeSingle();

      // Por que: Se userData for nulo (usuário não foi copiado para a tabela pública), 
      // tratamos como pendente por padrão (Menor Privilégio) em vez de quebrar a aplicação.
      if (userError || !userData || userData.role === 'pending') {
        await supabase.auth.signOut();
        // Por que: Informamos claramente o motivo do bloqueio para o usuário legítimo sem revelar dados sensíveis.
        return { error: new Error('Sua conta está aguardando aprovação de um administrador.') };
      }

      return { error: null };
    } catch (err) {
      console.error("Erro interno na autenticação:", err);
      return { error: new Error('Credenciais inválidas ou ocorreu um erro de conexão. Tente novamente.') };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Por que: Evitamos travar a UI caso o token de logout já tenha expirado ou a rede falhe no processo.
      console.error("Erro não crítico ao sair:", err);
    }
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