# Overview

EsferaZap is a comprehensive WhatsApp Business automation platform that enables users to create AI-powered chatbots for WhatsApp conversations. The system provides a comprehensive dashboard for managing bots, monitoring conversations, and analyzing performance metrics. Users can configure chatbots with custom prompts, integrate with AI models (Google Gemini), and track analytics across multiple WhatsApp Business accounts.

## Recent Updates (August 2025)

**Migração para Evolution API (Latest - August 17, 2025)**
- Sistema totalmente migrado de Baileys para Evolution API como provider padrão do WhatsApp
- Atualizado schema do banco para usar 'evolution_api' como provider padrão em novos bots
- Modificado WhatsAppProvider factory para priorizar Evolution API sobre outros providers
- Atualizado componente QRCode Display para mostrar "Evolution API" em vez de "Baileys"
- Configuração automática de webhook URLs para Evolution API como padrão
- Sistema de fallback: providers desconhecidos agora usam Evolution API

**Interface de Conversação Modernizada (August 17, 2025)**
- Implementada interface de chat completa baseada em design de customer support dashboard
- Layout de 3 colunas: lista de conversas + chat principal + painel de detalhes do contato
- Funcionalidades: busca de conversas, status de mensagens (enviado/entregue/lido), timestamps
- Avatar personalizado, indicadores online/offline, botões de ação (telefone, favoritar, arquivar)
- Input de mensagem com suporte a anexos e emojis, envio via Enter
- Painel lateral com informações detalhadas do contato, tags e ações rápidas
- Design responsivo e profissional seguindo padrões modernos de UI/UX

**QR Code Real com Baileys Backend Integrado (August 16, 2025)**
- Implementado sistema completo de QR Code real conectado ao backend Baileys
- Criado BaileysSimpleProvider para geração de QR Code PNG de alta qualidade
- Adicionadas rotas API: POST /api/bots/:id/connect-whatsapp e GET /api/bots/:id/whatsapp-status
- Frontend atualizado para usar API real com polling de status e timer visual
- Sistema automático: bot criado → Baileys conecta → QR gerado → conexão detectada
- Fluxo completo funcional de criação até conexão WhatsApp simulada

**Automatic Server URL Generation & Chatbot Focus (August 16, 2025)**
- Implemented automatic server URL generation system that detects Replit environment
- Created URLGeneratorService to automatically generate webhook URLs and server endpoints
- All campaign features set to "Em Breve" status to focus on core chatbot functionality
- Enhanced chatbot interface with URL management and real-time testing capabilities
- Added comprehensive URL information panel showing generated webhook URLs for different providers
- System automatically detects environment (Replit/local/production) and generates appropriate URLs
- Simplified bot creation workflow with automatic URL configuration

**WhatsApp Provider Categorization System (August 16, 2025)**
- Implemented comprehensive categorization of WhatsApp APIs into two tiers:
  - **Official/Paid APIs**: Meta Business API, Twilio WhatsApp, Evolution API
  - **Free/Personal APIs**: Baileys, WPPConnect, Venom Bot  
- Added `provider_tier` enum to database schema with automatic classification
- Created detailed comparison interface showing features, limitations, and use cases
- Enhanced QR Code demo with provider-specific categorization and visual indicators
- Added comprehensive provider information component with recommendations
- Updated database with migration to support new provider tier classification

**New Registration Interface**
- Complete redesign following modern Figma-based patterns with EsferaZap brand colors
- Multi-step registration form with personal info and company details
- Enhanced database schema with phone, company, and sector fields
- Integrated validation with real-time error feedback
- Professional step-by-step progress indicators
- Consistent gradient design from blue-600 to purple-600

**User Authentication Improvements**
- Modern login page with hero content and integrated auth form
- Logout functionality moved to user avatar dropdown menu (standard UX pattern)
- Removed API Keys section from settings as requested
- Enhanced user menu with profile information and secure logout

**Google Calendar Integration**
- Full Google Calendar OAuth integration for scheduling and availability management
- Calendar connection interface in Settings page with real-time status
- Automated business hours detection from calendar events
- Support for appointment reminders and scheduled messages via WhatsApp
- New calendar integration page with event management and connection controls

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application uses a modern React setup with TypeScript and Vite as the build tool. The UI is built with shadcn/ui components on top of Radix UI primitives, styled with Tailwind CSS. State management relies on TanStack Query for server state and React Hook Form for form handling. The application uses Wouter for client-side routing and implements a responsive design with mobile-first considerations.

## Backend Architecture
The server follows an Express.js architecture with TypeScript, implementing a RESTful API pattern. The application uses a modular approach with separate route handlers, services, and database layers. Authentication is handled through Replit's OIDC system with session-based storage. The server includes middleware for request logging, error handling, and authentication validation.

## Database Design
The system uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema includes core entities: users, bots, conversations, messages, analytics, and sessions. The database supports user management for Replit Auth, bot configuration with WhatsApp API credentials, conversation tracking, and analytics collection. Foreign key relationships maintain data integrity across all entities.

## Authentication System
Authentication is implemented using Replit's OpenID Connect (OIDC) system with Passport.js. The system maintains user sessions in PostgreSQL using connect-pg-simple for session storage. Protected routes require authentication middleware, and the frontend handles authentication state through React Query with automatic redirects for unauthorized access.

## External Service Integration
The platform integrates with multiple external services:
- **WhatsApp Business API**: For sending/receiving messages and webhook management
- **Google Gemini API**: For AI-powered response generation using Gemini-2.5-Flash and Gemini-2.5-Pro models
- **Neon Database**: PostgreSQL hosting with connection pooling
- **Replit Authentication**: For user management and session handling

The system includes service layers that abstract external API communications, error handling for service failures, and configuration management for API credentials.

# External Dependencies

## Core Technologies
- **React 18**: Frontend framework with TypeScript support
- **Express.js**: Backend web framework
- **PostgreSQL**: Primary database with Neon hosting
- **Drizzle ORM**: Type-safe database toolkit
- **TanStack Query**: Server state management
- **Tailwind CSS**: Utility-first CSS framework

## UI Components
- **shadcn/ui**: Pre-built component library
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library

## Authentication & Security
- **Replit Auth**: OIDC authentication provider
- **Passport.js**: Authentication middleware
- **express-session**: Session management

## External APIs
- **WhatsApp Business API**: Message handling and webhook integration
- **Google Gemini API**: AI response generation with Gemini-2.5-Flash and Gemini-2.5-Pro models
- **Neon Database**: Serverless PostgreSQL hosting

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Production bundling
- **Drizzle Kit**: Database migration management