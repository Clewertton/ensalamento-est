import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Building } from "lucide-react";
import { toast } from "sonner";
import { dbService } from "@/lib/db";
import type { Room } from "@/lib/scheduling";

export function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [capacity, setCapacity] = useState("");

  const loadRooms = useCallback(async () => {
    try {
      const data = await dbService.rooms.getAll();
      setRooms(data);
    } catch (error) {
      console.error("Error loading rooms:", error);
      toast.error("Erro ao carregar salas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();

    // Subscribe to real-time updates
    const subscription = dbService.rooms.subscribe((updatedRooms) => {
      setRooms(updatedRooms);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadRooms]);

  const resetForm = useCallback(() => {
    setName("");
    setBuilding("");
    setCapacity("");
  }, []);

  const openCreateDialog = useCallback(() => {
    resetForm();
    setIsCreateDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((room: Room) => {
    setEditingRoom(room);
    setName(room.name);
    setBuilding(room.building);
    setCapacity(room.capacity.toString());
    setIsEditDialogOpen(true);
  }, []);

  const canSubmit = !!name.trim() && !!building.trim() && Number(capacity) > 0;

  const roomExists = (roomName: string, excludeId?: string) =>
    rooms.some(
      (room) =>
        room.name.toLowerCase() === roomName.trim().toLowerCase() &&
        room.id !== excludeId,
    );

  const createRoom = async () => {
    if (!canSubmit || roomExists(name)) {
      if (roomExists(name)) {
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
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Erro ao cadastrar sala:", error);
      toast.error("Não foi possível cadastrar a sala.");
    }
  };

  const updateRoom = async () => {
    if (!editingRoom || !canSubmit || roomExists(name, editingRoom.id)) {
      if (roomExists(name, editingRoom?.id)) {
        toast.error("Uma sala com este nome já existe.");
      }
      return;
    }

    try {
      await dbService.rooms.update(editingRoom.id, {
        name: name.trim(),
        building: building.trim(),
        capacity: Number(capacity),
      });
      toast.success("Sala atualizada com sucesso!");
      setIsEditDialogOpen(false);
      setEditingRoom(null);
    } catch (error) {
      console.error("Erro ao atualizar sala:", error);
      toast.error("Não foi possível atualizar a sala.");
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      const success = await dbService.rooms.delete(roomId);
      if (success) {
        toast.success("Sala excluída com sucesso!");
      } else {
        toast.error("Não foi possível excluir a sala.");
      }
    } catch (error) {
      console.error("Erro ao excluir sala:", error);
      toast.error("Erro ao excluir sala.");
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-muted-foreground">Carregando salas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salas</h1>
          <p className="text-muted-foreground">
            Gerencie as salas disponíveis para alocação
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova sala
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar salas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(room)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir sala</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a sala "{room.name}"?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteRoom(room.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bloco:</span>
                  <Badge variant="outline">{room.building}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Capacidade:</span>
                  <Badge variant="secondary">{room.capacity} alunos</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {searchTerm ? "Nenhuma sala encontrada" : "Nenhuma sala cadastrada"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm
              ? "Tente ajustar os termos da busca"
              : "Comece cadastrando sua primeira sala"}
          </p>
          {!searchTerm && (
            <Button onClick={openCreateDialog} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar primeira sala
            </Button>
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar nova sala</DialogTitle>
            <DialogDescription>
              Informe nome, bloco e capacidade para inserir a sala no banco de dados.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="create-room-name">Nome da sala</Label>
              <Input
                id="create-room-name"
                placeholder="Ex: Sala 101"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-room-building">Bloco / Prédio</Label>
              <Input
                id="create-room-building"
                placeholder="Ex: Bloco A"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-room-capacity">Capacidade</Label>
              <Input
                id="create-room-capacity"
                placeholder="Ex: 40"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={createRoom} disabled={!canSubmit || roomExists(name)}>
              Salvar sala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar sala</DialogTitle>
            <DialogDescription>
              Atualize as informações da sala selecionada.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-room-name">Nome da sala</Label>
              <Input
                id="edit-room-name"
                placeholder="Ex: Sala 101"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-room-building">Bloco / Prédio</Label>
              <Input
                id="edit-room-building"
                placeholder="Ex: Bloco A"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-room-capacity">Capacidade</Label>
              <Input
                id="edit-room-capacity"
                placeholder="Ex: 40"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={updateRoom}
              disabled={!canSubmit || roomExists(name, editingRoom?.id)}
            >
              Atualizar sala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}