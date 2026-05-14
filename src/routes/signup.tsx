import { createFileRoute, redirect } from '@tanstack/react-router';
import { Signup } from '@/components/auth/Signup';

export const Route = createFileRoute('/signup')({
  beforeLoad: () => {
    // Por que: Camada extra. Se seu router (TanStack) tiver integração de contexto aqui no futuro, 
    // você previne até mesmo o download dos chunks do formulário bloqueando no root.
  },
  component: Signup,
});