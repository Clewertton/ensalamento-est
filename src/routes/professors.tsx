import { createFileRoute, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { useSharedScheduling } from "@/lib/SchedulingContext";
import { NewProfessorDialog } from "@/components/ens/NewProfessorDialog";
import { ProfessorsList } from "@/components/ens/ProfessorsList";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/professors")({
  component: ProfessorsPage,
  head: () => ({
    meta: [
      { title: "Professores — Ensalamento Acadêmico" },
      {
        name: "description",
        content: "Gerencie professores, edite informações e exclua registros.",
      },
    ],
  }),
});

function ProfessorsPage() {
  const { courses, professors, hydrated } = useSharedScheduling();

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao painel
            </Link>
            <h1 className="mt-3 text-xl font-semibold text-foreground">
              Gerenciar Professores
            </h1>
            <p className="text-sm text-muted-foreground">
              Cadastre, edite e exclua professores.
            </p>
          </div>
          {hydrated && <NewProfessorDialog courses={courses} professors={professors} />}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfessorsList courses={courses} professors={professors} />
      </main>
    </div>
  );
}
