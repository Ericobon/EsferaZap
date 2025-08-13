# 🚀 Deploy EsferaZap na Vercel com Subdomínio

## Pré-requisitos
- Conta na Vercel (vercel.com)
- Domínio principal (ex: insightesfera.io)
- Código do EsferaZap no GitHub

## 📋 Passo a Passo

### 1. Preparar o Projeto para Vercel

Primeiro, criar arquivo de configuração da Vercel:

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/index.html",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Configurar Variáveis de Ambiente

Na dashboard da Vercel, adicionar:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN` 
- `FIREBASE_PROJECT_ID`
- `DATABASE_URL` (se usando PostgreSQL)
- `OPENAI_API_KEY` (opcional)

### 3. Deploy Inicial

1. **Conectar Repositório**:
   - Acesse vercel.com/dashboard
   - Clique "New Project"
   - Conecte com GitHub: `Ericobon/EsferaZap`

2. **Configurar Build**:
   - Framework: `Other`
   - Build Command: `npm run build`
   - Output Directory: `client/dist`

### 4. Configurar Subdomínio

#### Opção A: Subdomínio da Vercel (Grátis)
- URL automática: `esferazap.vercel.app`
- Ou personalizada: `esferazap-insightesfera.vercel.app`

#### Opção B: Subdomínio Personalizado
Para `esferazap.insightesfera.io`:

1. **Na Dashboard Vercel**:
   - Projeto > Settings > Domains
   - Add Domain: `esferazap.insightesfera.io`

2. **Configurar DNS** (no provedor do domínio):
   ```
   Tipo: CNAME
   Nome: esferazap
   Valor: cname.vercel-dns.com
   ```

3. **Verificação**:
   - Aguardar propagação DNS (5-60 min)
   - Vercel configurará SSL automático

## 🔧 Scripts de Build Necessários

Adicionar ao `package.json`:

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && tsc",
    "start": "node server/dist/index.js"
  }
}
```

## 📊 Exemplo de URL Final

Após configuração completa:
- **Produção**: https://esferazap.insightesfera.io
- **Staging**: https://esferazap-staging.vercel.app

## ✅ Verificação

Testar após deploy:
- [ ] Landing page carrega
- [ ] Login/registro funciona
- [ ] Dashboard acessível
- [ ] WhatsApp QR Code funciona
- [ ] SSL certificado ativo

## 🎯 Próximos Passos

1. Deploy inicial na Vercel
2. Configurar subdomínio DNS
3. Testar funcionalidades
4. Configurar domínio staging para testes