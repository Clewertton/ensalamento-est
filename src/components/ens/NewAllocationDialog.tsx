import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, Plus, XCircle } from "lucide-react";
import { toast } from "sonner";
import { dbService } from "@/lib/db";
import {
  findConflict,
  SHIFTS,
  uid,
  WEEKDAYS,
  type Allocation,
  type Course,
  type Room,
  type Shift,
  type Weekday,
} from "@/lib/scheduling";

interface Props {
  rooms: Room[];
  courses: Course[];
  allocations: Allocation[];
}

export function NewAllocationDialog({ rooms, courses, allocations }: Props) {
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [semester, setSemester] = useState("2026.1");
  const [shift, setShift] = useState<Shift>("Matutino");
  const [weekdays, setWeekdays] = useState<Weekday[]>([]);
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("10:00");

  const reset = () => {
    setCourseId("");
    setRoomId("");
    setSemester("2026.1");
    setShift("Matutino");
    setWeekdays([]);
    setStart("08:00");
    setEnd("10:00");
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const room = rooms.find((r) => r.id === roomId);
  const course = courses.find((c) => c.id === courseId);

  const validRange = useMemo(() => {
    if (!start || !end) return false;
    return start < end;
  }, [start, end]);

  const conflictChecks = useMemo(() => {
    if (!roomId || !validRange || weekdays.length === 0) return [];
    return weekdays.map((weekday) =>
      findConflict({ roomId, semester, weekday, start, end }, allocations)
    );
  }, [roomId, semester, weekdays, start, end, allocations, validRange]);

  const hasConflict = conflictChecks.some((check) => check.conflict);
  const conflictingDays = conflictChecks
    .map((check, index) => (check.conflict ? weekdays[index] : null))
    .filter(Boolean);

  const capacityExceeded =
    !!room && !!course && course.students > room.capacity;

  const canSubmit =
    !!courseId &&
    !!roomId &&
    !!semester &&
    validRange &&
    weekdays.length > 0 &&
    !hasConflict;

  const submit = async () => {
    if (!canSubmit) return;
    try {
      const newAllocs: Allocation[] = weekdays.map((weekday) => ({
        id: uid(),
        courseId,
        roomId,
        semester,
        shift,
        weekday,
        start,
        end,
        status: "Pendente",
        createdAt: new Date().toISOString(),
      }));
      
      await dbService.allocations.create(newAllocs);
      toast.success(`${newAllocs.length} alocação(ões) criada(s) com sucesso`);
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao criar alocação");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-[var(--shadow-elegant)]">
          <Plus className="h-4 w-4" /> Nova alocação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova alocação</DialogTitle>
          <DialogDescription>
            Verificação de conflitos em tempo real conforme você preenche o
            formulário.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Turma</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} — {c.professor} ({c.students} alunos)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Sala</Label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sala" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} — {r.building} (cap. {r.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Semestre</Label>
            <Input
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="2026.1"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Turno</Label>
            <Select value={shift} onValueChange={(v) => setShift(v as Shift)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SHIFTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Dias da semana</Label>
            <div className="grid grid-cols-2 gap-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="flex items-center space-x-2">
                  <Checkbox
                    id={d}
                    checked={weekdays.includes(d)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setWeekdays([...weekdays, d]);
                      } else {
                        setWeekdays(weekdays.filter((w) => w !== d));
                      }
                    }}
                  />
                  <Label htmlFor={d} className="text-sm">
                    {d}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Início</Label>
              <Input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Saída</Label>
              <Input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Real-time alerts */}
        <div className="space-y-2 mt-2">
          {!validRange && start && end && (
            <Alert tone="destructive" icon={XCircle}>
              Horário de saída deve ser depois do início.
            </Alert>
          )}
          {hasConflict && (
            <Alert tone="destructive" icon={XCircle}>
              <strong>Erro:</strong> Sala ocupada neste horário nos seguintes dias: {conflictingDays.join(", ")}
            </Alert>
          )}
          {capacityExceeded && (
            <Alert tone="warning" icon={AlertTriangle}>
              <strong>Capacidade excedida:</strong> {course?.students} alunos
              para sala com capacidade {room?.capacity}. Você ainda pode salvar.
            </Alert>
          )}
          {!hasConflict && validRange && roomId && courseId && weekdays.length > 0 && (
            <Alert tone="success" icon={CheckCircle2}>
              Sem conflitos detectados neste horário nos dias selecionados.
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={!canSubmit}>
            Salvar alocação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Alert({
  tone,
  icon: Icon,
  children,
}: {
  tone: "destructive" | "warning" | "success";
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const toneCls =
    tone === "destructive"
      ? "bg-destructive/10 border-destructive/40 text-destructive"
      : tone === "warning"
        ? "bg-warning/15 border-warning/50 text-warning-foreground"
        : "bg-success/10 border-success/40 text-success";
  return (
    <div
      className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${toneCls}`}
    >
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
