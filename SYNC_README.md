# Sistema de Sincronização Automática

Este sistema permite sincronizar automaticamente os dados do ensalamento entre múltiplos dispositivos na mesma rede.

## 🚀 Como Usar (MODO FÁCIL)

### 1. Iniciar Servidor de Sincronização

**Opção A: Script Automático (Windows)**
```bash
# Clique duas vezes no arquivo:
start-sync-server.bat
```

**Opção B: Manual**
```bash
# Instalar dependências
npm install express cors

# Executar servidor
node sync-server.js
```

### 2. Configurar no Aplicativo

1. Abra o aplicativo em qualquer dispositivo: `http://localhost:8084/`
2. Clique no botão **"Sincronização"** (ícone WiFi)
3. Configure:
   - **Nome do Dispositivo**: "Computador Principal", "Notebook", etc.
   - **URL do Servidor**: `http://[IP-DO-COMPUTADOR-SERVIDOR]:3001`
4. Clique no botão **🔗 (Testar Conexão)**
5. Ative **"Sincronização Automática"**

### 3. Pronto! 🎉

- ✅ Dados sincronizam automaticamente entre dispositivos
- ✅ Veja outros dispositivos conectados
- ✅ Status de conexão em tempo real
- ✅ Backup automático no servidor

## 🔍 Como Descobrir o IP do Servidor

### Windows:
```cmd
ipconfig
```
Procure por "Endereço IPv4" na seção do WiFi.

### Linux/Mac:
```bash
ifconfig
# ou
ip addr show
```

## 📱 Usando em Múltiplos Dispositivos

1. **Dispositivo 1**: Configure como servidor (execute `start-sync-server.bat`)
2. **Dispositivo 2+**: Abra o app e configure a sincronização apontando para o IP do Dispositivo 1

## 📊 Funcionalidades

### Sincronização Automática
- **Trigger**: Qualquer mudança (adicionar/editar/excluir alocações, turmas, etc.)
- **Debounce**: 1 segundo para evitar excesso de sincronizações
- **Offline**: Funciona mesmo sem internet (dados locais preservados)

### Monitoramento
- Lista de dispositivos conectados
- Última atividade de cada dispositivo
- Status online/offline
- Timestamp da última sincronização

### Backup Seguro
- Dados sempre salvos localmente (localStorage)
- Servidor mantém backup centralizado
- Recuperação automática ao reconectar

## 🛠️ Solução de Problemas

### "Não foi possível conectar"
- ✅ Verifique se o servidor está rodando
- ✅ Confirme o IP correto
- ✅ Teste: `http://[IP]:3001/health` no navegador
- ✅ Verifique firewall/antivírus

### Dados não sincronizam
- ✅ Ative "Sincronização Automática"
- ✅ Verifique conexão de rede
- ✅ Use "Sincronizar Agora" manualmente
- ✅ Verifique console do navegador (F12)

### Dispositivos não aparecem
- ✅ Cada dispositivo deve conectar pelo menos uma vez
- ✅ Dispositivos inativos são removidos após 5 minutos

## 📁 Arquivos do Sistema

- `start-sync-server.bat` - Script para iniciar servidor (Windows)
- `sync-server.js` - Código do servidor
- `SYNC_README.md` - Este arquivo
- `src/components/ens/AutoSyncDialog.tsx` - Interface no app

## 🔒 Segurança

- Dados trafegam via HTTP (não criptografado)
- Recomendado apenas para redes locais confiáveis
- Para uso na internet, considere VPN ou serviços como Firebase

---

**💡 Dica**: Para uso profissional, considere implementar autenticação e HTTPS!</content>
<parameter name="filePath">c:\Users\EST LAB\Desktop\Clewerton\ensalamento\SYNC_README.md