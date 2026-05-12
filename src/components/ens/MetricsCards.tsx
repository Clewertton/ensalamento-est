import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import type { Allocation, Room, Course } from "@/lib/scheduling";

interface Props {
  rooms: Room[];
  allocations: Allocation[];
  courses: Course[];
}

export function MetricsCards({ rooms, allocations, courses }: Props) {
  const occupiedRoomIds = new Set(allocations.map((a) => a.roomId));
  const pending = allocations.filter((a) => a.status === "Pendente").length;
  const confirmed = allocations.filter((a) => a.status === "Confirmado").length;

  const exportToExcel = () => {
    // Create CSV content for Excel
    const headers = [
      "Dia da Semana",
      "Horário",
      "Sala",
      "Turma",
      "Professor",
      "Alunos",
      "Status",
      "Semestre",
      "Turno",
    ];

    const rows = allocations.map((allocation) => {
      const course = courses.find((c) => c.id === allocation.courseId);
      const room = rooms.find((r) => r.id === allocation.roomId);

      return [
        allocation.weekday,
        `${allocation.start} - ${allocation.end}`,
        room?.name || "N/A",
        course?.name || "N/A",
        course?.professor || "N/A",
        course?.students?.toString() || "0",
        allocation.status,
        allocation.semester,
        allocation.shift,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ensalamento-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const items = [
    {
      label: "Salas ocupadas",
      value: `${occupiedRoomIds.size}/${rooms.length}`,
      icon: Building2,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Turmas pendentes",
      value: pending,
      icon: CalendarClock,
      tone: "bg-warning/15 text-warning-foreground",
    },
    {
      label: "Confirmadas",
      value: confirmed,
      icon: CheckCircle2,
      tone: "bg-success/15 text-success",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <Card
          key={it.label}
          className="p-5 flex items-center justify-between border-border/60 hover:shadow-[var(--shadow-elegant)] transition-shadow"
        >
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {it.label}
            </p>
            <p className="text-3xl font-semibold mt-1 text-foreground tabular-nums">
              {it.value}
            </p>
          </div>
          <div
            className={`h-12 w-12 rounded-xl grid place-items-center ${it.tone}`}
          >
            <it.icon className="h-6 w-6" />
          </div>
        </Card>
      ))}

      {/* Export Card */}
      <Card className="p-5 border-border/60 hover:shadow-[var(--shadow-elegant)] transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Exportar dados
            </p>
            <p className="text-3xl font-semibold mt-1 text-foreground tabular-nums">
              {allocations.length}
            </p>
            <p className="text-xs text-muted-foreground">
              alocações para Excel
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl grid place-items-center bg-secondary/10 text-secondary">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
        </div>
        <Button
          onClick={exportToExcel}
          size="sm"
          className="w-full gap-2"
          disabled={allocations.length === 0}
        >
          <Download className="h-3 w-3" />
          Baixar CSV
        </Button>
      </Card>
    </div>
  );
}
