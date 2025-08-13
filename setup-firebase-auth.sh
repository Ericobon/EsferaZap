#!/bin/bash

echo "🔧 Configurando Firebase Auth para desenvolvimento local..."

# Deploy das regras do Firestore
echo "📝 Aplicando regras do Firestore..."
firebase deploy --only firestore:rules

# Deploy dos índices do Firestore
echo "📊 Aplicando índices do Firestore..."
firebase deploy --only firestore:indexes

echo "✅ Configuração concluída!"
echo ""
echo "📱 Para testar a autenticação localmente:"
echo "1. Acesse http://localhost:5173"
echo "2. Crie uma conta com qualquer email"
echo "3. O Firebase Auth funcionará com o domínio login-ee5ed.firebaseapp.com"
echo ""
echo "⚠️  IMPORTANTE: Para autenticação 100% local, você precisa:"
echo "   - Adicionar 'localhost' em https://console.firebase.google.com/project/login-ee5ed/authentication/settings"
echo "   - OU usar o Firebase Emulator (requer Java)"