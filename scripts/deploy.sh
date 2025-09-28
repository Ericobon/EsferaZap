#!/bin/bash

# Script para deploy manual do EsferaZap no Cloud Run

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Iniciando deploy do EsferaZap Backend${NC}"

# Carregar configurações
if [ -f .env.production ]; then
    export $(cat .env.production | xargs)
else
    echo "❌ Arquivo .env.production não encontrado. Execute setup-gcp.sh primeiro."
    exit 1
fi

# Build da imagem Docker
echo -e "${YELLOW}🔨 Construindo imagem Docker...${NC}"
docker build -t gcr.io/${PROJECT_ID}/esferazap-backend:latest .

# Push para Container Registry
echo -e "${YELLOW}📤 Enviando imagem para Container Registry...${NC}"
docker push gcr.io/${PROJECT_ID}/esferazap-backend:latest

# Deploy no Cloud Run
echo -e "${YELLOW}☁️ Fazendo deploy no Cloud Run...${NC}"
gcloud run deploy esferazap-backend \
    --image gcr.io/${PROJECT_ID}/esferazap-backend:latest \
    --platform managed \
    --region ${REGION} \
    --port 8080 \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 10 \
    --min-instances 1 \
    --set-env-vars="NODE_ENV=production,GCS_BUCKET_NAME=${BUCKET_NAME}" \
    --set-secrets="DATABASE_URL=esferazap-db-url:latest,GEMINI_API_KEY=gemini-api-key:latest,SESSION_SECRET=session-secret:latest" \
    --add-cloudsql-instances ${PROJECT_ID}:${REGION}:${DB_INSTANCE_NAME} \
    --service-account ${SERVICE_ACCOUNT}

# Obter URL do serviço
SERVICE_URL=$(gcloud run services describe esferazap-backend --region ${REGION} --format 'value(status.url)')

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "🌐 Backend URL: ${SERVICE_URL}"
echo ""
echo -e "${YELLOW}📌 Próximos passos:${NC}"
echo "1. Atualize o FRONTEND_URL no Cloud Run com a URL do Firebase Hosting"
echo "2. Configure o frontend para usar a URL do backend: ${SERVICE_URL}"
echo "3. Teste a conexão WhatsApp acessando o frontend"