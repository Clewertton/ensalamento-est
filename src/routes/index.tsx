import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useScheduling } from "@/hooks/use-scheduling";
import { MetricsCards } from "@/components/ens/MetricsCards";
import { WeekCalendar } from "@/components/ens/WeekCalendar";
import { RecentList } from "@/components/ens/RecentList";
import { KanbanBoard } from "@/components/ens/KanbanBoard";
import { InviteGenerator } from "@/components/ens/InviteGenerator";
import { NewAllocationDialog } from "@/components/ens/NewAllocationDialog";
import { CalendarRange, LogOut, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  beforeLoad: ({ context }) => {
    // Note: context doesn't have auth directly, we'll check in component
  },
  head: () => ({
    meta: [
      { title: "Ensalamento Acadêmico — Dashboard" },
      {
        name: "description",
        content:
          "Gestão de ensalamento acadêmico por semestre com detecção de conflitos em tempo real.",
      },
    ],
  }),
});

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, signOut, role } = useAuth();
  const { rooms, courses, allocations, professors, hydrated } = useScheduling();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/login' });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center shadow-(--shadow-elegant)">
              <CalendarRange className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground leading-tight">
                Ensalamento Acadêmico
              </h1>
              <p className="text-xs text-muted-foreground">
                Gestão semestral com detecção de conflitos em tempo real
              </p>
            </div>
          </div>
          {hydrated && (
            <div className="flex flex-wrap items-center gap-2">
              <NewAllocationDialog
                rooms={rooms}
                courses={courses}
                allocations={allocations}
              />
              <Link
                to="/rooms"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Salas
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Turmas
              </Link>
              <Link
                to="/professors"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Professores
              </Link>
              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center rounded-md border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 gap-1"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <MetricsCards rooms={rooms} allocations={allocations} courses={courses} />

        {role === 'admin' && (
          <div className="flex justify-center">
            <InviteGenerator />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeekCalendar
              allocations={allocations}
              rooms={rooms}
              courses={courses}
            />
          </div>
          <div>
            <RecentList
              allocations={allocations}
              rooms={rooms}
              courses={courses}
            />
          </div>
        </div>

        <KanbanBoard
          allocations={allocations}
          rooms={rooms}
          courses={courses}
        />
      </main>
    </div>
  );
}
