import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import type { Allocation, Course, Room } from "@/lib/scheduling";

interface Props {
  allocations: Allocation[];
  rooms: Room[];
  courses: Course[];
}

export function RecentList({ allocations, rooms, courses }: Props) {
  const recent = [...allocations]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const courseById = (id: string) => courses.find((c) => c.id === id);
  const roomById = (id: string) => rooms.find((r) => r.id === id);

  const tone = (s: Allocation["status"]) =>
    s === "Confirmado"
      ? "bg-success/15 text-success border-success/30"
      : s === "Conflito"
        ? "bg-destructive/15 text-destructive border-destructive/30"
        : "bg-primary/10 text-primary border-primary/30";

  return (
    <Card className="p-5 border-border/60 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recentes</h2>
        <p className="text-sm text-muted-foreground">
          Últimos ensalamentos criados
        </p>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Nenhuma alocação ainda. Clique em "Nova alocação" para começar.
        </p>
      ) : (
        <ul className="space-y-2">
          {recent.map((a) => {
            const c = courseById(a.courseId);
            const r = roomById(a.roomId);
            return (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/60 hover:bg-accent/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-foreground">
                    {c?.name ?? "—"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {r?.name}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {a.weekday} {a.start}–{a.end}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className={tone(a.status)}>
                  {a.status}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
