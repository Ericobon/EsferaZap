# EsferaZap by InsightEsfera

![EsferaZap Logo](https://img.shields.io/badge/EsferaZap-AI%20WhatsApp%20SaaS-1F4E79?style=for-the-badge&logo=whatsapp&logoColor=white)
![InsightEsfera](https://img.shields.io/badge/by-InsightEsfera-F39C12?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iI0YzOUMxMiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IiNGMzlDMTIiLz4KPC9zdmc+)

**Plataforma SaaS multi-tenant para chatbots WhatsApp com Inteligência Artificial**, integrada ao ecossistema InsightEsfera de soluções de dados. Transforme dados em conversas inteligentes com nossa tecnologia de ponta.

## 🚀 Características Principais

- **Multi-tenant SaaS**: Suporte para múltiplos usuários e organizações
- **Integração WhatsApp**: Conexão direta via protocolo WhatsApp Web (Baileys)
- **IA Integrada**: Suporte para OpenAI GPT e Google Gemini
- **Dashboard Completo**: Interface moderna para gerenciar bots e conversas
- **Autenticação Segura**: Sistema de autenticação via Firebase
- **QR Code**: Conexão simples ao WhatsApp via QR code
- **Tempo Real**: Processamento de mensagens em tempo real

## 🛠 Tecnologias Utilizadas

### Frontend
- **React** com TypeScript
- **Vite** como build tool
- **Tailwind CSS** + shadcn/ui para styling
- **TanStack React Query** para gerenciamento de estado do servidor
- **Wouter** para roteamento
- **Firebase Auth** para autenticação

### Backend
- **Node.js** com Express.js
- **TypeScript** com ES modules
- **Drizzle ORM** com PostgreSQL
- **Firebase Admin SDK** para verificação de tokens
- **Baileys** para integração WhatsApp
- **WebSocket** para comunicação em tempo real

### Banco de Dados
- **PostgreSQL** (Neon serverless)
- **Fallback in-memory** para desenvolvimento

## 🏗 Arquitetura

```
EsferaZap/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilitários e configurações
├── server/              # Backend Express
│   ├── services/        # Serviços (WhatsApp, Firebase, IA)
│   ├── middleware/      # Middlewares de autenticação
│   └── routes.ts        # Rotas da API
├── shared/              # Tipos e schemas compartilhados
└── package.json         # Dependências do projeto
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn
- Conta Firebase (opcional para desenvolvimento)
- Banco PostgreSQL (opcional para desenvolvimento)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/esferazap.git
cd esferazap
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
# Firebase (opcional)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id

# Servidor
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Database (opcional)
DATABASE_URL=your_postgresql_url
```

4. Execute a aplicação:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

## 🔧 Modo de Desenvolvimento

O projeto inclui um modo de desenvolvimento que funciona sem configurações Firebase ou PostgreSQL:

- **Autenticação**: Usa usuário demo automático
- **Banco de Dados**: Armazenamento em memória
- **WhatsApp**: Simulação para testes

## 📱 Funcionalidades

### Autenticação
- Login/registro de usuários
- Gerenciamento de perfil
- Autenticação multi-tenant

### Gerenciamento de Bots
- Criar e configurar chatbots
- Definir instruções personalizadas
- Escolher provedor de IA (OpenAI/Gemini)
- Monitorar status de conexão

### WhatsApp Integration
- Gerar QR codes para conexão
- Gerenciar sessões ativas
- Processar mensagens em tempo real
- Histórico de conversas

### Dashboard
- Estatísticas de uso
- Gerenciamento de bots
- Monitoramento de conversas
- Interface responsiva

## 🔒 Segurança

- Autenticação JWT via Firebase
- Validação de dados com Zod
- Middleware de autenticação
- Separação de dados por tenant
- Exclusão de dados sensíveis do Git

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato:
- Email: suporte@esferazap.com
- Issues: [GitHub Issues](https://github.com/seu-usuario/esferazap/issues)

---

Desenvolvido com ❤️ para revolucionar a comunicação via WhatsApp