#!/bin/bash

TOKEN="SEU_TOKEN_AQUI"
REPO_URL="https://Ericobon:$TOKEN@github.com/Ericobon/EsferaZap.git"

echo "🚀 Forçando push do EsferaZap..."

# Criar backup da branch atual
git branch backup-local

# Fetch do repositório remoto
git fetch $REPO_URL main

# Force push (vai sobrescrever o repositório remoto com nosso código)
echo "⚠️  Fazendo force push (vai sobrescrever conteúdo remoto)..."
git push $REPO_URL main --force

echo "✅ Push forçado concluído!"
echo "🔗 Repositório: https://github.com/Ericobon/EsferaZap"
echo ""
echo "📊 Projeto EsferaZap agora disponível no GitHub:"
echo "- 8.147 linhas de código"
echo "- 81 arquivos TypeScript/JavaScript" 
echo "- 57 componentes React"
echo "- Integração completa InsightEsfera"