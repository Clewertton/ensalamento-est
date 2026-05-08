# 🚀 Deploy do Ensalamento na Nuvem

## ⚡ Opção Recomendada: VERCEL

Vercel é gratuito, conecta direto ao GitHub, e atualiza automaticamente.

### Passo 1: Preparar o GitHub

1. **Crie uma conta no GitHub** (se não tiver): https://github.com
2. **Crie um repositório novo** chamado `ensalamento`
3. **Clone o repositório** na sua máquina:
```bash
git clone https://github.com/SEU-USER/ensalamento.git
cd ensalamento
```

4. **Copie todos os arquivos do projeto** para o repositório
5. **Faça o primeiro commit**:
```bash
git add .
git commit -m "Versão inicial com Supabase"
git push origin main
```

### Passo 2: Deploy no Vercel

1. **Acesse**: https://vercel.com
2. **Clique em "Sign Up"** (pode usar sua conta GitHub)
3. **Clique em "New Project"**
4. **Selecione seu repositório** `ensalamento`
5. **Configure as variáveis de ambiente**:
   - Na seção **Environment Variables**, adicione:
   ```
   VITE_SUPABASE_URL=https://stewutteibgsgqpnbnqo.supabase.co
   VITE_SUPABASE_ANON_KEY=#42Tt10WeR6002
   ```
6. **Clique em "Deploy"** 🚀

**Pronto!** Seu site estará em: `https://ensalamento-xxx.vercel.app`

---

## 📝 Atualizações Automáticas

Sempre que você fazer um `git push`:
1. Vercel detecta a mudança
2. Faz build automático
3. Deploy ao vivo em ~2 minutos

```bash
# Fazer uma mudança
echo "Nova feature" >> README.md

# Enviar para o GitHub
git add .
git commit -m "Nova feature"
git push origin main

# Vercel atualiza automaticamente!
```

---

## 🔧 Arquivos Importantes para Vercel

Você pode criar um `vercel.json` na raiz do projeto (opcional):

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  }
}
```

---

## 🌍 Domínio Customizado (Opcional)

Se quiser um domínio próprio (ex: `ensalamento.com.br`):

1. Compre um domínio (Namecheap, GoDaddy, etc)
2. No Vercel, vá em **Settings > Domains**
3. Adicione seu domínio
4. Configure o DNS conforme instruções do Vercel

---

## 💾 Outras Opções de Deploy

### Netlify (Similar ao Vercel)
```bash
npm run build
# Zip a pasta 'dist'
# Arraste para netlify.com
```

### Cloudflare Pages (Muito rápido)
1. Acesse: https://pages.cloudflare.com
2. Conecte seu GitHub
3. Configure igual Vercel

### Railway.app (Com Backend)
1. Acesse: https://railway.app
2. Crie um novo projeto
3. Conecte o GitHub
4. Configure variáveis de ambiente

---

## 🔐 Variáveis de Ambiente

**Nunca commit credenciais!** Use `.env.local`:

```bash
# .env.local (NUNCA faça commit!)
VITE_SUPABASE_URL=https://stewutteibgsgqpnbnqo.supabase.co
VITE_SUPABASE_ANON_KEY=#42Tt10WeR6002
```

Adicione ao `.gitignore`:
```bash
.env.local
.env.*.local
```

---

## 📊 Arquitetura Final

```
Seus Usuários (Internet)
        ↓
  Vercel (Frontend na nuvem)
        ↓
  Supabase (Backend na nuvem)
```

✅ **Seu PC pode estar desligado a noite inteira!**
✅ **Todos os dados na nuvem com backup automático**
✅ **Sincronização em tempo real para 2+ usuários**

---

## 🛠️ Troubleshooting Deploy

| Erro | Solução |
|------|---------|
| Build fails | Verifique `npm run build` localmente |
| Variables not found | Confirme em Vercel Settings > Environment |
| Realtime não funciona | Cheque se Supabase Realtime está habilitado |
| 404 em rotas | Configure em vercel.json |

---

## 📱 Acessar de Qualquer Lugar

Depois do deploy:
1. Desktop: `https://ensalamento-xxx.vercel.app`
2. Celular: Mesma URL no navegador do celular
3. Outro computador: Mesma URL
4. **Todos sincronizam em tempo real via Supabase!**

---

## ✨ Próximos Passos

1. ✅ Crie repositório no GitHub
2. ✅ Faça push do código
3. ✅ Deploy no Vercel
4. ✅ Teste com 2 navegadores simultaneamente
5. ✅ Veja a sincronização em tempo real! 🎉

**Desenvolvido com ❤️ usando Supabase + Vercel**
