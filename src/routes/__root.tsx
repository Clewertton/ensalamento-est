import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import "../styles.css";
import { AuthProvider } from "../lib/auth";
import { SchedulingProvider } from "../lib/SchedulingContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-200/30 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-200/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-10 right-10 w-18 h-18 bg-yellow-200/30 rounded-full animate-bounce delay-1500"></div>
      </div>

      <div className="max-w-md text-center relative z-10">
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-blue-200 rounded-full animate-spin opacity-20"></div>
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800 animate-fade-in">
          Página não encontrada
        </h2>
        <p className="mt-2 text-gray-600 animate-fade-in delay-200">
          Ops! Parece que você se perdeu no caminho. A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-8 animate-fade-in delay-400">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary/80 px-6 py-3 text-white font-medium transition-all duration-300 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🏠 Voltar para o Início
          </a>
        </div>
        <div className="mt-6 animate-fade-in delay-600">
          <p className="text-sm text-gray-500">
            Se acredita que isso é um erro, entre em contato com o suporte.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1500 { animation-delay: 1.5s; }
      `}</style>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-16 h-16 bg-red-200/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-orange-200/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-100/20 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-md text-center relative z-10">
        <div className="relative mb-8">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 animate-pulse">
            !
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-red-200 rounded-full animate-spin opacity-30"></div>
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800 animate-fade-in">
          Ops! Algo deu errado
        </h2>
        <p className="mt-2 text-gray-600 animate-fade-in delay-200">
          Ocorreu um erro inesperado. Tente recarregar a página ou volte para o início.
        </p>
        <div className="mt-8 space-y-4 animate-fade-in delay-400">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary/80 px-6 py-3 text-white font-medium transition-all duration-300 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 shadow-lg hover:shadow-xl mr-4"
          >
            🔄 Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-foreground font-medium transition-all duration-300 hover:bg-accent transform hover:scale-105"
          >
            🏠 Voltar para o início
          </a>
        </div>
        <div className="mt-6 animate-fade-in delay-600">
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Detalhes técnicos
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SchedulingProvider>
          <Outlet />
        </SchedulingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
