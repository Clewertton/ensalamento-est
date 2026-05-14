import { createContext, useContext, ReactNode } from 'react';
import { useScheduling as useSchedulingHook } from '@/hooks/use-scheduling';

type SchedulingContextType = ReturnType<typeof useSchedulingHook>;

const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

/**
 * Por que: O Provider garante que a conexão WebSocket (Realtime) do Supabase
 * seja estabelecida apenas uma vez na raiz da aplicação. Isso evita "connection thrashing"
 * (criar e destruir conexões repetidamente) ao navegar entre as rotas.
 */
export function SchedulingProvider({ children }: { children: ReactNode }) {
  // O hook original executa apenas UMA vez aqui no topo
  const scheduling = useSchedulingHook();
  
  return (
    <SchedulingContext.Provider value={scheduling}>
      {children}
    </SchedulingContext.Provider>
  );
}

export function useSharedScheduling() {
  const context = useContext(SchedulingContext);
  if (context === undefined) {
    throw new Error('useSharedScheduling deve ser usado dentro de um SchedulingProvider');
  }
  return context;
}