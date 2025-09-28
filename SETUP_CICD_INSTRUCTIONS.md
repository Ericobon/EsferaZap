# 🚀 Setup CI/CD GitHub → Cloud Run

## 📋 Pré-requisitos

### 1. Criar Service Account para Deploy

```bash
# No Cloud Console ou Terminal com permissões adequadas:

# Criar service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deploy" \
  --project=silent-text-458716-c9

# Adicionar permissões necessárias
gcloud projects add-iam-policy-binding silent-text-458716-c9 \
  --member="serviceAccount:github-actions@silent-text-458716-c9.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding silent-text-458716-c9 \
  --member="serviceAccount:github-actions@silent-text-458716-c9.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding silent-text-458716-c9 \
  --member="serviceAccount:github-actions@silent-text-458716-c9.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding silent-text-458716-c9 \
  --member="serviceAccount:github-actions@silent-text-458716-c9.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Gerar chave JSON
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@silent-text-458716-c9.iam.gserviceaccount.com
```

### 2. Criar Artifact Registry Repository

```bash
# Criar repositório para imagens Docker
gcloud artifacts repositories create esferazap-mvp \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker images for EsferaZap MVP" \
  --project=silent-text-458716-c9
```

## 🔐 Configurar Secrets no GitHub

No repositório GitHub (https://github.com/Ericobon/EsferaZap):

1. Vá para **Settings** → **Secrets and variables** → **Actions**

2. Adicione os seguintes secrets:

### Para Cloud Run:
- `GCP_SA_KEY`: Conteúdo completo do arquivo `key.json` gerado acima

### Para Firebase (opcional):
- `FIREBASE_SERVICE_ACCOUNT`: Service account JSON do Firebase
- `FIREBASE_API_KEY`: API Key do Firebase
- `FIREBASE_AUTH_DOMAIN`: Auth domain (ex: login-ee5ed.firebaseapp.com)
- `FIREBASE_PROJECT_ID`: Project ID (ex: login-ee5ed)
- `FIREBASE_STORAGE_BUCKET`: Storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Sender ID
- `FIREBASE_APP_ID`: App ID

## 🎯 Como Funciona

### Fluxo Automático:
1. **Push para main** → GitHub Actions inicia
2. **Build Docker image** → Cria imagem do container
3. **Push para Artifact Registry** → Armazena imagem no GCP
4. **Deploy no Cloud Run** → Atualiza serviço com nova versão
5. **Health check** → Verifica se deploy foi bem-sucedido

### URLs Resultantes:
- **Cloud Run**: https://esferazap-mvp-xxxxx-uc.a.run.app
- **Firebase** (opcional): https://login-ee5ed.web.app

## 🚦 Primeiro Deploy

### 1. Commitar os workflows:
```bash
cd /home/ericobon/insightesfera/esferazap-mvp
git add .github/
git commit -m "ci: Add GitHub Actions workflows for Cloud Run and Firebase deployment"
git push origin main
```

### 2. Monitorar no GitHub:
- Vá para a aba **Actions** no repositório
- Acompanhe o progresso do deploy
- Em ~5 minutos, seu app estará no ar!

## 🔧 Troubleshooting

### Erro de Permissão:
```bash
# Adicionar role adicional se necessário
gcloud projects add-iam-policy-binding silent-text-458716-c9 \
  --member="serviceAccount:github-actions@silent-text-458716-c9.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.editor"
```

### Erro de Artifact Registry:
```bash
# Verificar se o repositório existe
gcloud artifacts repositories list --location=us-central1
```

### Verificar Deploy:
```bash
# Listar serviços Cloud Run
gcloud run services list --platform=managed --region=us-central1

# Ver logs
gcloud run services logs read esferazap-mvp --region=us-central1
```

## ✅ Checklist Final

- [ ] Service Account criada com permissões
- [ ] Artifact Registry repository criado
- [ ] Secrets configurados no GitHub
- [ ] Workflows commitados
- [ ] Primeiro push feito
- [ ] Deploy verificado

## 🎉 Pronto!

Agora toda vez que você fizer push para a branch `main`, o deploy será automático!

---

**Nota**: Se não tiver acesso para criar service accounts, peça ao owner do projeto para executar os comandos da seção 1.