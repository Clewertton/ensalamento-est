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
import { Plus, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { store, uid, type Course, type Professor } from "@/lib/scheduling";

interface Props {
  courses: Course[];
  professors: Professor[];
  professor?: Professor;
  onClose?: () => void;
}

export function NewProfessorDialog({
  courses,
  professors,
  professor,
  onClose,
}: Props) {
  const isEdit = !!professor;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(professor?.name || "");

  const reset = useCallback(() => {
    setName(professor?.name || "");
  }, [professor]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (professor) {
      setOpen(true);
    }
  }, [professor]);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      onClose?.();
    }
  };

  const canSubmit = !!name;
  const nameExists = professors.some(
    (p) => p.id !== professor?.id && p.name.toLowerCase() === name.trim().toLowerCase(),
  );

  const submit = () => {
    if (!canSubmit || nameExists) {
      if (nameExists) toast.error("Um professor com este nome já existe.");
      return;
    }

    if (isEdit) {
      const updatedProfessor: Professor = {
        id: professor.id,
        name: name.trim(),
      };
      const updatedProfessors = professors.map((p) =>
        p.id === professor.id ? updatedProfessor : p,
      );
      store.setProfessors(updatedProfessors);

      if (professor.name !== updatedProfessor.name) {
        const updatedCourses = courses.map((c) =>
          c.professor === professor.name
            ? { ...c, professor: updatedProfessor.name }
            : c,
        );
        store.setCourses(updatedCourses);
      }

      toast.success("Professor atualizado com sucesso!");
    } else {
      const newProfessor: Professor = {
        id: uid(),
        name: name.trim(),
      };
      store.setProfessors([...professors, newProfessor]);
      toast.success("Professor cadastrado com sucesso!");
    }

    setOpen(false);
  };

  const deleteProfessor = () => {
    if (!professor) return;
    const updatedProfessors = professors.filter((p) => p.id !== professor.id);
    store.setProfessors(updatedProfessors);
    toast.success("Professor excluído com sucesso!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button className="gap-2 shadow-(--shadow-elegant)">
            <Plus className="h-4 w-4" /> Novo professor
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Professor" : "Cadastrar Novo Professor"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize os dados do professor." 
              : "Insira o nome do professor para cadastrar no sistema."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome do Professor</Label>
            <Input
              id="name"
              placeholder="Ex: Prof. Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {canSubmit && !nameExists && (
          <div className="flex items-start gap-2 rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success mb-4">
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="flex-1">
              Dados válidos para {isEdit ? "atualização" : "cadastro"}.
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          {isEdit && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o professor "{professor.name}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteProfessor}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit} disabled={!canSubmit || nameExists}>
              {isEdit ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
