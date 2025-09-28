#!/bin/bash

# Script para configurar o projeto GCP para EsferaZap MVP

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Configurando EsferaZap MVP no Google Cloud Platform${NC}"

# Verificar se gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI não está instalado. Por favor, instale primeiro.${NC}"
    exit 1
fi

# Solicitar informações do projeto
read -p "Digite o ID do projeto GCP: " PROJECT_ID
read -p "Digite a região (default: us-central1): " REGION
REGION=${REGION:-us-central1}

# Configurar projeto
echo -e "${YELLOW}📋 Configurando projeto ${PROJECT_ID}...${NC}"
gcloud config set project ${PROJECT_ID}

# Habilitar APIs necessárias
echo -e "${YELLOW}🔧 Habilitando APIs necessárias...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    storage.googleapis.com \
    firebase.googleapis.com

# Criar bucket do Cloud Storage para mídia
BUCKET_NAME="${PROJECT_ID}-esferazap-media"
echo -e "${YELLOW}📦 Criando bucket ${BUCKET_NAME}...${NC}"
gsutil mb -p ${PROJECT_ID} -l ${REGION} gs://${BUCKET_NAME}/ || true

# Criar instância Cloud SQL
echo -e "${YELLOW}🗄️ Criando instância Cloud SQL PostgreSQL...${NC}"
DB_INSTANCE_NAME="esferazap-db"
gcloud sql instances create ${DB_INSTANCE_NAME} \
    --database-version=POSTGRES_15 \
    --cpu=1 \
    --memory=3840MB \
    --region=${REGION} \
    --network=default \
    --no-assign-ip || true

# Criar database
echo -e "${YELLOW}📊 Criando database...${NC}"
gcloud sql databases create esferazap \
    --instance=${DB_INSTANCE_NAME} || true

# Criar usuário do banco
DB_USER="esferazap_user"
read -s -p "Digite a senha para o usuário do banco: " DB_PASSWORD
echo ""
gcloud sql users create ${DB_USER} \
    --instance=${DB_INSTANCE_NAME} \
    --password=${DB_PASSWORD} || true

# Criar Service Account para o backend
echo -e "${YELLOW}👤 Criando Service Account...${NC}"
SERVICE_ACCOUNT_NAME="esferazap-backend"
gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
    --display-name="EsferaZap Backend Service Account" || true

# Conceder permissões necessárias
echo -e "${YELLOW}🔐 Configurando permissões IAM...${NC}"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Criar secrets no Secret Manager
echo -e "${YELLOW}🔑 Configurando secrets...${NC}"

# Database URL
CONNECTION_NAME=$(gcloud sql instances describe ${DB_INSTANCE_NAME} --format="value(connectionName)")
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost/esferazap?host=/cloudsql/${CONNECTION_NAME}"
echo -n "${DATABASE_URL}" | gcloud secrets create esferazap-db-url --data-file=- || \
    echo -n "${DATABASE_URL}" | gcloud secrets versions add esferazap-db-url --data-file=-

# Session Secret
SESSION_SECRET=$(openssl rand -base64 32)
echo -n "${SESSION_SECRET}" | gcloud secrets create session-secret --data-file=- || \
    echo -n "${SESSION_SECRET}" | gcloud secrets versions add session-secret --data-file=-

# Gemini API Key
read -s -p "Digite sua Gemini API Key: " GEMINI_KEY
echo ""
echo -n "${GEMINI_KEY}" | gcloud secrets create gemini-api-key --data-file=- || \
    echo -n "${GEMINI_KEY}" | gcloud secrets versions add gemini-api-key --data-file=-

# Configurar Cloud Build trigger
echo -e "${YELLOW}🔄 Configurando Cloud Build trigger...${NC}"
gcloud builds triggers create github \
    --repo-name=EsferaZap \
    --repo-owner=Ericobon \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml \
    --name="esferazap-deploy-trigger" || true

# Criar arquivo de configuração local
echo -e "${YELLOW}📝 Criando arquivo de configuração local...${NC}"
cat > .env.production <<EOF
PROJECT_ID=${PROJECT_ID}
REGION=${REGION}
DB_INSTANCE_NAME=${DB_INSTANCE_NAME}
BUCKET_NAME=${BUCKET_NAME}
SERVICE_ACCOUNT=${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com
DATABASE_CONNECTION_NAME=${CONNECTION_NAME}
EOF

echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo -e "${YELLOW}📌 Próximos passos:${NC}"
echo "1. Faça o build e deploy inicial:"
echo "   ./scripts/deploy.sh"
echo "2. Configure o Firebase Hosting para o frontend:"
echo "   cd client && npm run build && firebase deploy"
echo "3. Atualize as variáveis de ambiente no Cloud Run Console se necessário"