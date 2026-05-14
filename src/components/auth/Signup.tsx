import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [assignedRole, setAssignedRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstUser = async () => {
      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      setIsFirstUser(!fetchError && users !== null && users.length === 0);
    };
    checkFirstUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    // Repassando o papel atribuído no formulário para a função protegida
    const { error: signUpError } = await signUp(email, password, assignedRole);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      toast.success('Usuário criado com sucesso!');
      // Pode limpar os campos para permitir um novo cadastro se desejar
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }

    setLoading(false);
  };

  // Por que: Se não for administrador, sequer renderizamos o formulário.
  // Isso garante que tentativas diretas de acessar a rota falhem visualmente no lado do cliente.
  if (!authLoading && role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 text-center">
        <Card className="w-full max-w-md p-6">
          <CardTitle className="text-destructive mb-2">Acesso Negado</CardTitle>
          <CardDescription>Você precisa de privilégios de administrador para criar novas contas.</CardDescription>
          <Button className="mt-4" onClick={() => navigate({ to: '/' })}>Voltar ao Início</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastrar Novo Usuário</CardTitle>
          <CardDescription>
            Apenas administradores logados podem registrar novas contas no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email (@uea.edu.br)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Nível de Permissão</Label>
              <select
                id="role"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value)}
              >
                <option value="user">Usuário Comum</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}