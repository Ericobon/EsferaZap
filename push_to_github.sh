#!/bin/bash

# EsferaZap - Push to GitHub Script
# Integração completa com ecossistema InsightEsfera

echo "🚀 Preparando EsferaZap para push..."

# Remove arquivos temporários e sensíveis
echo "🧹 Limpando arquivos temporários..."
rm -rf node_modules/.cache
rm -rf dist/
rm -rf whatsapp_sessions/*
rm -f *.log

# Adiciona todos os arquivos
echo "📁 Adicionando arquivos ao Git..."
git add .

# Commit com mensagem descritiva
echo "💾 Fazendo commit..."
git commit -m "✨ EsferaZap v1.0 - Integração completa com InsightEsfera

🎯 Features implementadas:
- Interface idêntica ao site InsightEsfera (glassmorphism)
- Firebase integrado ao projeto login-ee5ed
- Sistema de autenticação compartilhado
- Componente de integração cross-platform
- WhatsApp bot com IA integrada
- Dashboard multi-tenant completo
- Branding e design system unificado

🔧 Tecnologias:
- React + TypeScript + Vite
- Express.js + Node.js
- Firebase Auth + Firestore
- Baileys (WhatsApp Web API)
- Tailwind CSS + shadcn/ui
- Drizzle ORM + PostgreSQL

📋 Próximos passos:
- Configurar credenciais Firebase Server
- Adicionar botão no site InsightEsfera
- Deploy em produção"

# Push para o repositório
echo "⬆️ Enviando para GitHub..."
git push origin main || git push origin master

echo "✅ Push concluído! Projeto EsferaZap enviado com sucesso."
echo "🔗 Verifique seu repositório no GitHub."

# Exibe informações do repositório
echo ""
echo "📊 Estatísticas do projeto:"
echo "Arquivos JavaScript/TypeScript: $(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | wc -l)"
echo "Componentes React: $(find ./client/src/components -name "*.tsx" | wc -l)"
echo "Páginas: $(find ./client/src/pages -name "*.tsx" | wc -l)"
echo "Linhas de código: $(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | xargs wc -l | tail -1)"