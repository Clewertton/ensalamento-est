import { createFileRoute, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { useSharedScheduling } from "@/contexts/SchedulingContext";
import { NewCourseDialog } from "@/components/ens/NewClass";
import { CoursesList } from "@/components/ens/CoursesList";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
  head: () => ({
    meta: [
      { title: "Turmas — Ensalamento Acadêmico" },
      {
        name: "description",
        content: "Gerencie turmas, edite informações e exclua registros.",
      },
    ],
  }),
});

function CoursesPage() {
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
              Gerenciar Turmas
            </h1>
            <p className="text-sm text-muted-foreground">
              Crie, edite e exclua turmas cadastradas no sistema.
            </p>
          </div>
          {hydrated && <NewCourseDialog courses={courses} professors={professors} />}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CoursesList courses={courses} professors={professors} />
      </main>
    </div>
  );
}
