import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Copy } from 'lucide-react';

export function InviteGenerator() {
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleGenerate = async () => {
    if (!email.endsWith('@uea.edu.br')) {
      setError('Apenas emails @uea.edu.br podem ser convidados.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const code = generateCode();

    const { error } = await supabase
      .from('invites')
      .insert({
        email,
        code,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        used: false,
      });

    if (error) {
      setError('Erro ao gerar convite.');
    } else {
      setInviteCode(code);
      setSuccess('Convite gerado com sucesso!');
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    setSuccess('Código copiado para a área de transferência!');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Gerar Convite</CardTitle>
        <CardDescription>
          Convide novos usuários para o sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email do usuário</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@uea.edu.br"
          />
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gerar Convite
        </Button>
        {inviteCode && (
          <div className="space-y-2">
            <Label>Código de Convite</Label>
            <div className="flex gap-2">
              <Input value={inviteCode} readOnly />
              <Button onClick={copyToClipboard} size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}