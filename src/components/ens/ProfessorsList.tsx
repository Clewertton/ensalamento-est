import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";
import { NewProfessorDialog } from "./NewProfessorDialog";
import type { Course, Professor } from "@/lib/scheduling";

interface Props {
  courses: Course[];
  professors: Professor[];
}

export function ProfessorsList({ courses, professors }: Props) {
  const [editingProfessor, setEditingProfessor] = useState<Professor | undefined>();

  return (
    <>
      <Card className="p-5 border-border/60 h-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Professores</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os professores cadastrados
          </p>
        </div>

        {professors.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Nenhum professor cadastrado. Use o botão "Novo professor" para criar.
          </p>
        ) : (
          <ul className="space-y-2">
            {professors.map((professor) => {
              const courseCount = courses.filter(
                (course) => course.professor === professor.name,
              ).length;

              return (
                <li
                  key={professor.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/60 hover:bg-accent/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-secondary" />
                      <p className="font-medium text-sm truncate text-foreground">
                        {professor.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {courseCount} turma{courseCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProfessor(professor)}
                    className="shrink-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {editingProfessor && (
        <NewProfessorDialog
          courses={courses}
          professors={professors}
          professor={editingProfessor}
          onClose={() => setEditingProfessor(undefined)}
        />
      )}
    </>
  );
}
