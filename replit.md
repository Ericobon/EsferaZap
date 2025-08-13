# Overview

EsferaZap is a multi-tenant SaaS platform for creating and managing AI-powered WhatsApp chatbots, fully integrated with the InsightEsfera brand and ecosystem. The application enables users to create custom chatbots with AI integration, connect them to WhatsApp via QR codes, and manage conversations through a comprehensive dashboard. Built as a full-stack monorepo, it combines modern web technologies with WhatsApp automation and AI capabilities.

## Recent Changes (August 2025)
- **EsferaZap v2.0 Visual Identity**: New logo mixing WhatsApp green with InsightEsfera blue network design
- **Animated EsferaZap Logo**: Custom SVG logo with chat bubble, connection nodes, and orbital rings
- **WhatsApp Brand Integration**: Green color scheme (#25d366) integrated with InsightEsfera teal
- **Enhanced Landing Page**: Logo prominently featured with WhatsApp-focused messaging
- **Vercel Deploy Ready**: Configuration files and guides for production deployment
- **Custom CSS Gradients**: esferazap-gradient and whatsapp-gradient classes for brand consistency
- **InsightEsfera Brand Integration**: Complete visual redesign with InsightEsfera color scheme (teal #1F4E79, orange #F39C12)
- **Firebase Integration**: Configured to use InsightEsfera's Firebase project (login-ee5ed)
- **Full-Screen Authentication**: Login/signup interface identical to InsightEsfera website with glassmorphism effects
- **Cross-Platform Integration**: Component for seamless integration with main InsightEsfera website

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Firebase Auth for user authentication with custom hooks
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **Database**: Dual storage approach - Drizzle ORM configured for PostgreSQL with in-memory storage fallback
- **Authentication**: Firebase Admin SDK for token verification and user management
- **API Design**: RESTful endpoints with middleware-based authentication
- **Session Management**: JWT tokens from Firebase Auth

## Database Schema
- **Users**: Firebase UID mapping, profile information, company details
- **Bots**: Bot configurations, AI provider settings, connection status
- **WhatsApp Sessions**: QR codes, session management, connection states
- **Messages**: Conversation history with user/bot message tracking

## WhatsApp Integration
- **Library**: Baileys for WhatsApp Web protocol implementation
- **Connection Management**: QR code generation and session persistence
- **Message Handling**: Real-time message processing with status tracking
- **Session Storage**: File-based auth state management for WhatsApp connections

## AI Integration
- **Providers**: Configurable support for OpenAI and Google Gemini
- **Architecture**: Provider-agnostic interface for easy switching between AI services
- **Bot Instructions**: Custom prompt system for personalized bot behavior

## Development Environment
- **Monorepo Structure**: Shared types and schemas across frontend/backend
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Development Server**: Concurrent frontend (port 3000) and backend (port 4000) servers
- **Hot Reload**: Vite HMR for frontend, tsx for backend development

# External Dependencies

## Core Services
- **Firebase**: Authentication, Firestore database (configured but using fallback storage)
- **PostgreSQL**: Primary database through Neon serverless (configured via Drizzle)
- **WhatsApp**: Integration via Baileys library for WhatsApp Web protocol

## AI Services
- **OpenAI**: GPT models for conversational AI
- **Google Gemini**: Alternative AI provider option

## Development Tools
- **Replit**: Primary development and hosting platform
- **Vite**: Frontend build tool with React and TypeScript support
- **Drizzle**: Type-safe ORM with PostgreSQL dialect

## UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Headless UI components for accessibility

## Additional Libraries
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form handling with Zod validation
- **QRCode**: QR code generation for WhatsApp connections
- **date-fns**: Date manipulation and formatting