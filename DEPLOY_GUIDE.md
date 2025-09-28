# 🚀 Guia de Deploy EsferaZap MVP na GCP

## Arquitetura do MVP

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│ Firebase        │────▶│  Cloud Run       │────▶│ Cloud SQL       │
│ Hosting         │     │  (Backend)       │     │ PostgreSQL      │
│ (React Frontend)│     │  Express + Baileys│     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │ Cloud Storage    │
                        │ (Media & Sessions)│
                        └──────────────────┘
```

## Pré-requisitos

1. **Conta GCP** com billing ativo
2. **gcloud CLI** instalado e configurado
3. **Firebase CLI** instalado (`npm install -g firebase-tools`)
4. **Docker** instalado localmente
5. **Node.js 20+** e npm

## Passo a Passo

### 1️⃣ Configuração Inicial do GCP

```bash
# Executar script de setup (criará todos recursos necessários)
cd /home/ericobon/insightesfera/esferazap-mvp
./scripts/setup-gcp.sh

# Seguir os prompts:
# - Informar PROJECT_ID do GCP
# - Informar região (recomendado: us-central1)
# - Criar senha para banco de dados
# - Informar Gemini API Key
```

### 2️⃣ Build e Deploy do Backend

```bash
# Configurar Docker para GCR
gcloud auth configure-docker

# Deploy do backend
./scripts/deploy.sh

# Anotar a URL do Cloud Run que será exibida
# Exemplo: https://esferazap-backend-xxxxx-uc.a.run.app
```

### 3️⃣ Configurar e Deploy do Frontend

```bash
# Atualizar URL do backend no frontend
cd client
# Editar .env.production com a URL do Cloud Run
vim .env.production  # Atualizar VITE_API_URL

# Instalar dependências
npm install

# Build de produção
npm run build

# Login no Firebase
firebase login --no-localhost

# Deploy no Firebase Hosting
firebase deploy --only hosting

# URL do frontend será exibida
# Exemplo: https://login-ee5ed.web.app
```

### 4️⃣ Configuração Final

#### Atualizar CORS no Backend

1. Acessar [Cloud Run Console](https://console.cloud.google.com/run)
2. Clicar em `esferazap-backend`
3. Editar variáveis de ambiente:
   - `FRONTEND_URL`: URL do Firebase Hosting
   - `CORS_ORIGIN`: URL do Firebase Hosting

#### Configurar Custom Domain (Opcional)

Para usar `app.insightesfera.com`:

1. No Firebase Hosting Console:
   - Add custom domain → `app.insightesfera.com`
   - Seguir instruções DNS

2. No Cloud Run Console:
   - Manage custom domains → Add
   - `api.insightesfera.com` para o backend

### 5️⃣ Testar o MVP

1. **Acessar Frontend**: https://login-ee5ed.web.app
2. **Criar conta** ou fazer login
3. **Criar um bot** WhatsApp
4. **Escanear QR Code** com WhatsApp
5. **Testar chat** enviando mensagem

## 🔧 Troubleshooting

### Erro de CORS
```bash
# Verificar variáveis no Cloud Run
gcloud run services describe esferazap-backend --region=us-central1
```

### Banco não conecta
```bash
# Verificar conexão Cloud SQL
gcloud sql instances describe esferazap-db
# Verificar se Cloud SQL Admin API está habilitada
```

### QR Code não aparece
```bash
# Verificar logs do Cloud Run
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=esferazap-backend" --limit 50
```

### WhatsApp desconecta
- Sessões são salvas no Cloud Storage
- Verificar permissões do bucket
- Aumentar memória do Cloud Run se necessário

## 📊 Monitoramento

### Cloud Run Metrics
```bash
# Ver métricas de uso
gcloud monitoring metrics-descriptors list --filter="metric.type=run.googleapis.com*"
```

### Logs
```bash
# Backend logs
gcloud logging read "resource.type=cloud_run_revision" --limit 20

# Cloud SQL logs  
gcloud logging read "resource.type=cloudsql_database" --limit 20
```

## 💰 Estimativa de Custos (MVP)

- **Cloud Run**: ~$10-30/mês (1-2 instâncias)
- **Cloud SQL**: ~$15-25/mês (db-f1-micro)
- **Cloud Storage**: ~$1-5/mês (mídia)
- **Firebase Hosting**: Gratuito (10GB/mês)
- **Total estimado**: ~$30-60/mês

## 🔐 Segurança

### Checklist de Segurança
- ✅ Secrets no Secret Manager
- ✅ Service Account com permissões mínimas
- ✅ HTTPS em todos endpoints
- ✅ Autenticação Firebase
- ✅ CORS configurado
- ✅ Rate limiting no Cloud Run

### Backup do Banco
```bash
# Criar backup manual
gcloud sql backups create --instance=esferazap-db

# Configurar backup automático
gcloud sql instances patch esferazap-db --backup-start-time=03:00
```

## 📈 Próximos Passos (Pós-MVP)

1. **Implementar CI/CD**: GitHub Actions → Cloud Build
2. **Adicionar Cloud CDN** para assets estáticos
3. **Configurar Cloud Armor** para proteção DDoS
4. **Implementar Cloud Tasks** para filas de mensagens
5. **Adicionar Cloud Monitoring** dashboards
6. **Migrar para Cloud SQL HA** para alta disponibilidade

## 🆘 Suporte

- **Documentação GCP**: https://cloud.google.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Baileys Issues**: https://github.com/WhiskeySockets/Baileys

---

**Desenvolvido por InsightEsfera** 🚀