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

let sock = null;
let qrCodeData = null;
let connectionStatus = 'disconnected';

// IRIS - Respostas Inteligentes da InsightEsfera
const irisResponses = {
  greeting: [
    'Olá! 💜 Eu sou a Iris, assistente virtual da InsightEsfera.',
    'Oi! Sou a Iris da InsightEsfera! Como posso ajudar você hoje?',
    'Bem-vindo(a)! Iris aqui, pronta para ajudar com soluções em dados!'
  ],
  services: `📊 *Nossos Serviços Principais:*

• *Business Intelligence & Analytics*
  Dashboards interativos, KPIs em tempo real

• *Data Science & Machine Learning*
  Modelos preditivos, análise avançada

• *Automação com IA*
  Processos inteligentes, redução de custos

• *ETL & Data Engineering*
  Pipelines robustos, integração de dados

• *Cloud Solutions (GCP/AWS)*
  Arquiteturas escaláveis, migração segura

💡 Qual área te interessa mais?`,

  pricing: `💎 *Valores e Planos:*

• Consultoria: A partir de R$ 5.000/mês
• Projetos personalizados sob demanda
• Diagnóstico inicial GRATUITO
• ROI médio de 300% em 6 meses

📞 Agendar reunião? Digite "agendar"`,

  contact: `📞 *Entre em Contato:*

📧 contato@insightesfera.io
🌐 insightesfera.io
📱 WhatsApp: (11) 91647-4087
💼 LinkedIn: /company/insightesfera

Prefere que eu agende um horário?`,

  about: `🏢 *Sobre a InsightEsfera:*

Somos especialistas em transformar dados em decisões estratégicas, com:
• 16+ anos de experiência
• 50+ projetos entregues
• Equipe certificada Google Cloud
• Metodologia ágil comprovada

🎯 Nossa missão: Democratizar o acesso a dados inteligentes!`,

  tech: `🔧 *Stack Tecnológico:*

• Python, R, SQL
• TensorFlow, Scikit-learn
• Spark, Airflow, DBT
• BigQuery, Databricks
• Power BI, Looker, Tableau
• Docker, Kubernetes

Tudo isso aplicado ao SEU negócio!`,

  cases: `🏆 *Casos de Sucesso:*

• *Varejo:* +45% eficiência operacional
• *Logística:* -30% custos com IA
• *Educação:* 2M+ alunos impactados
• *Saúde:* 80% redução tempo análise

Quer conhecer cases do seu setor?`,

  appointment: `📅 *Vamos Agendar!*

Escolha a melhor opção:
1️⃣ Diagnóstico Gratuito (30min)
2️⃣ Consultoria Inicial (1h)
3️⃣ Workshop Personalizado

Envie o número da opção desejada!`,

  default: `Ótima pergunta! 🤔

Para uma resposta mais precisa, escolha:
1️⃣ Serviços e soluções
2️⃣ Valores e investimento
3️⃣ Casos de sucesso
4️⃣ Agendar reunião
5️⃣ Falar com consultor

Ou pergunte diretamente!`
};

// Função inteligente para processar mensagens
function processIrisMessage(text) {
  const lowerText = text.toLowerCase();

  // Saudações
  if (lowerText.match(/^(oi|olá|ola|hey|boa|bom dia|boa tarde|boa noite)/)) {
    const greetings = irisResponses.greeting;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Serviços
  if (lowerText.includes('serviço') || lowerText.includes('fazem') ||
      lowerText.includes('oferecem') || lowerText.includes('soluç')) {
    return irisResponses.services;
  }

  // Preços
  if (lowerText.includes('preço') || lowerText.includes('valor') ||
      lowerText.includes('custa') || lowerText.includes('investimento')) {
    return irisResponses.pricing;
  }

  // Contato
  if (lowerText.includes('contato') || lowerText.includes('telefone') ||
      lowerText.includes('email') || lowerText.includes('whats')) {
    return irisResponses.contact;
  }

  // Sobre
  if (lowerText.includes('empresa') || lowerText.includes('insightesfera') ||
      lowerText.includes('sobre') || lowerText.includes('quem')) {
    return irisResponses.about;
  }

  // Tecnologia
  if (lowerText.includes('tecnolog') || lowerText.includes('python') ||
      lowerText.includes('ferramenta') || lowerText.includes('stack')) {
    return irisResponses.tech;
  }

  // Cases
  if (lowerText.includes('case') || lowerText.includes('sucesso') ||
      lowerText.includes('cliente') || lowerText.includes('resultado')) {
    return irisResponses.cases;
  }

  // Agendamento
  if (lowerText.includes('agenda') || lowerText.includes('reunião') ||
      lowerText.includes('marcar') || lowerText.includes('horário')) {
    return irisResponses.appointment;
  }

  // Respostas numeradas
  if (lowerText === '1' || lowerText.includes('serviço')) {
    return irisResponses.services;
  }
  if (lowerText === '2' || lowerText.includes('valor')) {
    return irisResponses.pricing;
  }
  if (lowerText === '3' || lowerText.includes('caso')) {
    return irisResponses.cases;
  }
  if (lowerText === '4' || lowerText.includes('agenda')) {
    return irisResponses.appointment;
  }
  if (lowerText === '5' || lowerText.includes('consultor')) {
    return irisResponses.contact;
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
        connectionStatus = 'qr_ready';
      }

      if (connection === 'close') {
        connectionStatus = 'disconnected';
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          setTimeout(connectWhatsApp, 5000);
        }
      } else if (connection === 'open') {
        console.log('WhatsApp conectado!');
        qrCodeData = null;
        connectionStatus = 'connected';
      }
    });

    sock.ev.on('creds.update', saveCreds);

    // Processar mensagens recebidas
    sock.ev.on('messages.upsert', async (m) => {
      const msg = m.messages[0];
      if (!msg.key.fromMe && msg.message) {
        const from = msg.key.remoteJid;
        const text = msg.message.conversation ||
                    msg.message.extendedTextMessage?.text || '';

        if (text) {
          console.log(`Mensagem de ${from}: ${text}`);

          // Responder com Iris
          const response = processIrisMessage(text);
          await sock.sendMessage(from, { text: `${response}` });
          console.log(`Iris respondeu`);
        }
      }
    });

  } catch (error) {
    console.error('Erro ao conectar:', error);
    connectionStatus = 'error';
    setTimeout(connectWhatsApp, 5000);
  }
}

// Página principal com interface completa
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EsferaZap - Iris AI Assistant</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .header {
            background: rgba(255,255,255,0.98);
            padding: 20px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
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
            gap: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .status-badge {
            padding: 10px 20px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .status-badge.connected { background: #10b981; color: white; }
        .status-badge.disconnected { background: #ef4444; color: white; }
        .status-badge.connecting { background: #f59e0b; color: white; }
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .hero {
            text-align: center;
            color: white;
            padding: 60px 20px;
        }
        .hero h1 {
            font-size: 48px;
            margin-bottom: 20px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .hero p {
            font-size: 20px;
            opacity: 0.95;
            max-width: 600px;
            margin: 0 auto 30px;
        }
        .phone-badge {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            border: 2px solid rgba(255,255,255,0.3);
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        .card {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .card h2 {
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 22px;
        }
        .qr-container {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            min-height: 280px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .chat-container {
            height: 400px;
            background: #f8f9fa;
            border-radius: 15px;
            padding: 20px;
            overflow-y: auto;
            border: 1px solid #e9ecef;
        }
        .message {
            margin-bottom: 15px;
            padding: 12px 16px;
            border-radius: 15px;
            max-width: 80%;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .message.sent {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin-left: auto;
            text-align: right;
        }
        .message.received {
            background: white;
            border: 1px solid #e9ecef;
        }
        .input-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        input {
            flex: 1;
            padding: 14px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 15px;
            transition: all 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-box {
            background: linear-gradient(135deg, #f3f4f6 0%, #fff 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        .stat-value {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .stat-label {
            font-size: 12px;
            color: #6b7280;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .pulse {
            display: inline-block;
            width: 10px;
            height: 10px;
            background: currentColor;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 currentColor; }
            50% { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        .test-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 20px;
        }
        .test-btn {
            padding: 10px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: left;
            font-size: 14px;
        }
        .test-btn:hover {
            background: #e9ecef;
            border-color: #667eea;
            transform: translateX(5px);
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo">
                <span style="font-size: 32px;">💜</span>
                <span>EsferaZap - Iris AI</span>
            </div>
            <div id="status" class="status-badge disconnected">
                <span class="pulse"></span>
                <span>Desconectado</span>
            </div>
        </div>
    </div>

    <div class="hero">
        <h1>Assistente IA para WhatsApp Business</h1>
        <p>Iris - Powered by InsightEsfera | Transformando dados em decisões inteligentes</p>
        <div class="phone-badge">📱 (11) 91647-4087</div>
    </div>

    <div class="container">
        <div class="grid">
            <div class="card">
                <h2><span>📱</span>Conexão WhatsApp</h2>
                <div id="qrcode" class="qr-container">
                    <div>
                        <div style="font-size: 60px; margin-bottom: 20px;">📲</div>
                        <p style="color: #6b7280;">Conectando ao WhatsApp...</p>
                        <p style="color: #9ca3af; font-size: 14px; margin-top: 10px;">
                            Aguarde o QR Code aparecer
                        </p>
                    </div>
                </div>
                <button onclick="checkConnection()" style="width: 100%; margin-top: 20px;">
                    🔄 Atualizar Conexão
                </button>
            </div>

            <div class="card">
                <h2><span>💬</span>Chat de Teste</h2>
                <div id="chat" class="chat-container">
                    <div class="message received">
                        💜 Olá! Eu sou a Iris, assistente da InsightEsfera. Como posso ajudar?
                    </div>
                </div>
                <div class="input-group">
                    <input type="text" id="message" placeholder="Digite sua mensagem..."
                           onkeypress="if(event.key==='Enter') sendTestMessage()">
                    <button onclick="sendTestMessage()">Enviar</button>
                </div>
                <div class="test-buttons">
                    <button class="test-btn" onclick="quickMessage('Oi')">
                        👋 Saudação
                    </button>
                    <button class="test-btn" onclick="quickMessage('Quais serviços vocês oferecem?')">
                        📊 Serviços
                    </button>
                    <button class="test-btn" onclick="quickMessage('Quanto custa?')">
                        💰 Preços
                    </button>
                    <button class="test-btn" onclick="quickMessage('Casos de sucesso')">
                        🏆 Cases
                    </button>
                </div>
            </div>

            <div class="card">
                <h2><span>📊</span>Estatísticas</h2>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-value" id="msgCount">0</div>
                        <div class="stat-label">Mensagens</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">0.8s</div>
                        <div class="stat-label">Tempo Resposta</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value" id="sessionCount">0</div>
                        <div class="stat-label">Sessões</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">✅</div>
                        <div class="stat-label">IA Online</div>
                    </div>
                </div>
                <button onclick="sendWhatsAppTest()" style="width: 100%;">
                    📤 Enviar Teste Real
                </button>
                <input type="tel" id="testNumber" placeholder="Número WhatsApp (5511999999999)"
                       style="width: 100%; margin-top: 10px;">
            </div>

            <div class="card">
                <h2><span>🚀</span>Recursos</h2>
                <div style="display: grid; gap: 15px;">
                    <div style="padding: 15px; background: #f8f9fa; border-radius: 10px;">
                        <strong>🤖 IA Avançada</strong>
                        <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">
                            Respostas contextuais inteligentes
                        </p>
                    </div>
                    <div style="padding: 15px; background: #f8f9fa; border-radius: 10px;">
                        <strong>⚡ Alta Performance</strong>
                        <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">
                            Resposta em menos de 1 segundo
                        </p>
                    </div>
                    <div style="padding: 15px; background: #f8f9fa; border-radius: 10px;">
                        <strong>📈 Escalável</strong>
                        <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">
                            Cloud Run auto-scaling
                        </p>
                    </div>
                    <div style="padding: 15px; background: #f8f9fa; border-radius: 10px;">
                        <strong>🔒 Seguro</strong>
                        <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">
                            LGPD compliant, criptografia E2E
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let messageCount = 0;
        let sessionCount = 0;

        async function checkConnection() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();

                updateStatus(data.status);

                if (data.qr) {
                    document.getElementById('qrcode').innerHTML =
                        '<img src="' + data.qr + '" alt="QR Code" style="max-width: 100%; border-radius: 10px;">';
                } else if (data.status === 'connected') {
                    document.getElementById('qrcode').innerHTML =
                        '<div><div style="font-size: 60px; margin-bottom: 20px;">✅</div>' +
                        '<p style="color: #10b981; font-weight: bold;">WhatsApp Conectado!</p>' +
                        '<p style="color: #6b7280; font-size: 14px; margin-top: 10px;">Pronto para receber mensagens</p></div>';
                }
            } catch (error) {
                console.error('Erro:', error);
            }
        }

        function updateStatus(status) {
            const statusEl = document.getElementById('status');
            statusEl.className = 'status-badge ' + status;

            const statusText = {
                'connected': '✅ Conectado',
                'disconnected': '❌ Desconectado',
                'qr_ready': '📲 QR Code Pronto',
                'connecting': '⏳ Conectando...'
            };

            statusEl.innerHTML = '<span class="pulse"></span><span>' +
                                (statusText[status] || 'Desconhecido') + '</span>';
        }

        function sendTestMessage() {
            const input = document.getElementById('message');
            const message = input.value.trim();

            if (!message) return;

            addMessage(message, 'sent');
            input.value = '';

            // Simular resposta da Iris
            setTimeout(() => {
                fetch('/api/iris', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                })
                .then(r => r.json())
                .then(data => {
                    addMessage(data.response, 'received');
                });
            }, 500);

            messageCount++;
            document.getElementById('msgCount').textContent = messageCount;
        }

        function quickMessage(text) {
            document.getElementById('message').value = text;
            sendTestMessage();
        }

        function addMessage(text, type) {
            const chat = document.getElementById('chat');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + type;
            messageDiv.innerHTML = type === 'received' ? '💜 ' + text : text;
            chat.appendChild(messageDiv);
            chat.scrollTop = chat.scrollHeight;
        }

        async function sendWhatsAppTest() {
            const number = document.getElementById('testNumber').value;
            if (!number) {
                alert('Digite um número de WhatsApp válido');
                return;
            }

            try {
                const response = await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        number: number,
                        message: '💜 Teste EsferaZap - Iris AI Assistant\\n\\nOlá! Esta é uma mensagem de teste.'
                    })
                });

                const data = await response.json();
                if (data.success) {
                    alert('Mensagem enviada com sucesso!');
                    sessionCount++;
                    document.getElementById('sessionCount').textContent = sessionCount;
                } else {
                    alert('Erro: ' + (data.error || 'Falha ao enviar'));
                }
            } catch (error) {
                alert('Erro ao enviar mensagem');
            }
        }

        // Auto-check connection
        window.onload = () => {
            checkConnection();
            setInterval(checkConnection, 5000);
        };
    </script>
</body>
</html>
  `);
});

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: connectionStatus,
    qr: qrCodeData,
    connected: connectionStatus === 'connected'
  });
});

app.post('/api/iris', (req, res) => {
  const { message } = req.body;
  const response = processIrisMessage(message || '');
  res.json({ response });
});

app.post('/api/send', async (req, res) => {
  const { number, message } = req.body;

  if (!sock || connectionStatus !== 'connected') {
    return res.status(400).json({
      success: false,
      error: 'WhatsApp não conectado'
    });
  }

  try {
    const jid = number.includes('@s.whatsapp.net')
      ? number
      : `${number}@s.whatsapp.net`;

    await sock.sendMessage(jid, { text: message });
    res.json({ success: true, message: 'Mensagem enviada' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check para Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'esferazap-mvp',
    timestamp: new Date().toISOString(),
    whatsapp: connectionStatus
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EsferaZap rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);

  // Iniciar conexão WhatsApp após 2 segundos
  setTimeout(() => {
    console.log('Iniciando conexão WhatsApp...');
    connectWhatsApp();
  }, 2000);
});