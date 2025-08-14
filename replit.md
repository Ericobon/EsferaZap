# Overview

EsferaZap is a WhatsApp Business automation platform that enables users to create AI-powered chatbots for WhatsApp conversations. The system provides a comprehensive dashboard for managing bots, monitoring conversations, and analyzing performance metrics. Users can configure chatbots with custom prompts, integrate with OpenAI's GPT models, and track analytics across multiple WhatsApp Business accounts.

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