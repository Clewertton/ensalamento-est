import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import { UserManagement } from '@/components/admin/UserManagement';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    // Redireciona para login se não estiver autenticado
    if (!loading && !user) {
      navigate({ to: '/login' });
    }
    // Redireciona para home se não for admin
    if (!loading && user && role !== 'admin') {
      navigate({ to: '/' });
    }
  }, [loading, user, role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Painel de Administração
              </h1>
              <p className="text-sm text-muted-foreground">
                Gerencie o sistema e os usuários
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/' })}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-sm text-muted-foreground">Total de Usuários</div>
                <div className="text-3xl font-bold text-foreground mt-2">—</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Carregue a página de usuários para ver estatísticas
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-sm text-muted-foreground">Administradores</div>
                <div className="text-3xl font-bold text-primary mt-2">—</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Usuários com acesso administrativo
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-sm text-muted-foreground">Usuários Comuns</div>
                <div className="text-3xl font-bold text-secondary mt-2">—</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Usuários com permissões padrão
                </p>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="lg:col-span-3">
            <UserManagement />
          </div>
        </div>
      </main>
    </div>
  );
}
