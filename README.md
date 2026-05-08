# Ensalamento - Sistema de Alocação de Salas

Sistema web para gerenciamento de alocações de salas de aula, com sincronização em tempo real entre usuários.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Roteamento**: TanStack Router
- **Banco de Dados**: Supabase (PostgreSQL)
- **Sincronização**: Tempo real via Supabase Realtime
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Conta no Vercel (opcional para deploy)

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd ensalamento
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

Edite o `.env.local` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Execute o projeto
```bash
npm run dev
```

## 🌐 Deploy no Vercel

### 1. Faça push do código
```bash
git add .
git commit -m "Deploy inicial"
git push origin main
```

### 2. Configure as variáveis de ambiente no Vercel

Siga as instruções no arquivo `VERCEL_ENV_VARS.md` para adicionar:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Deploy automático

O Vercel fará o deploy automaticamente após o push. Você pode acompanhar o progresso no dashboard do Vercel.

## 📊 Funcionalidades

- ✅ Gerenciamento de salas, cursos e professores
- ✅ Alocações para múltiplos dias da semana
- ✅ Sincronização em tempo real entre usuários
- ✅ Interface Kanban para gestão de status
- ✅ Métricas e relatórios
- ✅ Design responsivo

## 🔧 Desenvolvimento

### Scripts disponíveis
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executa ESLint
```

### Estrutura do projeto
```
src/
├── components/       # Componentes React
│   ├── ens/         # Componentes específicos do app
│   └── ui/          # Componentes de UI reutilizáveis
├── hooks/           # Hooks customizados
├── lib/             # Utilitários e configurações
├── routes/          # Páginas/Rotas
└── styles.css       # Estilos globais
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.