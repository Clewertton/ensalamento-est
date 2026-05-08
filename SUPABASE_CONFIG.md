# 🚀 Configuração Supabase - Ensalamento

## Passo 1: Criar as Tabelas no Supabase

1. Acesse seu dashboard: https://supabase.com/dashboard/project/stewutteibgsgqpnbnqo
2. Vá em **SQL Editor**
3. Clique em **+ New Query**
4. Copie e cole todo o conteúdo do arquivo `SUPABASE_SETUP.sql` que está na raiz do projeto
5. Clique em **Run** para executar

## Passo 2: Instalar Dependências

Se ainda não instalou `@supabase/supabase-js`, execute:

```bash
npm install @supabase/supabase-js
# ou
bun add @supabase/supabase-js
# ou
yarn add @supabase/supabase-js
```

## Passo 3: Variáveis de Ambiente

As credenciais já estão configuradas em `src/lib/supabase.ts`:
- **URL**: `https://stewutteibgsgqpnbnqo.supabase.co`
- **API Key**: `#42Tt10WeR6002`

Se precisar mudar depois, edite o arquivo `src/lib/supabase.ts`.

## Passo 4: Iniciar o Projeto

```bash
npm run dev
# ou
bun run dev
```

## 📊 Estrutura de Dados

### rooms (Salas)
```
id (PK)        | text
name           | text      (ex: "A1")
building       | text      (ex: "Bloco A")
capacity       | integer   (capacidade de alunos)
created_at     | timestamp
updated_at     | timestamp
```

### courses (Turmas)
```
id (PK)        | text
name           | text      (ex: "Cálculo I")
professor      | text      (nome do professor)
students       | integer   (quantidade de alunos)
created_at     | timestamp
updated_at     | timestamp
```

### professors (Professores)
```
id (PK)        | text
name           | text
created_at     | timestamp
updated_at     | timestamp
```

### allocations (Alocações)
```
id (PK)              | text
course_id (FK)       | text
room_id (FK)         | text
semester             | text      (ex: "2026.1")
shift                | text      (Matutino/Vespertino/Noturno)
weekday              | text      (Segunda/Terça/...)
start                | text      (HH:MM)
end                  | text      (HH:MM)
status               | text      (Pendente/Confirmado/Conflito)
created_at           | timestamp
confirmed_at         | timestamp (nullable)
notes                | text      (nullable)
updated_at           | timestamp
```

## 🔄 Sincronização em Tempo Real

A sincronização é automática! Quando qualquer usuário faz uma mudança:
1. Os dados são salvos no Supabase
2. Todos os usuários conectados recebem a atualização instantaneamente
3. A interface atualiza automaticamente

## 🛡️ Segurança

As políticas de Row Level Security (RLS) ainda não foram configuradas. Se precisar:

1. Vá em **Authentication > Policies** no dashboard
2. Configure políticas para que apenas usuários autenticados possam acessar os dados

## 📝 Dados Iniciais

Para inserir dados de teste, descomente a seção final do arquivo `SUPABASE_SETUP.sql` e execute novamente.

## ❌ Troubleshooting

### Erro: "Cannot find @supabase/supabase-js"
```bash
npm install @supabase/supabase-js
```

### Erro: "Connection refused"
- Verifique se a URL do Supabase está correta
- Verifique se a API Key está correta
- Verifique sua conexão com internet

### Dados não sincronizam em tempo real
- Verifique se o Realtime está habilitado nas tabelas (já configurado no SQL)
- Feche e abra a aba do navegador

---

**Desenvolvido com ❤️ usando Supabase + React + TanStack Start**
