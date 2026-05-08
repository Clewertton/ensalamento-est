# 🔧 Como Adicionar Variáveis de Ambiente no Vercel

## Passo 1: Acesse seu Projeto no Vercel

1. Vá para: https://vercel.com/dashboard
2. Clique no seu projeto **"ensalamento"**

## Passo 2: Vá em Settings

1. No menu lateral esquerdo, clique em **"Settings"**
2. Role a página até encontrar **"Environment Variables"**

## Passo 3: Adicione as Variáveis

Clique em **"Add New"** e adicione uma por vez:

### Primeira Variável:
```
Name: VITE_SUPABASE_URL
Value: https://stewutteibgsgqpnbnqo.supabase.co
Environment: Production, Preview, Development
```

### Segunda Variável:
```
Name: VITE_SUPABASE_ANON_KEY
Value: #42Tt10WeR6002
Environment: Production, Preview, Development
```

## Passo 4: Salve e Re-deploy

1. Clique em **"Save"** para cada variável
2. Vá para a aba **"Deployments"**
3. Clique nos **3 pontos** do último deploy
4. Clique em **"Redeploy"**

## ✅ Verificação

Após o redeploy, seu site terá acesso às variáveis de ambiente!

---

## 🔍 Como Verificar se Funcionou

1. Abra o console do navegador (F12)
2. Vá na aba **"Console"**
3. Se não houver erros de "SUPABASE_URL not found", está funcionando!

---

## 📝 Importante

- **Prefixo `VITE_`**: Necessário para variáveis acessíveis no frontend
- **Environment**: Selecione todos (Production, Preview, Development)
- **Redeploy**: Sempre necessário após adicionar variáveis

---

## 🆘 Se Não Funcionar

Se ainda der erro, verifique:

1. **Nome correto**: `VITE_SUPABASE_URL` (não `SUPABASE_URL`)
2. **Value correto**: Copie exatamente da URL do Supabase
3. **Redeploy**: Certifique-se de fazer redeploy
4. **Console**: Verifique erros no console do navegador

---

## 📱 Teste Final

Abra seu site em 2 navegadores diferentes e teste:
- Criar alocação em um navegador
- Ver aparecer no outro navegador (sincronização em tempo real)

**Se funcionar, parabéns! 🎉 Seu sistema está 100% na nuvem!**
