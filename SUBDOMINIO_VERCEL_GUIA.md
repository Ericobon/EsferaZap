# 🌐 Como Criar Subdomínio para EsferaZap na Vercel

## 🎯 Objetivo Final
Configurar `esferazap.insightesfera.io` (ou outro subdomínio de sua escolha)

## 📋 Passo a Passo Completo

### 1. Deploy Inicial na Vercel

1. **Acesse vercel.com** e faça login
2. **Clique "New Project"**
3. **Conecte com GitHub**:
   - Selecione repositório: `Ericobon/EsferaZap`
   - Clique "Import"

4. **Configurações de Deploy**:
   ```
   Framework Preset: Other
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Variáveis de Ambiente** (Settings > Environment Variables):
   ```
   FIREBASE_API_KEY=sua_api_key_aqui
   FIREBASE_AUTH_DOMAIN=login-ee5ed.firebaseapp.com
   FIREBASE_PROJECT_ID=login-ee5ed
   NODE_ENV=production
   ```

6. **Deploy**: Clique "Deploy"

### 2. Configurar Subdomínio Personalizado

#### Opção A: Subdomínio Grátis da Vercel
- URL automática: `esferazap.vercel.app`
- Pronto para usar imediatamente

#### Opção B: Subdomínio no Seu Domínio (Recomendado)

**Na Dashboard Vercel:**
1. Vá para seu projeto EsferaZap
2. Clique **Settings** > **Domains**
3. Clique **"Add Domain"**
4. Digite: `esferazap.insightesfera.io`
5. Clique **"Add"**

**Configurar DNS** (no provedor do domínio):
```
Tipo: CNAME
Nome: esferazap
Valor: cname.vercel-dns.com
TTL: 1 hora (ou Automático)
```

### 3. Exemplos por Provedor de DNS

#### Registro.br / Locaweb
```
Tipo de Registro: CNAME
Host: esferazap
Aponta para: cname.vercel-dns.com
```

#### Cloudflare
```
Type: CNAME
Name: esferazap
Target: cname.vercel-dns.com
Proxy Status: DNS only (nuvem cinza)
```

#### Google Domains
```
Resource Record Type: CNAME
Name: esferazap
Data: cname.vercel-dns.com
TTL: 1h
```

### 4. Verificação e Testes

**Aguardar Propagação** (5-60 minutos)
- Vercel mostrará checkmark verde quando configurado
- Certificado SSL será configurado automaticamente

**Testar Funcionalidades:**
```bash
# Teste básico
curl https://esferazap.insightesfera.io

# Teste API
curl https://esferazap.insightesfera.io/api/health
```

### 5. Configurações Avançadas

#### Redirect do Domínio Principal (Opcional)
Se quiser redirecionar `insightesfera.io/esferazap` para o subdomínio:

```javascript
// Em seu site principal
if (window.location.pathname === '/esferazap') {
  window.location.href = 'https://esferazap.insightesfera.io';
}
```

#### Variáveis de Ambiente de Produção
```
DATABASE_URL=postgresql://... (se usando PostgreSQL)
OPENAI_API_KEY=sk-... (para IA dos bots)
FIREBASE_PRIVATE_KEY=... (para funcionalidades avançadas)
FIREBASE_CLIENT_EMAIL=... (para funcionalidades avançadas)
```

## 🎉 Resultado Final

Após configuração completa:
- **Produção**: https://esferazap.insightesfera.io
- **Painel**: https://vercel.com/dashboard
- **SSL**: Certificado automático
- **Performance**: CDN global da Vercel

## ⚡ Comandos Rápidos

```bash
# Ver status do deploy
npx vercel --prod

# Fazer novo deploy
git push origin main

# Ver logs
npx vercel logs https://esferazap.insightesfera.io
```

## 🔧 Troubleshooting

**Domínio não verifica:**
- Aguardar até 48h para propagação DNS
- Verificar se CNAME está correto: `cname.vercel-dns.com`
- Não incluir `http://` ou `https://` na configuração DNS

**App não carrega:**
- Verificar variáveis de ambiente
- Checar logs na dashboard Vercel
- Confirmar se build passou sem erros

**Firebase não conecta:**
- Verificar se API keys estão corretas
- Confirmar domínio autorizado no Firebase Console

## 📞 Suporte

Se tiver problemas:
1. Verificar dashboard Vercel para erros
2. Consultar logs de build e runtime
3. Testar localmente com `npm run build`

Tempo estimado total: **15-30 minutos** + tempo de propagação DNS