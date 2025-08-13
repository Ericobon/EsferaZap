#!/bin/bash

echo "🔗 Configuração Rápida GitHub - EsferaZap"
echo ""

# Solicita username do GitHub
read -p "Digite seu username do GitHub: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Username não pode ser vazio"
    exit 1
fi

echo ""
echo "🚀 Configurando repositório remoto..."

# Remove origin existente se houver
git remote remove origin 2>/dev/null || true

# Adiciona novo origin
git remote add origin "https://github.com/$GITHUB_USER/esferazap.git"

echo "✅ Remote configurado: https://github.com/$GITHUB_USER/esferazap"
echo ""
echo "📋 Próximos passos:"
echo "1. Crie o repositório 'esferazap' no GitHub"
echo "2. Execute: git push -u origin main"
echo ""
echo "🔗 URL do repositório: https://github.com/$GITHUB_USER/esferazap"