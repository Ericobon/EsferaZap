# 📱 Como Conectar a Iris ao WhatsApp - GUIA RÁPIDO

## 🚀 3 Métodos para Testar AGORA

### Método 1: Link Direto (MAIS FÁCIL) ✅

1. **Abra o arquivo**: `iris-whatsapp.html`
2. **Digite seu número** com DDD (ex: 11999999999)
3. **Clique em "Gerar Link WhatsApp"**
4. **Clique no botão verde** que aparece
5. **WhatsApp abre** com a Iris pronta para conversar!

**Mensagens prontas para testar:**
- Clique nos botões de teste
- Cada um envia uma pergunta diferente
- WhatsApp abre automaticamente

### Método 2: Número Comercial da InsightEsfera 📞

**Para teste real com número da empresa:**

```javascript
// Número oficial (adicionar quando disponível)
const numeroInsightEsfera = "5511XXXXXXXXX";

// Link direto:
https://wa.me/5511XXXXXXXXX
```

### Método 3: Bot Automatizado (Produção) 🤖

Para conectar a Iris como bot automático:

1. **Evolution API** (Recomendado)
```bash
# Instalar Evolution API
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  evolutionapi/evolution-api:latest

# Conectar WhatsApp
curl -X POST http://localhost:8080/instance/create \
  -H "Content-Type: application/json" \
  -d '{"instanceName": "iris-insightesfera"}'
```

2. **Baileys (Alternativa Gratuita)**
```javascript
// Arquivo: iris-bot.js
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function connectIris() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_iris');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('messages.upsert', async (msg) => {
        const message = msg.messages[0];
        if (!message.message) return;

        const from = message.key.remoteJid;
        const text = message.message.conversation;

        // Responder com Iris
        const irisResponse = getIrisResponse(text);
        await sock.sendMessage(from, { text: irisResponse });
    });

    sock.ev.on('connection.update', (update) => {
        if (update.qr) {
            console.log('QR Code:', update.qr);
        }
    });
}

function getIrisResponse(message) {
    // Adicionar lógica da Iris aqui
    return "💜 Iris: " + processMessage(message);
}

connectIris();
```

## 🎯 Teste Rápido Agora:

### Opção A: Sem Código (Manual)
1. Abra `iris-whatsapp.html` no navegador
2. Digite seu número
3. Use os botões de teste
4. WhatsApp abre com a mensagem

### Opção B: Link Direto
```
https://wa.me/55SEU_NUMERO?text=Oi%20Iris
```

### Opção C: QR Code
1. Abra `iris-whatsapp.html`
2. Clique em "Gerar QR Code"
3. Escaneie com WhatsApp

## 💬 Mensagens para Testar:

```
"Oi"
"Quais serviços vocês oferecem?"
"Quanto custa?"
"Vocês trabalham com Python?"
"Quero agendar uma reunião"
"Me fale sobre BI"
"Casos de sucesso"
```

## 🔧 Para Produção (Terça-feira):

1. **Contratar número Business**
   - WhatsApp Business API
   - Twilio ou MessageBird

2. **Configurar Webhook**
```javascript
app.post('/webhook', (req, res) => {
    const { from, message } = req.body;
    const irisResponse = processIrisMessage(message);
    sendWhatsAppMessage(from, irisResponse);
    res.status(200).send('OK');
});
```

3. **Deploy no Cloud Run**
   - Já configurado!
   - CI/CD pronto no GitHub

## ✅ Checklist para Demo:

- [ ] Abrir `iris-whatsapp.html`
- [ ] Digitar número do cliente
- [ ] Mostrar mensagens automáticas
- [ ] Demonstrar respostas da Iris
- [ ] Explicar integração com dados

**PRONTO PARA APRESENTAR!** 🚀