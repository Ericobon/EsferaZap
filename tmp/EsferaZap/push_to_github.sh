#!/bin/bash

# Script para fazer push do EsferaZap para GitHub
# Execute este script manualmente no terminal

cd /tmp/EsferaZap

echo "🔄 Configurando Git..."
git config user.name "EsferaZap User"
git config user.email "user@esferazap.com"

echo "📝 Fazendo commit..."
git commit -m "Initial commit - EsferaZap SaaS WhatsApp Chatbot Platform

✅ Complete multi-tenant SaaS platform for WhatsApp chatbots with AI integration
✅ React frontend with TypeScript and Tailwind CSS  
✅ Express.js backend with Firebase authentication
✅ WhatsApp integration via Baileys library
✅ Drizzle ORM with PostgreSQL support
✅ Demo mode enabled for development without Firebase credentials
✅ Comprehensive UI components with shadcn/ui
✅ Real-time messaging and bot management dashboard"

echo "🚀 Fazendo push para GitHub..."
git push origin main

echo "✅ Push concluído! Verifique seu repositório GitHub."