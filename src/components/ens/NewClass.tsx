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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, CheckCircle2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { dbService } from "@/lib/db";
import { type Course, type Professor } from "@/lib/scheduling";

interface Props {
  courses: Course[]; // Lista atual de turmas para referência ou validação
  professors: Professor[]; // Lista de professores cadastrados
  course?: Course; // Se fornecido, modo edição
  onClose?: () => void; // Callback para fechar após editar/deletar
}

export function NewCourseDialog({
  courses,
  professors,
  course,
  onClose,
}: Props) {
  const isEdit = !!course;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(course?.name || "");
  const [professor, setProfessor] = useState(course?.professor || "");
  const [students, setStudents] = useState<number>(course?.students || 0);
  const [code, setCode] = useState(course?.id || "");

  const reset = useCallback(() => {
    setName(course?.name || "");
    setProfessor(course?.professor || "");
    setStudents(course?.students || 0);
    setCode(course?.id || "");
  }, [course]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (course) {
      setOpen(true);
    }
  }, [course]);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      onClose?.();
    }
  };

  // Lógica de validação simples seguindo o padrão do anterior
  const canSubmit = !!name && !!professor && students > 0 && !!code;

  // Verifica se já existe uma turma com o mesmo código (exceto a atual em edição)
  const codeExists = courses.some(
    (c) => c.id !== course?.id && (c.id === code || c.name === name),
  );

  const submit = async () => {
    if (!canSubmit || codeExists) {
      if (codeExists)
        toast.error("Uma turma com este nome ou código já existe.");
      return;
    }

    if (isEdit) {
      const updatedCourse: Course = {
        id: course.id,
        name,
        professor,
        students,
      };
      const result = await dbService.courses.update(course.id, updatedCourse);
      if (!result) {
        toast.error("Não foi possível atualizar a turma.");
        return;
      }
      toast.success("Turma atualizada com sucesso!");
    } else {
      const newCourse: Course = {
        id: code,
        name,
        professor,
        students,
      };
      const result = await dbService.courses.create(newCourse);
      if (!result) {
        toast.error("Não foi possível cadastrar a turma.");
        return;
      }
      toast.success("Turma cadastrada com sucesso!");
    }

    setOpen(false);
  };

  const deleteCourse = async () => {
    if (!course) return;
    const success = await dbService.courses.delete(course.id);
    if (!success) {
      toast.error("Não foi possível excluir a turma.");
      return;
    }
    toast.success("Turma excluída com sucesso!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button className="gap-2 shadow-(--shadow-elegant)">
            <Plus className="h-4 w-4" /> Nova turma
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Turma" : "Cadastrar Nova Turma"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edite os detalhes da turma."
              : "Insira os detalhes da disciplina e do professor responsável."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="code">Código da Disciplina</Label>
            <Input
              id="code"
              placeholder="Ex: MAT101"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={isEdit} // Não permitir alterar código em edição
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nome da Turma / Disciplina</Label>
            <Input
              id="name"
              placeholder="Ex: Cálculo I"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="professor">Professor Responsável</Label>
            <Select value={professor} onValueChange={setProfessor}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o professor" />
              </SelectTrigger>
              <SelectContent>
                {professors.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="students">Quantidade de Alunos</Label>
            <Input
              id="students"
              type="number"
              min={0}
              value={students}
              onChange={(e) => setStudents(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Feedback visual de sucesso (semelhante ao original) */}
        {canSubmit && !codeExists && (
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
                    Tem certeza que deseja excluir a turma "{course.name}"? Esta
                    ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteCourse}>
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
            <Button onClick={submit} disabled={!canSubmit || codeExists}>
              {isEdit ? "Atualizar" : "Salvar"} Turma
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
