import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Users } from "lucide-react";
import { NewCourseDialog } from "./NewClass";
import type { Course, Professor } from "@/lib/scheduling";

interface Props {
  courses: Course[];
  professors: Professor[];
}

export function CoursesList({ courses, professors }: Props) {
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();

  return (
    <>
      <Card className="p-5 border-border/60 h-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Turmas</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie as turmas cadastradas
          </p>
        </div>
        {courses.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Nenhuma turma cadastrada. Clique em "Nova turma" para começar.
          </p>
        ) : (
          <ul className="space-y-2">
            {courses.map((course) => (
              <li
                key={course.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/60 hover:bg-accent/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-foreground">
                    {course.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{course.professor}</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.students} alunos
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCourse(course)}
                  className="shrink-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {editingCourse && (
        <NewCourseDialog
          courses={courses}
          professors={professors}
          course={editingCourse}
          onClose={() => setEditingCourse(undefined)}
        />
      )}
    </>
  );
}
