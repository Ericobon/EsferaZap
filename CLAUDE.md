# CLAUDE.md - EsferaZap (WhatsApp Business SaaS)

## 🤖 Contexto para Assistentes IA

Este documento fornece contexto essencial para assistentes de IA trabalhando no projeto EsferaZap.

## 📋 Visão Geral do Projeto

**EsferaZap** é uma plataforma SaaS de automação para WhatsApp Business, parte do ecossistema InsightEsfera.

### Informações Principais
- **URL Produção:** app.insightesfera.com
- **Tipo:** SaaS Multi-tenant para WhatsApp Business
- **Stack Principal:** Node.js, React, PostgreSQL, Redis
- **Integração:** WhatsApp Business API, OpenAI/Gemini

## 🏗️ Arquitetura

### Estrutura de Pastas
```
esferazap/
├── frontend/          # React + TypeScript
├── backend/           # Node.js + Express
├── database/          # Migrations e seeds
├── credentials/       # Credenciais (não committar!)
├── docker/           # Configurações Docker
├── nginx/            # Configurações proxy
└── scripts/          # Scripts de automação
```

### Componentes Principais
- **Frontend:** Dashboard React para gestão de conversas
- **Backend:** API REST para integração WhatsApp
- **Bot Engine:** Sistema de processamento de mensagens com IA
- **Queue System:** Redis para processamento assíncrono
- **Database:** PostgreSQL com pgvector para embeddings

## 🔑 Configuração de Ambiente

### Firebase Configuration (Frontend)
**Arquivo:** `client/.env.local`
```bash
# Firebase - Projeto InsightEsfera (login-ee5ed)
VITE_FIREBASE_API_KEY=AIzaSyDrZCmU8SRDlcpTUyZLsZJLPUGMQBKYFkU
VITE_FIREBASE_AUTH_DOMAIN=login-ee5ed.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=login-ee5ed
VITE_FIREBASE_STORAGE_BUCKET=login-ee5ed.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=758485377489
VITE_FIREBASE_APP_ID=1:758485377489:web:c4220355f73a31e15900f0
VITE_FIREBASE_MEASUREMENT_ID=G-TBR5WL76DX
```

### Variáveis Essenciais (.env)
```bash
# Firebase Server
FIREBASE_PROJECT_ID=login-ee5ed
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@login-ee5ed.iam.gserviceaccount.com

# WhatsApp Business
WHATSAPP_API_URL=
WHATSAPP_TOKEN=
WHATSAPP_VERIFY_TOKEN=

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/esferazap

# Redis
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=

# App Config
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## 💻 Desenvolvimento Local

### Setup Inicial
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# Database
npm run migrate
npm run seed
```

### Docker Development
```bash
docker-compose up -d
```

## 🚀 Deploy

### Firebase Configuration
```bash
# Firebase CLI Login
firebase login --no-localhost

# Projeto Firebase
Project ID: silent-text-458716-c9
Admin: admin@insightesfera.io

# Comandos Deploy
firebase deploy                     # Deploy completo
firebase deploy --only hosting      # Deploy hosting
firebase deploy --only functions    # Deploy functions
firebase serve                      # Teste local
```

### Subdomínio Configuration
- **Produção:** app.insightesfera.com
- **Staging:** staging-app.insightesfera.com
- **Development:** localhost:3000 (API), localhost:5173 (Frontend)

### CI/CD Pipeline
1. Push para branch `main` triggera deploy automático
2. Testes automatizados rodam antes do deploy
3. Deploy para staging primeiro, depois produção
4. Firebase Hosting atualiza automaticamente

## 🔧 Funcionalidades Principais

### Core Features
- ✅ Conexão multi-números WhatsApp
- ✅ Chatbot com IA configurável
- ✅ Dashboard de conversas em tempo real
- ✅ Gestão de contatos e grupos
- ✅ Campanhas e broadcasts
- ✅ Analytics e relatórios
- ✅ Webhooks e integrações

### Em Desenvolvimento
- 🚧 Integração com CRM
- 🚧 Sistema de templates avançado
- 🚧 Voice messages com transcrição
- 🚧 Multi-idiomas

## 🔐 Segurança

### Práticas Obrigatórias
1. **NUNCA** commitar credenciais ou tokens
2. **SEMPRE** usar HTTPS em produção
3. **SEMPRE** validar e sanitizar inputs
4. **SEMPRE** usar rate limiting nas APIs
5. **SEMPRE** criptografar dados sensíveis

### Compliance
- LGPD compliance para dados brasileiros
- WhatsApp Business Policy compliance
- Criptografia end-to-end mantida

## 📊 Monitoramento

### Métricas Importantes
- Response time < 2s
- Message delivery rate > 95%
- Uptime > 99.9%
- Error rate < 0.1%

### Ferramentas
- Logs: estruturados em JSON
- APM: monitoramento de performance
- Alerts: Notificações para falhas críticas

## 🧪 Testes

### Executar Testes
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Coverage Mínimo
- Unit tests: 80%
- Integration: 60%
- E2E: Fluxos críticos

## 📝 Convenções de Código

### Backend (Node.js)
```javascript
// Use async/await sempre
async function processMessage(message) {
  try {
    // Validação primeiro
    if (!message.text) throw new Error('Message text required');
    
    // Processamento
    const result = await aiService.process(message);
    
    // Logging estruturado
    logger.info('Message processed', { 
      messageId: message.id,
      duration: Date.now() - startTime 
    });
    
    return result;
  } catch (error) {
    logger.error('Error processing message', { error, messageId: message.id });
    throw error;
  }
}
```

### Frontend (React/TypeScript)
```typescript
// Componentes funcionais com TypeScript
interface MessageProps {
  text: string;
  timestamp: Date;
  sender: 'user' | 'bot';
}

const Message: React.FC<MessageProps> = ({ text, timestamp, sender }) => {
  // Hooks no topo
  const [isRead, setIsRead] = useState(false);
  
  // Effects organizados
  useEffect(() => {
    // Marcar como lido após 2s
    const timer = setTimeout(() => setIsRead(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`message ${sender}`}>
      {/* JSX limpo e legível */}
    </div>
  );
};
```

## 🤝 Integração com Site Principal

### Comunicação entre Domínios
- Site (insightesfera.com) → App (app.insightesfera.com)
- Usar PostMessage API para comunicação segura
- SSO compartilhado via JWT

### Recursos Compartilhados
- Design System unificado
- Autenticação centralizada
- Analytics consolidado

## 🆘 Troubleshooting

### Problemas Comuns
1. **WhatsApp não conecta:** Verificar token e webhook URL
2. **Mensagens não enviadas:** Checar rate limits e saldo
3. **Dashboard lento:** Verificar queries N+1 e índices DB

## 📚 Recursos

### Documentação Externa
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Contato Suporte
- **Email:** claudecode2@ticto.com.br
- **Equipe:** InsightEsfera Dev Team

---

*Última atualização: 2025-01-13*  
*Projeto: EsferaZap - WhatsApp Business SaaS*  
*Empresa: InsightEsfera*