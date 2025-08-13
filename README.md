# EsferaZap 🌐⚡

**Plataforma SaaS de Automação WhatsApp Business com IA**

[![InsightEsfera](https://img.shields.io/badge/InsightEsfera-Ecosystem-teal)](https://app.insightesfera.com)
[![Status](https://img.shields.io/badge/Status-Development-yellow)](http://localhost:5173)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)

## 🚀 Quick Start

```bash
# Clone e instale
git clone [repo-url] && cd esferazap
npm install

# Configure ambiente
cp client/.env.example client/.env.local

# Execute
npm run dev        # Backend (porta 5000)
npx vite          # Frontend (porta 5173)
```

Acesse: http://localhost:5173

## 🎯 Visão Geral

EsferaZap é uma plataforma SaaS multi-tenant que revoluciona o atendimento via WhatsApp, combinando **IA avançada**, **automação inteligente** e **analytics em tempo real**.

🌐 **Dev:** http://localhost:5173 | **Prod:** https://app.insightesfera.com

### ✨ Features Principais

- 🤖 **Chatbots IA**: Integração com OpenAI GPT e Google Gemini
- 📱 **WhatsApp Business**: Conexão via QR Code usando Baileys
- 👥 **Multi-Tenant**: Suporte a múltiplas empresas e usuários
- 📊 **Dashboard Analytics**: Métricas e insights em tempo real
- 🔐 **Auth Unificada**: Integração com Firebase da InsightEsfera
- 🎨 **Design System**: Interface idêntica ao site InsightEsfera
- 🌐 **Cross-Platform**: Integração completa com ecossistema

## 🚀 Integração InsightEsfera

### Design Unificado
- ✅ Interface glassmorphism idêntica ao site principal
- ✅ Logo animado da esfera com gradientes teal/laranja
- ✅ Tipografia e cores do brand guide InsightEsfera
- ✅ Componentes responsivos e acessíveis

### Autenticação Compartilhada
- ✅ Firebase projeto `login-ee5ed`
- ✅ Single Sign-On (SSO) bidirecional
- ✅ Sincronização de dados de usuário
- ✅ Login automático entre plataformas

### Tecnologias

#### Frontend
- **React 18** + TypeScript + Vite
- **Tailwind CSS** + shadcn/ui
- **TanStack Query** para estado do servidor
- **Wouter** para roteamento
- **Firebase Auth** para autenticação

#### Backend
- **Node.js** + Express + TypeScript
- **Drizzle ORM** + PostgreSQL
- **Firebase Admin** para verificação de tokens
- **Baileys** para WhatsApp Web API
- **WebSocket** para comunicação real-time

## 📦 Instalação

### Pré-requisitos
```bash
Node.js 18+
npm ou yarn
PostgreSQL (opcional - usa fallback em memória)
```

### Configuração
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/esferazap.git
cd esferazap

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

#### Frontend (client/.env.local)
```env
# Firebase Configuration - Projeto InsightEsfera
VITE_FIREBASE_API_KEY=AIzaSyDrZCmU8SRDlcpTUyZLsZJLPUGMQBKYFkU
VITE_FIREBASE_AUTH_DOMAIN=login-ee5ed.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=login-ee5ed
VITE_FIREBASE_STORAGE_BUCKET=login-ee5ed.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=758485377489
VITE_FIREBASE_APP_ID=1:758485377489:web:c4220355f73a31e15900f0
VITE_FIREBASE_MEASUREMENT_ID=G-TBR5WL76DX
```

#### Backend (.env)
```env
# Firebase Server (recomendado)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@login-ee5ed.iam.gserviceaccount.com
FIREBASE_PROJECT_ID=login-ee5ed

# Database (opcional)
DATABASE_URL=postgresql://user:pass@localhost:5432/esferazap
```

## 🛠️ Configuração Firebase

### Setup Automático
O projeto já está configurado com as credenciais do Firebase da InsightEsfera. Para desenvolvimento local:

1. **Frontend**: Crie o arquivo `client/.env.local` com as variáveis mostradas acima
2. **Backend**: Configure as variáveis no arquivo `.env` principal

### Modo Demo vs Produção
- **Sem configuração**: Aplicação roda em "modo demo" com usuário fictício
- **Com configuração**: Autenticação real integrada ao ecossistema InsightEsfera

### Como Obter Credenciais (se necessário)
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Selecione projeto **"login-ee5ed"**
3. Configurações → Configurações do projeto → Geral
4. Role até "Seus aplicativos" → "Config SDK"
5. Para server auth: Contas de serviço → Gerar nova chave privada

### Verificação da Configuração
```bash
# Inicie o frontend
npx vite

# Verifique no console do navegador:
# ✅ "Firebase client initialized successfully with InsightEsfera project: login-ee5ed"
# ❌ "Firebase configuration not available - running in demo mode"
```

## 🏗️ Arquitetura

```
esferazap/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilitários e configurações
├── server/              # Backend Express
│   ├── middleware/      # Middlewares de autenticação
│   ├── services/        # Serviços (Firebase, WhatsApp)
│   └── routes.ts        # Rotas da API
├── shared/              # Tipos e schemas compartilhados
└── whatsapp_sessions/   # Sessões WhatsApp (gitignored)
```

## 🔗 Integração com Site Principal

### Adicionar ao InsightEsfera
```html
<!-- Botão no header do site -->
<a href="https://esferazap.insightesfera.io?from=insightesfera&token={USER_TOKEN}" 
   class="btn-esferazap">
  EsferaZap - WhatsApp AI
</a>
```

### Autenticação Automática
```javascript
// Redirect com token para login automático
function accessEsferaZap() {
  const userToken = firebase.auth().currentUser?.accessToken;
  window.open(`https://esferazap.insightesfera.io?from=insightesfera&token=${userToken}`);
}
```

## 📱 Funcionalidades

### Dashboard
- 📊 Estatísticas de bots e conversas
- 🤖 Gerenciamento de chatbots
- 📱 Conexões WhatsApp via QR Code
- 👥 Usuários e permissões

### Chatbot IA
- 🧠 Integração OpenAI GPT / Google Gemini
- 💬 Processamento de linguagem natural
- 📋 Instruções personalizáveis
- 🔄 Respostas automáticas

### WhatsApp Integration
- 📲 Conexão via QR Code
- 💬 Envio/recebimento de mensagens
- 👥 Grupos e contatos
- 📎 Suporte a mídia

## 🚀 Deploy

### Replit (Recomendado)
```bash
# O projeto já está configurado para Replit
# Basta fazer push e usar o botão Deploy
```

### Vercel/Netlify
```bash
# Build frontend
npm run build

# Deploy backend separadamente
# Configure variáveis de ambiente
```

### Docker
```dockerfile
# Dockerfile já configurado
docker build -t esferazap .
docker run -p 3000:3000 esferazap
```

## 📋 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run type-check   # Verificação de tipos
npm run lint         # Linting do código
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch: `git checkout -b feature/nova-feature`
3. Commit mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte do ecossistema InsightEsfera. Todos os direitos reservados.

## 🆘 Suporte

- 📧 Email: admin@insightesfera.io
- 📱 WhatsApp: +55 11 91647-4807
- 🌐 Site: [insightesfera.io](https://www.insightesfera.io)

## 🔄 Changelog

### v1.0.0 (Agosto 2025)
- ✨ Integração completa com InsightEsfera
- 🎨 Interface redesenhada com glassmorphism
- 🔐 Autenticação Firebase compartilhada
- 🤖 Chatbots IA implementados
- 📱 WhatsApp Business integrado
- 📊 Dashboard analytics funcional

---

**Desenvolvido com ❤️ pela equipe InsightEsfera**

[![InsightEsfera](https://img.shields.io/badge/Powered%20by-InsightEsfera-teal?style=for-the-badge)](https://www.insightesfera.io)