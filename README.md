# Ensalamento - Sistema de Alocação de Salas

Web app para gestão de ensalamento com sincronização em tempo real via Supabase.

## 🚀 Projeto

- **Deploy Vercel**: https://ensalamento-est.vercel.app
- **Banco de dados**: Supabase
- **Sincronização**: realtime entre até 2 usuários
- **Frontend**: React + TypeScript + Vite

## 🧩 Instalação

```bash
npm install
npm run dev
```

## 🔧 Configuração

Copie o arquivo de ambiente e preencha suas credenciais Supabase:

```bash
copy .env.example .env.local
```

Edite `.env.local` com:

```env
VITE_SUPABASE_URL=https://stewutteibgsgqpnbnqo.supabase.co
VITE_SUPABASE_ANON_KEY=#42Tt10WeR6002
```

## 🧪 Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 📌 Observações

- Não commit `.env.local`.
- O site de produção é `https://ensalamento-est.vercel.app`.
- A rota SPA funciona graças aos rewrites do `vercel.json`.

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