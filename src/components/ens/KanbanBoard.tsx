import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dbService } from "@/lib/db";
import {
  type Allocation,
  type Course,
  type Room,
  type Status,
} from "@/lib/scheduling";
import { GripVertical, FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  allocations: Allocation[];
  rooms: Room[];
  courses: Course[];
}

const columnTone: Record<Status, string> = {
  Pendente: "border-t-primary",
  Confirmado: "border-t-success",
};

const statuses: Status[] = ["Pendente", "Confirmado"];

export function KanbanBoard({ allocations, rooms, courses }: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [reminderText, setReminderText] = useState("");
  const [reminders, setReminders] = useState<string[]>([]);

  const courseById = (id: string) => courses.find((c) => c.id === id);
  const roomById = (id: string) => rooms.find((r) => r.id === id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("ensalamentoReminders");
    if (stored) {
      try {
        setReminders(JSON.parse(stored));
      } catch {
        setReminders([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ensalamentoReminders", JSON.stringify(reminders));
  }, [reminders]);

  const move = async (id: string, status: Status) => {
    try {
      const allocation = allocations.find((a) => a.id === id);
      if (!allocation) return;

      const now = new Date().toISOString();
      const updates: Partial<Allocation> = {
        status,
        confirmedAt: status === "Confirmado" ? now : allocation.confirmedAt,
      };

      await dbService.allocations.update(id, updates);
    } catch (error) {
      console.error("Error moving allocation:", error);
    }
  };

  const saveNotes = async (allocationId: string) => {
    try {
      await dbService.allocations.update(allocationId, {
        notes: notesText.trim() || undefined,
      });
      setEditingNotes(null);
      setNotesText("");
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const startEditingNotes = (allocation: Allocation) => {
    setEditingNotes(allocation.id);
    setNotesText(allocation.notes || "");
  };

  return (
    <Card className="p-5 border-border/60">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Workflow de alocações
        </h2>
        <p className="text-sm text-muted-foreground">
          Arraste os cards entre as colunas para atualizar o status
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {statuses.map((status) => {
          const items = allocations.filter((a) => a.status === status);
          return (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && move(dragId, status)}
              className={`rounded-xl bg-muted/40 border-t-4 ${columnTone[status]} p-3 min-h-55`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {status}
                </h3>
                <Badge variant="secondary" className="tabular-nums">
                  {items.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {items.map((a) => {
                  const c = courseById(a.courseId);
                  const r = roomById(a.roomId);
                  return (
                    <div
                      key={a.id}
                      draggable
                      onDragStart={() => setDragId(a.id)}
                      onDragEnd={() => setDragId(null)}
                      className="bg-card rounded-lg border border-border p-3 shadow-(--shadow-card) cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate text-foreground">
                            {c?.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {r?.name} · {a.weekday} {a.start}–{a.end}
                          </p>
                          <p className="text-[10px] text-muted-foreground/80 mt-1 uppercase tracking-wider">
                            {a.semester} · {a.shift}
                          </p>
                          {a.notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              "{a.notes}"
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingNotes(a)}
                          className="h-6 w-6 p-0 shrink-0"
                          title="Adicionar/editar notas"
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    Vazio
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div className="rounded-xl bg-muted/40 border-t-4 border-t-secondary p-3 min-h-55">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Observações
              </h3>
              <p className="text-xs text-muted-foreground">
                Anote lembretes rápidos do seu ensalamento.
              </p>
            </div>
            <Badge variant="secondary" className="tabular-nums">
              {reminders.length}
            </Badge>
          </div>
          <div className="space-y-3">
            <Textarea
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              placeholder="Escreva um lembrete ou observação..."
              rows={4}
            />
            <Button
              className="w-full"
              onClick={() => {
                const trimmed = reminderText.trim();
                if (!trimmed) return;
                setReminders((prev) => [trimmed, ...prev]);
                setReminderText("");
              }}
              disabled={!reminderText.trim()}
            >
              Adicionar lembrete
            </Button>
            <div className="space-y-2">
              {reminders.length > 0 ? (
                reminders.map((note, index) => (
                  <div
                    key={`${note}-${index}`}
                    className="rounded-lg border border-border/60 bg-card p-3"
                  >
                    <p className="text-sm text-foreground">{note}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  Nenhum lembrete ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edição de notas */}
      <Dialog
        open={!!editingNotes}
        onOpenChange={(open) => !open && setEditingNotes(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar notas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Digite suas observações sobre esta alocação..."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingNotes(null)}>
                Cancelar
              </Button>
              <Button onClick={() => editingNotes && saveNotes(editingNotes)}>
                Salvar notas
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
