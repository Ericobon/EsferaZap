# 🔗 Configuração GitHub - EsferaZap

## Status Atual
✅ Git inicializado  
✅ Commit realizado  
❌ Repositório remoto não configurado  

## Próximos Passos

### 1. Criar Repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `esferazap`
4. Descrição: `SaaS Multi-Tenant de Chatbots WhatsApp com IA - Integrado ao Ecossistema InsightEsfera`
5. Deixe público ou privado (sua escolha)
6. **NÃO** marque "Initialize with README" (já temos)
7. Clique "Create repository"

### 2. Conectar Repositório Local
Após criar o repositório, execute no terminal:

```bash
# Substitua SEU_USUARIO pelo seu username GitHub
git remote add origin https://github.com/SEU_USUARIO/esferazap.git

# Fazer push inicial
git push -u origin main
```

### 3. Exemplo Completo
```bash
# Se seu username for "joao123":
git remote add origin https://github.com/joao123/esferazap.git
git push -u origin main
```

### 4. Se der erro de autenticação
```bash
# Configure suas credenciais Git
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Para HTTPS, será solicitado login/senha ou token
# Para SSH, configure chave SSH no GitHub
```

## Alternativa: GitHub CLI
Se tiver GitHub CLI instalado:
```bash
gh repo create esferazap --public --source=. --remote=origin --push
```

## URLs Finais
Após configuração, seu repositório estará em:
- **GitHub**: `https://github.com/SEU_USUARIO/esferazap`
- **Clone URL**: `https://github.com/SEU_USUARIO/esferazap.git`

## Deploy Automático
Após push, configure deploy em:
- **Vercel**: Conecte repositório GitHub
- **Netlify**: Conecte repositório GitHub  
- **Replit**: Use botão Deploy após conectar Git