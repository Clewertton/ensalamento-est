import { useCallback, useEffect, useState } from "react";
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
import { Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { dbService } from "@/lib/db";
import type { Room } from "@/lib/scheduling";

interface Props {
  rooms: Room[];
}

export function NewRoomDialog({ rooms }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [capacity, setCapacity] = useState("");

  const reset = useCallback(() => {
    setName("");
    setBuilding("");
    setCapacity("");
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const canSubmit = !!name.trim() && !!building.trim() && Number(capacity) > 0;
  const roomExists = rooms.some(
    (room) => room.name.toLowerCase() === name.trim().toLowerCase(),
  );

  const submit = async () => {
    if (!canSubmit || roomExists) {
      if (roomExists) {
        toast.error("Uma sala com este nome já existe.");
      }
      return;
    }

    try {
      await dbService.rooms.create({
        name: name.trim(),
        building: building.trim(),
        capacity: Number(capacity),
      });
      toast.success("Sala cadastrada com sucesso!");
      setOpen(false);
    } catch (error) {
      console.error("Erro ao cadastrar sala:", error);
      toast.error("Não foi possível cadastrar a sala.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-(--shadow-elegant)">
          <Plus className="h-4 w-4" /> Cadastrar sala
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar nova sala</DialogTitle>
          <DialogDescription>
            Informe nome, bloco e capacidade para inserir a sala no banco de dados.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="room-name">Nome da sala</Label>
            <Input
              id="room-name"
              placeholder="Ex: Sala 101"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="room-building">Bloco / Prédio</Label>
            <Input
              id="room-building"
              placeholder="Ex: Bloco A"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="room-capacity">Capacidade</Label>
            <Input
              id="room-capacity"
              placeholder="Ex: 40"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>
        </div>

        {canSubmit && !roomExists && (
          <div className="flex items-start gap-2 rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success mb-4">
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="flex-1">Salvamento pronto para ser criado.</div>
          </div>
        )}

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={!canSubmit || roomExists}>
            Salvar sala
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
