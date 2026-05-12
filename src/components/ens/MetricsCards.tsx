import { Card } from "@/components/ui/card";
import {
  Building2,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { Allocation, Room } from "@/lib/scheduling";

interface Props {
  rooms: Room[];
  allocations: Allocation[];
}

export function MetricsCards({ rooms, allocations }: Props) {
  const occupiedRoomIds = new Set(allocations.map((a) => a.roomId));
  const pending = allocations.filter((a) => a.status === "Pendente").length;
  const confirmed = allocations.filter((a) => a.status === "Confirmado").length;

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
    </div>
  );
}
