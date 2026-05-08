import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Wifi, WifiOff, RefreshCw, Link, Unlink } from "lucide-react";
import { store } from "@/lib/scheduling";

interface SyncPeer {
  id: string;
  name: string;
  lastSeen: number;
}

function AutoSyncDialog() {
  const [open, setOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncEnabled, setSyncEnabled] = useState(() => {
    return JSON.parse(localStorage.getItem("syncEnabled") || "false");
  });
  const defaultServerUrl =
    typeof window !== "undefined"
      ? `http://${window.location.hostname}:3001`
      : "http://localhost:3001";
  const [serverUrl, setServerUrl] = useState(
    () => localStorage.getItem("syncServerUrl") || defaultServerUrl,
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [peers, setPeers] = useState<SyncPeer[]>([]);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [deviceName, setDeviceName] = useState(() => {
    return (
      localStorage.getItem("deviceName") ||
      `Dispositivo ${Math.random().toString(36).substr(2, 8)}`
    );
  });
  const [deviceId] = useState(() => {
    return (
      localStorage.getItem("deviceId") || Math.random().toString(36).substr(2, 16)
    );
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("syncEnabled", JSON.stringify(syncEnabled));
  }, [syncEnabled]);

  useEffect(() => {
    localStorage.setItem("syncServerUrl", serverUrl);
  }, [serverUrl]);

  useEffect(() => {
    if (!syncEnabled || !isOnline) return;

    const syncData = async () => {
      try {
        const data = {
          rooms: store.getRooms(),
          courses: store.getCourses(),
          professors: store.getProfessors(),
          allocations: store.getAllocations(),
          timestamp: Date.now(),
        };

        const response = await fetch(`${serverUrl}/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setLastSync(Date.now());
          console.log("Dados sincronizados automaticamente");
        }
      } catch (error) {
        console.error("Erro na sincronização automática:", error);
      }
    };

    syncData();

    const handler = () => {
      setTimeout(syncData, 1000);
    };

    window.addEventListener("ens:changed", handler);
    return () => window.removeEventListener("ens:changed", handler);
  }, [syncEnabled, isOnline, serverUrl]);

  const testConnection = async () => {
    setIsConnecting(true);
    try {
      const peerResponse = await fetch(`${serverUrl}/peer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deviceId, name: deviceName }),
      });

      if (!peerResponse.ok) {
        throw new Error("Erro ao registrar dispositivo");
      }

      const healthResponse = await fetch(`${serverUrl}/health`);

      if (!healthResponse.ok) {
        throw new Error("Servidor respondeu com erro");
      }

      toast.success("Conexão estabelecida com sucesso!");
      setSyncEnabled(true);
      localStorage.setItem("deviceName", deviceName);
      localStorage.setItem("deviceId", deviceId);
      await fetchPeers();
      await pullData();
    } catch (error) {
      toast.error("Não foi possível conectar ao servidor de sincronização");
      console.error("Connection test failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchPeers = async () => {
    try {
      const response = await fetch(`${serverUrl}/peers`);
      if (response.ok) {
        const data = await response.json();
        setPeers(data.peers || []);
      }
    } catch (error) {
      console.error("Erro ao buscar peers:", error);
    }
  };

  const pullData = async () => {
    try {
      const response = await fetch(`${serverUrl}/sync`);
      if (response.ok) {
        const data = await response.json();

        store.setRooms(data.rooms || []);
        store.setCourses(data.courses || []);
        store.setProfessors(data.professors || []);
        store.setAllocations(data.allocations || []);

        setLastSync(Date.now());
        toast.success("Dados sincronizados do servidor!");
        window.dispatchEvent(new CustomEvent("ens:changed"));
        await fetchPeers();
      } else {
        throw new Error("Erro ao buscar dados");
      }
    } catch (error) {
      toast.error("Erro ao sincronizar dados. Verifique a URL e se o servidor está ativo.");
      console.error("Pull data failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          {syncEnabled && isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          )}
          Sincronização
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {syncEnabled && isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-muted-foreground" />
            )}
            Sincronização Automática
          </DialogTitle>
          <DialogDescription>
            Mantenha seus dados sincronizados entre dispositivos automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status da Conexão:</span>
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sincronização:</span>
            <Badge variant={syncEnabled ? "default" : "secondary"}>
              {syncEnabled ? "Ativa" : "Inativa"}
            </Badge>
          </div>

          {lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Última Sync:</span>
              <span className="text-xs text-muted-foreground">
                {new Date(lastSync).toLocaleTimeString()}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="device-name">Nome do Dispositivo:</Label>
            <Input
              id="device-name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="Ex: Computador Principal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="server-url">URL do Servidor:</Label>
            <div className="flex gap-2">
              <Input
                id="server-url"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder={defaultServerUrl}
              />
              <Button
                onClick={testConnection}
                disabled={isConnecting || !isOnline}
                size="sm"
              >
                {isConnecting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Link className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={pullData}
              disabled={!syncEnabled || !isOnline}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar Agora
            </Button>
            <Button
              onClick={() => setSyncEnabled(!syncEnabled)}
              variant={syncEnabled ? "destructive" : "default"}
              className="flex-1"
            >
              {syncEnabled ? (
                <>
                  <Unlink className="h-4 w-4 mr-2" />
                  Desativar
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Ativar
                </>
              )}
            </Button>
          </div>

          {peers.length > 0 && (
            <div className="space-y-2">
              <Label>Dispositivos Conectados:</Label>
              <div className="space-y-1">
                {peers.map((peer) => (
                  <div key={peer.id} className="flex items-center justify-between text-sm">
                    <span>{peer.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor((Date.now() - peer.lastSeen) / 1000)}s atrás
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Para usar:</strong></p>
            <p>1. Configure um servidor de sincronização separado</p>
            <p>2. Digite a URL de rede do servidor (por exemplo: http://192.168.0.10:3001)</p>
            <p>3. Teste a conexão e ative a sincronização automática</p>
            <p>4. Os dados serão sincronizados automaticamente entre dispositivos</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AutoSyncDialog;
