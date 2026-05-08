const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Arquivo para armazenar dados sincronizados
const DATA_FILE = path.join(__dirname, 'sync-data.json');

// Estado em memória
let syncData = {
  rooms: [],
  courses: [],
  professors: [],
  allocations: [],
  timestamp: Date.now(),
  peers: []
};

// Carregar dados do arquivo se existir
if (fs.existsSync(DATA_FILE)) {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    syncData = { ...syncData, ...JSON.parse(fileData) };
    console.log('Dados carregados do arquivo');
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

// Salvar dados no arquivo
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(syncData, null, 2));
    console.log('Dados salvos no arquivo');
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

// Rotas da API

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Obter dados sincronizados
app.get('/sync', (req, res) => {
  res.json(syncData);
});

// Enviar dados para sincronização
app.post('/sync', (req, res) => {
  try {
    const newData = req.body;

    // Atualizar dados se forem mais recentes
    if (newData.timestamp > syncData.timestamp) {
      syncData = {
        ...syncData,
        ...newData,
        timestamp: Date.now()
      };
      saveData();
      console.log('Dados atualizados via POST');
    }

    res.json({ success: true, timestamp: syncData.timestamp });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar peer (dispositivo)
app.post('/peer', (req, res) => {
  try {
    const { id, name } = req.body;

    const existingPeerIndex = syncData.peers.findIndex(p => p.id === id);
    const peer = {
      id,
      name: name || `Dispositivo ${id.slice(0, 8)}`,
      lastSeen: Date.now()
    };

    if (existingPeerIndex >= 0) {
      syncData.peers[existingPeerIndex] = peer;
    } else {
      syncData.peers.push(peer);
    }

    // Limpar peers inativos (mais de 5 minutos)
    syncData.peers = syncData.peers.filter(p =>
      Date.now() - p.lastSeen < 5 * 60 * 1000
    );

    saveData();
    res.json({ success: true, peers: syncData.peers });
  } catch (error) {
    console.error('Erro ao registrar peer:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter lista de peers
app.get('/peers', (req, res) => {
  // Limpar peers inativos
  syncData.peers = syncData.peers.filter(p =>
    Date.now() - p.lastSeen < 5 * 60 * 1000
  );

  res.json({ peers: syncData.peers });
});

// Limpar todos os dados
app.delete('/sync', (req, res) => {
  syncData = {
    rooms: [],
    courses: [],
    professors: [],
    allocations: [],
    timestamp: Date.now(),
    peers: []
  };
  saveData();
  res.json({ success: true });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor de sincronização rodando em:`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Rede: http://[IP-DA-REDE]:${PORT}`);
  console.log(`📁 Dados salvos em: ${DATA_FILE}`);
  console.log(`💡 Para usar: inicie este servidor e configure a URL no aplicativo`);
});

// Tratamento de erros
process.on('SIGINT', () => {
  console.log('\n🛑 Salvando dados antes de sair...');
  saveData();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Salvando dados antes de sair...');
  saveData();
  process.exit(0);
});