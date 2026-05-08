import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, Trash2, Settings } from "lucide-react";
import { dbService } from "@/lib/db";

export function DataManagementDialog() {
  const [open, setOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [syncing, setSyncing] = useState(false);

  const importDataFromText = async () => {
    try {
      setSyncing(true);
      const data = JSON.parse(importData);

      if (!data.rooms || !data.courses || !data.professors || !data.allocations) {
        throw new Error("Formato de dados inválido. Certifique-se de que o JSON contém 'rooms', 'courses', 'professors' e 'allocations'.");
      }

      // Validate structure
      if (!Array.isArray(data.rooms) || !Array.isArray(data.courses) || !Array.isArray(data.professors) || !Array.isArray(data.allocations)) {
        throw new Error("Estrutura de dados inválida. Todos os campos devem ser arrays.");
      }

      // Import rooms
      for (const room of data.rooms) {
        await dbService.rooms.create(room);
      }

      // Import courses
      for (const course of data.courses) {
        await dbService.courses.create(course);
      }

      // Import professors
      for (const professor of data.professors) {
        await dbService.professors.create(professor);
      }

      // Import allocations
      if (data.allocations.length > 0) {
        await dbService.allocations.create(data.allocations);
      }

      toast.success("Dados sincronizados com sucesso! Recarregue a página para ver as mudanças.");
      setOpen(false);
      setImportData("");

    } catch (error) {
      toast.error(`Erro ao sincronizar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error("Import error:", error);
    } finally {
      setSyncing(false);
    }
  };

  const clearAllData = async () => {
    if (confirm("Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita.")) {
      try {
        setSyncing(true);
        
        // Delete all allocations first (due to foreign keys)
        const allocations = await dbService.allocations.getAll();
        for (const alloc of allocations) {
          await dbService.allocations.delete(alloc.id);
        }

        toast.success("Todos os dados foram limpos.");
        setOpen(false);
      } catch (error) {
        toast.error("Erro ao limpar dados");
        console.error("Clear error:", error);
      } finally {
        setSyncing(false);
      }
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setImportData(content);
        toast.success("Arquivo carregado! Clique em 'Sincronizar Dados' para confirmar.");
      } catch (error) {
        toast.error("Erro ao ler o arquivo.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Sincronização
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sincronização de Dados</DialogTitle>
          <DialogDescription>
            Sincronize dados entre dispositivos importando um arquivo JSON. Os dados são salvos na nuvem automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Importar Dados */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Sincronizar Dados</h3>
            <p className="text-sm text-muted-foreground">
              Carregue um arquivo de sincronização ou cole os dados JSON abaixo para sincronizar com outro dispositivo.
            </p>

            <div className="space-y-2">
              <Label htmlFor="file-import">Arquivo de sincronização:</Label>
              <Input
                id="file-import"
                type="file"
                accept=".json"
                onChange={handleFileImport}
                disabled={syncing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="json-import">Ou cole os dados JSON:</Label>
              <Textarea
                id="json-import"
                placeholder='Cole aqui o conteúdo do arquivo JSON...'
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={6}
                className="font-mono text-xs"
                disabled={syncing}
              />
            </div>

            <Button
              onClick={importDataFromText}
              disabled={!importData.trim() || syncing}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {syncing ? "Sincronizando..." : "Sincronizar Dados"}
            </Button>
          </div>

          {/* Limpar Dados */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold text-destructive">Zona de Perigo</h3>
            <p className="text-sm text-muted-foreground">
              Limpe todos os dados do sistema. Use com cuidado!
            </p>
            <Button
              onClick={clearAllData}
              variant="destructive"
              className="gap-2"
              disabled={syncing}
            >
              <Trash2 className="h-4 w-4" />
              {syncing ? "Limpando..." : "Limpar Todos os Dados"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={syncing}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}