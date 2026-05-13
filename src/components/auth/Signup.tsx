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
  const [inviteCode, setInviteCode] = useState('');
  const [isFirstUser, setIsFirstUser] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstUser = async () => {
      const { data: users, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      setIsFirstUser(!error && users && users.length === 0);
    };
    checkFirstUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    // Check if this is the first user
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    const isFirstUser = !usersError && users && users.length === 0;

    if (!isFirstUser) {
      // Check invite code
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('code', inviteCode)
        .eq('used', false)
        .single();

      if (inviteError || !invite) {
        setError('Código de convite inválido ou já utilizado.');
        setLoading(false);
        return;
      }

      if (invite.email !== email) {
        setError('O email não corresponde ao convite.');
        setLoading(false);
        return;
      }
    }

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
    } else {
      if (!isFirstUser) {
        // Mark invite as used
        await supabase
          .from('invites')
          .update({ used: true })
          .eq('code', inviteCode);
      }
      navigate({ to: '/login' });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastrar</CardTitle>
          <CardDescription>
            Crie sua conta para acessar o sistema. Apenas emails @uea.edu.br são permitidos.
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
            {isFirstUser === false && (
              <div>
                <Label htmlFor="inviteCode">Código de Convite</Label>
                <Input
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                />
              </div>
            )}
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
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem conta? <a href="/login" className="text-primary hover:underline">Entrar</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}