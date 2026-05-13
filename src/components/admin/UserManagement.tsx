import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Loader2, Shield, User, Mail, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('id, email, role, created_at')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminRole = async (user: UserData) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const confirmToggleRole = async () => {
    if (!selectedUser) return;

    setUpdatingId(selectedUser.id);
    setShowConfirm(false);

    try {
      const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';

      const { error: updateError } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', selectedUser.id);

      if (updateError) throw updateError;

      // Atualizar lista local
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );

      setSelectedUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Gerenciamento de Usuários
        </CardTitle>
        <CardDescription>
          Gerencie os papéis e permissões dos usuários
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum usuário encontrado
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {user.role === 'admin' ? (
                      <Shield className="h-5 w-5 text-primary" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.email}
                      </p>
                      <Badge
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className="flex-shrink-0"
                      >
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Registrado em {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>

                <Button
                  variant={user.role === 'admin' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => toggleAdminRole(user)}
                  disabled={updatingId === user.id}
                  className="ml-2 flex-shrink-0"
                >
                  {updatingId === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : user.role === 'admin' ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Remover Admin
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Promover Admin
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Dialog de confirmação */}
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar alteração de permissão</DialogTitle>
              <DialogDescription>
                {selectedUser?.role === 'admin'
                  ? `Tem certeza que deseja remover as permissões de administrador de ${selectedUser?.email}?`
                  : `Tem certeza que deseja promover ${selectedUser?.email} a administrador?`}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancelar
              </Button>
              <Button
                variant={selectedUser?.role === 'admin' ? 'destructive' : 'default'}
                onClick={confirmToggleRole}
              >
                {selectedUser?.role === 'admin'
                  ? 'Remover Admin'
                  : 'Promover Admin'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
