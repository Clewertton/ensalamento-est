import { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const Route = createFileRoute('/validate')({
  component: ValidatePage,
});

function ValidatePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // O Supabase envia tokens via Hash (#) ou Search (?)
    const hash = window.location.hash;
    const query = window.location.search;

    // Tratamento de erros caso o link tenha expirado ou seja inválido
    if (query.includes('error_description=')) {
      const params = new URLSearchParams(query);
      setStatus('error');
      setErrorMessage(params.get('error_description') || 'Erro ao validar o link.');
      return;
    }

    if (hash.includes('error_description=')) {
      const params = new URLSearchParams(hash.substring(1));
      setStatus('error');
      setErrorMessage(params.get('error_description') || 'Erro ao validar o link.');
      return;
    }

    // Se não há erros, o Supabase tratou o token e autorizou.
    // Mostramos a animação de sucesso e esperamos 3 segundos para redirecionar.
    setStatus('success');
    
    const timer = setTimeout(() => {
      navigate({ to: '/' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 relative overflow-hidden">
      {/* Fundo Animado Baseado no Login */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-blue-200/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full animate-spin-slow"></div>
      </div>

      {/* Card Central */}
      <div className="relative z-10 w-full max-w-md text-center bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-white/20 animate-fade-in">
        {status === 'loading' && (
          <div className="flex flex-col items-center animate-slide-up">
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Validando seu acesso...</h2>
            <p className="text-gray-600 mt-2">Aguarde um momento enquanto confirmamos seus dados.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-slide-up">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <CheckCircle2 className="h-20 w-20 text-green-500 relative z-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">E-mail Validado!</h2>
            <p className="text-gray-600">Sua conta foi verificada com sucesso.</p>
            <p className="text-sm text-primary font-medium mt-6 animate-pulse">Redirecionando para o sistema...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-slide-up">
            <XCircle className="h-20 w-20 text-red-500 mb-6 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro na Validação</h2>
            <p className="text-red-600">{errorMessage}</p>
            <button 
              onClick={() => navigate({ to: '/login' })}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-medium rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Voltar para o Login
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}