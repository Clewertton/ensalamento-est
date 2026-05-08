import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  WEEKDAYS,
  SHIFTS,
  toMinutes,
  type Allocation,
  type Room,
  type Course,
  type Shift,
} from "@/lib/scheduling";

interface Props {
  allocations: Allocation[];
  rooms: Room[];
  courses: Course[];
}

const HOURS = Array.from({ length: 15 }, (_, i) => 7 + i); // 07..21

export function WeekCalendar({ allocations, rooms, courses }: Props) {
  const [shiftFilter, setShiftFilter] = useState<Shift | "all">("all");
  const [roomFilter, setRoomFilter] = useState<string>("all");

  const filtered = useMemo(
    () =>
      allocations.filter(
        (a) =>
          (shiftFilter === "all" || a.shift === shiftFilter) &&
          (roomFilter === "all" || a.roomId === roomFilter),
      ),
    [allocations, shiftFilter, roomFilter],
  );

  const courseById = (id: string) => courses.find((c) => c.id === id);
  const roomById = (id: string) => rooms.find((r) => r.id === id);

  const startMin = HOURS[0] * 60;
  const totalMin = HOURS.length * 60;

  return (
    <Card className="p-5 border-border/60">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Calendário semanal
          </h2>
          <p className="text-sm text-muted-foreground">
            Visualize as alocações da semana
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={shiftFilter}
            onValueChange={(v) => setShiftFilter(v as Shift | "all")}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos turnos</SelectItem>
              {SHIFTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas salas</SelectItem>
              {rooms.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[820px] grid grid-cols-[60px_repeat(6,1fr)] gap-px bg-border rounded-lg overflow-hidden border border-border">
          <div className="bg-muted h-10" />
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="bg-muted h-10 grid place-items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              {d}
            </div>
          ))}

          {/* Hour labels column */}
          <div
            className="bg-card relative"
            style={{ height: `${HOURS.length * 48}px` }}
          >
            {HOURS.map((h) => (
              <div
                key={h}
                className="h-12 border-b border-border/60 text-[10px] text-muted-foreground pr-1 text-right pt-0.5"
              >
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="bg-card relative"
              style={{ height: `${HOURS.length * 48}px` }}
            >
              {HOURS.map((h) => (
                <div key={h} className="h-12 border-b border-border/40" />
              ))}
              {filtered
                .filter((a) => a.weekday === day)
                .map((a) => {
                  const top =
                    ((toMinutes(a.start) - startMin) / totalMin) *
                    (HOURS.length * 48);
                  const height = Math.max(
                    24,
                    ((toMinutes(a.end) - toMinutes(a.start)) / totalMin) *
                      (HOURS.length * 48),
                  );
                  const course = courseById(a.courseId);
                  const room = roomById(a.roomId);
                  const tone =
                    a.status === "Conflito"
                      ? "bg-destructive/15 border-destructive text-destructive"
                      : a.status === "Confirmado"
                        ? "bg-success/15 border-success text-success"
                        : "bg-primary/10 border-primary text-primary";
                  return (
                    <div
                      key={a.id}
                      className={`absolute left-1 right-1 rounded-md border-l-4 px-2 py-1 text-[11px] leading-tight overflow-hidden ${tone}`}
                      style={{ top: `${top}px`, height: `${height}px` }}
                      title={`${course?.name} • ${room?.name} • ${a.start}–${a.end}`}
                    >
                      <div className="font-semibold truncate">
                        {course?.name ?? "—"}
                      </div>
                      <div className="opacity-80 truncate">
                        {room?.name} · {a.start}–{a.end}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Badge variant="outline" className="border-primary text-primary">
          Pendente
        </Badge>
        <Badge variant="outline" className="border-success text-success">
          Confirmado
        </Badge>
        <Badge
          variant="outline"
          className="border-destructive text-destructive"
        >
          Conflito
        </Badge>
      </div>
    </Card>
  );
}
