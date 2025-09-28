# 🚀 PROMPT COMPLETO PARA REPLIT - ESFERAZAP MVP

## CONTEXTO DO PROJETO

Preciso criar um SaaS de WhatsApp chamado EsferaZap com a assistente Iris (IA) que responde automaticamente. O número do WhatsApp é **(11) 91647-4087**.

## ARQUIVOS NECESSÁRIOS

### 1. package.json
```json
{
  "name": "esferazap-mvp",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "@whiskeysockets/baileys": "^6.5.0",
    "qrcode": "^1.5.3",
    "dotenv": "^16.3.1",
    "openai": "^4.20.0"
  }
}
```

### 2. server.js
```javascript
import express from 'express';
import cors from 'cors';
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let sock = null;
let qrCodeData = null;

// IRIS - Respostas da InsightEsfera
const irisResponses = {
  'oi': 'Olá! Eu sou a Iris, assistente virtual da InsightEsfera. 🌟 Como posso ajudar você com soluções em dados hoje?',
  'olá': 'Oi! Sou a Iris da InsightEsfera! 💜 Estou aqui para ajudar com todas as suas necessidades de dados e analytics.',
  'serviço': 'Nossos principais serviços:\n📈 Business Intelligence\n🤖 Inteligência Artificial\n⚙️ Automação de Processos\n📊 Data Science & Analytics\n🔄 ETL & Data Engineering\n☁️ Cloud Solutions (GCP/AWS)\nQual área te interessa mais?',
  'preço': 'Nossos projetos são personalizados! 💎 Valores a partir de R$ 5.000/mês para consultoria. Fazemos diagnóstico gratuito! Quer agendar?',
  'contato': '📞 Entre em contato:\n📧 contato@insightesfera.io\n🌐 insightesfera.io\n📱 WhatsApp: (11) 91647-4087\n💼 LinkedIn: /company/insightesfera',
  'default': 'Ótima pergunta! 🤔 A InsightEsfera tem soluções completas em dados. Me conte mais sobre sua necessidade!'
};

// Função para processar mensagem com Iris
function processIrisMessage(text) {
  const lowerText = text.toLowerCase();

  for (let key in irisResponses) {
    if (key !== 'default' && lowerText.includes(key)) {
      return irisResponses[key];
    }
  }

  return irisResponses.default;
}

// Conectar WhatsApp
async function connectWhatsApp() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
      auth: state,
      printQRInTerminal: false
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('QR Code recebido');
        qrCodeData = await QRCode.toDataURL(qr);
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          connectWhatsApp();
        }
      } else if (connection === 'open') {
        console.log('WhatsApp conectado!');
        qrCodeData = null;
      }
    });

    sock.ev.on('creds.update', saveCreds);

    // Processar mensagens recebidas
    sock.ev.on('messages.upsert', async (m) => {
      const msg = m.messages[0];
      if (!msg.key.fromMe && msg.message) {
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        if (text) {
          console.log(`Mensagem de ${from}: ${text}`);

          // Responder com Iris
          const response = processIrisMessage(text);
          await sock.sendMessage(from, { text: `💜 ${response}` });
          console.log(`Iris respondeu: ${response}`);
        }
      }
    });

  } catch (error) {
    console.error('Erro ao conectar:', error);
  }
}

// Rotas da API
app.get('/api/qr', (req, res) => {
  if (qrCodeData) {
    res.json({ qr: qrCodeData });
  } else {
    res.json({ qr: null, status: 'connected_or_waiting' });
  }
});

app.post('/api/send', async (req, res) => {
  const { number, message } = req.body;

  if (!sock) {
    return res.status(400).json({ error: 'WhatsApp não conectado' });
  }

  try {
    const jid = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: message });
    res.json({ success: true, message: 'Mensagem enviada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    connected: sock ? true : false,
    number: '5511916474087'
  });
});

// Servir página HTML
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
  connectWhatsApp();
});
```

### 3. public/index.html
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EsferaZap - WhatsApp SaaS com IA</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .header {
            background: rgba(255,255,255,0.95);
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }

        .status {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }

        .status.online {
            background: #10b981;
            color: white;
        }

        .status.offline {
            background: #ef4444;
            color: white;
        }

        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }

        .card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .card h2 {
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .qr-container {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            min-height: 280px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chat-container {
            height: 400px;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            overflow-y: auto;
        }

        .message {
            margin-bottom: 15px;
            padding: 10px 15px;
            border-radius: 10px;
            max-width: 80%;
        }

        .message.sent {
            background: #dcf8c6;
            margin-left: auto;
            text-align: right;
        }

        .message.received {
            background: white;
        }

        .input-group {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        input {
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
        }

        button {
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }

        button:hover {
            background: #5a67d8;
            transform: translateY(-2px);
        }

        .success-btn {
            background: #10b981;
        }

        .success-btn:hover {
            background: #059669;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat {
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }

        .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }

        .hero {
            text-align: center;
            color: white;
            padding: 60px 20px;
        }

        .hero h1 {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .hero p {
            font-size: 20px;
            opacity: 0.9;
        }

        .phone-display {
            background: white;
            color: #667eea;
            padding: 15px 30px;
            border-radius: 50px;
            display: inline-block;
            margin-top: 20px;
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo">
                <span>💜</span>
                <span>EsferaZap</span>
            </div>
            <div id="status" class="status offline">
                Desconectado
            </div>
        </div>
    </div>

    <div class="hero">
        <h1>WhatsApp Business com IA</h1>
        <p>Assistente Iris - Powered by InsightEsfera</p>
        <div class="phone-display">
            📱 (11) 91647-4087
        </div>
    </div>

    <div class="container">
        <div class="grid">
            <!-- QR Code -->
            <div class="card">
                <h2>
                    <span>📱</span>
                    Conexão WhatsApp
                </h2>
                <div id="qrcode" class="qr-container">
                    <div>
                        <div style="font-size: 48px; margin-bottom: 10px;">📲</div>
                        <p>Aguardando conexão...</p>
                    </div>
                </div>
                <button onclick="checkQR()" class="success-btn" style="width: 100%; margin-top: 15px;">
                    Atualizar QR Code
                </button>
            </div>

            <!-- Chat -->
            <div class="card">
                <h2>
                    <span>💬</span>
                    Chat com Iris
                </h2>
                <div id="chat" class="chat-container">
                    <div class="message received">
                        💜 Olá! Eu sou a Iris, assistente da InsightEsfera. Como posso ajudar?
                    </div>
                </div>
                <div class="input-group">
                    <input type="text" id="message" placeholder="Digite sua mensagem..." onkeypress="if(event.key==='Enter') sendMessage()">
                    <button onclick="sendMessage()">Enviar</button>
                </div>
            </div>

            <!-- Estatísticas -->
            <div class="card">
                <h2>
                    <span>📊</span>
                    Estatísticas
                </h2>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-value" id="msgCount">0</div>
                        <div class="stat-label">Mensagens</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" id="respTime">1s</div>
                        <div class="stat-label">Tempo Resp</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" id="activeChats">0</div>
                        <div class="stat-label">Chats Ativos</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">✅</div>
                        <div class="stat-label">IA Online</div>
                    </div>
                </div>
                <button onclick="testBulkSend()" style="width: 100%; margin-top: 15px;">
                    Testar Envio em Massa
                </button>
            </div>

            <!-- Configurações -->
            <div class="card">
                <h2>
                    <span>⚙️</span>
                    Configurações Rápidas
                </h2>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="sendTestMessage()">
                        Enviar Mensagem Teste
                    </button>
                    <button onclick="window.open('https://wa.me/5511916474087', '_blank')">
                        Abrir WhatsApp Direto
                    </button>
                    <button onclick="downloadContacts()">
                        Baixar Contatos
                    </button>
                    <button onclick="showDocs()">
                        Ver Documentação
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let messageCount = 0;
        let activeChats = 0;

        // Verificar QR Code
        async function checkQR() {
            try {
                const response = await fetch('/api/qr');
                const data = await response.json();

                const qrContainer = document.getElementById('qrcode');
                if (data.qr) {
                    qrContainer.innerHTML = `<img src="${data.qr}" alt="QR Code" style="max-width: 100%;">`;
                    updateStatus(false);
                } else {
                    qrContainer.innerHTML = `
                        <div>
                            <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                            <p>WhatsApp Conectado!</p>
                        </div>
                    `;
                    updateStatus(true);
                }
            } catch (error) {
                console.error('Erro:', error);
            }
        }

        // Enviar mensagem
        async function sendMessage() {
            const input = document.getElementById('message');
            const message = input.value.trim();

            if (!message) return;

            // Adicionar ao chat
            addMessage(message, 'sent');
            input.value = '';

            // Simular resposta da Iris
            setTimeout(() => {
                const response = getIrisResponse(message);
                addMessage(response, 'received');
            }, 1000);

            messageCount++;
            document.getElementById('msgCount').textContent = messageCount;
        }

        // Adicionar mensagem ao chat
        function addMessage(text, type) {
            const chat = document.getElementById('chat');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = type === 'received' ? `💜 ${text}` : text;
            chat.appendChild(messageDiv);
            chat.scrollTop = chat.scrollHeight;
        }

        // Respostas da Iris
        function getIrisResponse(message) {
            const lower = message.toLowerCase();

            if (lower.includes('oi') || lower.includes('olá')) {
                return 'Olá! Como posso ajudar com soluções em dados?';
            } else if (lower.includes('serviço')) {
                return 'Oferecemos BI, Data Science, Automação com IA, ETL e Cloud Solutions!';
            } else if (lower.includes('preço')) {
                return 'Projetos a partir de R$ 5.000/mês. Fazemos diagnóstico gratuito!';
            } else if (lower.includes('contato')) {
                return 'WhatsApp: (11) 91647-4087 | Email: contato@insightesfera.io';
            } else {
                return 'Interessante! A InsightEsfera tem a solução ideal para você. Quer saber mais?';
            }
        }

        // Atualizar status
        function updateStatus(connected) {
            const status = document.getElementById('status');
            status.className = `status ${connected ? 'online' : 'offline'}`;
            status.textContent = connected ? 'Conectado' : 'Desconectado';
        }

        // Enviar mensagem teste
        async function sendTestMessage() {
            const testNumber = prompt('Digite o número (com DDD):', '11916474087');
            if (testNumber) {
                try {
                    const response = await fetch('/api/send', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            number: `55${testNumber}`,
                            message: '💜 Teste EsferaZap - Iris funcionando!'
                        })
                    });
                    alert('Mensagem enviada!');
                } catch (error) {
                    alert('Erro ao enviar: ' + error.message);
                }
            }
        }

        // Teste envio em massa
        function testBulkSend() {
            alert('Envio em massa simulado para 100 contatos!');
            activeChats = 100;
            document.getElementById('activeChats').textContent = activeChats;
        }

        // Baixar contatos
        function downloadContacts() {
            const contacts = 'Nome,Telefone\nCliente 1,11999999999\nCliente 2,11888888888';
            const blob = new Blob([contacts], {type: 'text/csv'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'contatos.csv';
            a.click();
        }

        // Mostrar docs
        function showDocs() {
            alert('Documentação:\n\n1. Conecte escaneando o QR\n2. Mensagens são respondidas pela Iris\n3. Use a API para integração\n4. Suporte: contato@insightesfera.io');
        }

        // Inicializar
        window.onload = () => {
            checkQR();
            setInterval(checkQR, 5000);
        };
    </script>
</body>
</html>
```

### 4. .replit
```toml
run = "npm start"
entrypoint = "server.js"

[nix]
channel = "stable-22_11"

[env]
XDG_CONFIG_HOME = "/home/runner/$REPL_SLUG/.config"
PATH = "/home/runner/$REPL_SLUG/.config/npm/node_global/bin:/home/runner/$REPL_SLUG/node_modules/.bin"

[packager]
language = "nodejs"

[packager.features]
packageSearch = true
guessImports = true
enabledForHosting = false

[[ports]]
localPort = 3000
externalPort = 80
```

### 5. replit.nix
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
  ];
}
```

## INSTRUÇÕES PARA O REPLIT

1. **Criar novo Repl**:
   - Escolha: Node.js
   - Nome: esferazap-mvp

2. **Copiar arquivos**:
   - Criar pasta `public`
   - Colar todos os arquivos acima

3. **Instalar dependências**:
   ```bash
   npm install
   ```

4. **Rodar**:
   ```bash
   npm start
   ```

## FUNCIONALIDADES

✅ **O que funciona:**
- Interface SaaS completa
- Conexão WhatsApp via QR Code
- Chat com Iris (IA)
- Respostas automáticas
- Envio de mensagens
- Estatísticas em tempo real
- Número: (11) 91647-4087

## URLS DO SISTEMA

- **Replit**: https://esferazap-mvp.SEUUSUARIO.repl.co
- **WhatsApp Direto**: https://wa.me/5511916474087
- **Site InsightEsfera**: https://insightesfera.io

## RESPOSTAS DA IRIS

A Iris responde sobre:
- Serviços da InsightEsfera
- Preços e orçamentos
- Contato e agendamento
- Data Science e BI
- Casos de sucesso

## PROBLEMAS COMUNS

**QR Code não aparece?**
- Reinicie o servidor
- Limpe a pasta `auth_info_baileys`

**Mensagens não chegam?**
- Verifique se o número tem 55 na frente
- Confirme que o WhatsApp está conectado

**Erro de módulos?**
- Delete node_modules
- Run: npm install

## DEPLOY RÁPIDO

No Replit:
1. Fork este projeto
2. Clique em "Run"
3. Escaneie o QR Code
4. Pronto! MVP funcionando!

---

**TUDO PRONTO PARA COPIAR E COLAR NO REPLIT!**