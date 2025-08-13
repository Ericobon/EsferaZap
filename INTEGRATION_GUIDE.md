# Guia de Integração EsferaZap ↔ InsightEsfera

## Status Atual da Integração

### ✅ IMPLEMENTADO
- **Design Unificado**: Interface idêntica ao site InsightEsfera
- **Firebase Compartilhado**: Mesmo projeto (login-ee5ed)
- **Autenticação Visual**: Login/cadastro com glassmorphism como o site principal
- **Branding Completo**: Logo, cores e tipografia da InsightEsfera
- **Cross-Platform Component**: Widget de integração na landing page

### 🔄 EM PROGRESSO
- **Firebase Server Auth**: Aguardando credenciais FIREBASE_PRIVATE_KEY e FIREBASE_CLIENT_EMAIL

### 🎯 PRÓXIMOS PASSOS PARA INTEGRAÇÃO COMPLETA

## 1. Obtenção das Credenciais do Firebase

### Passo a Passo:
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Selecione o projeto **"login-ee5ed"**
3. Vá em **Configurações** → **Contas de serviço**
4. Clique em **"Gerar nova chave privada"**
5. Baixe o arquivo JSON

### Configuração no EsferaZap:
```bash
# Do arquivo JSON baixado, extraia:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@login-ee5ed.iam.gserviceaccount.com"
```

## 2. Integração no Site Principal InsightEsfera

### Adicionar Botão de Acesso ao EsferaZap:

```html
<!-- No header do site InsightEsfera -->
<a href="https://seu-esferazap.replit.app?from=insightesfera&token={USER_TOKEN}" 
   class="btn-esferazap">
  EsferaZap - WhatsApp AI
</a>
```

### Autenticação Automática:
```javascript
// Quando usuário clicar para acessar EsferaZap
function accessEsferaZap() {
  const userToken = firebase.auth().currentUser?.accessToken;
  const esferaZapUrl = `https://seu-esferazap.replit.app?from=insightesfera&token=${userToken}`;
  window.open(esferaZapUrl, '_blank');
}
```

## 3. Single Sign-On (SSO) Bidirecional

### No EsferaZap (já implementado):
- Detecta parâmetro `?from=insightesfera&token=xxx`
- Valida token automaticamente
- Faz login sem solicitar credenciais

### No InsightEsfera (a implementar):
- Redireciona para EsferaZap passando token de autenticação
- Recebe retorno com dados do usuário sincronizados

## 4. Sincronização de Dados

### Estrutura de Dados Compartilhada:
```typescript
interface SharedUser {
  uid: string;           // Firebase UID
  email: string;         // Email do usuário
  name: string;          // Nome completo
  company?: string;      // Empresa
  insightEsferaData: {   // Dados específicos do site principal
    subscription: string;
    dashboards: string[];
  };
  esferaZapData: {       // Dados específicos do EsferaZap
    bots: string[];
    whatsappSessions: string[];
  };
}
```

## 5. Configuração de Domínio

### Opção 1: Subdomínio
- `esferazap.insightesfera.io` → redirecionamento para Replit

### Opção 2: Integração Iframe
```html
<!-- Dentro do site InsightEsfera -->
<iframe src="https://seu-esferazap.replit.app/embed" 
        width="100%" height="600px" frameborder="0">
</iframe>
```

## 6. Deploy e Produção

### Configuração do Replit Deployment:
1. Configure variáveis de ambiente
2. Configure domínio customizado
3. Configure HTTPS e SSL

### Checklist Final:
- [ ] Firebase Server Auth configurado
- [ ] Botão no site InsightEsfera adicionado
- [ ] SSO testado e funcionando
- [ ] Dados sincronizando entre plataformas
- [ ] Domínio personalizado configurado
- [ ] SSL/HTTPS ativo

## 7. Como Testar a Integração

### Teste Local:
1. Acesse o EsferaZap com: `?from=insightesfera&token=test123`
2. Verifique se a integração é detectada
3. Teste login automático

### Teste de Produção:
1. Faça login no site InsightEsfera
2. Clique no botão EsferaZap
3. Deve abrir EsferaZap já logado
4. Dados devem estar sincronizados

## Suporte Técnico

Para dúvidas ou problemas:
- **Firebase**: Verifique console.firebase.google.com
- **Logs do EsferaZap**: Disponíveis no console do Replit
- **Teste de Conexão**: Use o componente CrossPlatformAuth na landing page

---

**🎯 Resultado Final**: Usuários poderão navegar entre InsightEsfera e EsferaZap sem refazer login, com dados sincronizados e experiência unificada.