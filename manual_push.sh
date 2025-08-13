#!/bin/bash

# EsferaZap - Push Manual para GitHub
echo "🚀 EsferaZap - Push para https://github.com/Ericobon/EsferaZap"
echo ""

# Remove locks do git se existirem
echo "🧹 Limpando locks do Git..."
rm -f .git/index.lock .git/config.lock

# Verifica e remove remote existente
echo "🔧 Configurando remote..."
git remote remove origin 2>/dev/null || true

# Adiciona o remote correto
git remote add origin https://github.com/Ericobon/EsferaZap.git

# Verifica status
echo "📊 Status do repositório:"
git status --short

# Faz o push
echo ""
echo "⬆️ Fazendo push para GitHub..."
git push -u origin main

echo ""
echo "✅ Push concluído!"
echo "🔗 Repositório: https://github.com/Ericobon/EsferaZap"