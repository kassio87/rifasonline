# Histórico de Desenvolvimento - RifasOnline

*Arquivo criado em: 30/04/2026*
*Atualizado em: 30/04/2026*

Este arquivo serve como memória persistente entre sessões. Leia este arquivo no início de cada sessão de trabalho para entender o que foi feito e onde paramos.

---

## 🔑 Credenciais e Links

**Repositório GitHub:** https://github.com/kassio87/rifasonline
**Branch principal:** master
**Comando para clonar:** `git clone https://github.com/kassio87/rifasonline.git`

**Comandos Git úteis:**
- `git status` - Verificar alterações
- `git add .` - Adicionar arquivos
- `git commit -m "mensagem"` - Fazer commit
- `git push origin master` - Enviar para GitHub
- `git pull origin master` - Baixar alterações

**Servidor de desenvolvimento:**
- Comando: `npm run dev`
- URL: http://localhost:3000 (ou 3001 se 3000 ocupado)

---

## 📋 Status Atual do Projeto

**Data da última atualização:** 30/04/2026
**Fase atual:** Fase 4 - Frontend e UI/UX (início)
**Tecnologias:** Next.js 14, React 18, Prisma, MySQL, WhatsApp Web JS, JWT

---

## ✅ O Que Já Foi Feito

### Fase 1: Arquitetura e Infraestrutura - **CONCLUÍDA**
- [x] Schema do MySQL definido (Prisma)
- [x] Estrutura de pastas Next.js criada
- [x] Conexão MySQL + Prisma configurada
- [x] Multi-tenancy implementado (middleware.js)
- [x] Install Wizard criado (página + APIs)
- [x] Migração inicial do banco executada

### Fase 2: Backend Core - **CONCLUÍDA (parcialmente)**
- [x] API de autenticação (JWT, login)
- [x] CRUD de Planos e Assinaturas
- [x] CRUD de Rifas e Números
- [x] Lógica de billing (planos recorrentes e fixos)
- [x] Lib de tenant implementada
- [ ] Lógica de fila FIFO para reservas (pendente validação)
- [ ] Relatórios de vendas (APIs existem, implementação incompleta)

### Fase 3: Integrações - **CONCLUÍDA (parcialmente)**
- [x] Integração WhatsApp (whatsapp-web.js, QR Code, sessões isoladas)
- [x] Parser de comandos do chatbot implementado
- [x] Geração de PIX (copia e cola)
- [ ] Integração PagSeguro (referenciada, estado incerto)
- [ ] Webhooks de pagamento (arquivos existem, não verificados)
- [ ] Notificações de pedidos (pendente)

### Fase 4: Frontend e UI/UX - **EM ANDAMENTO**
- [x] Design system criado (design-system.css, variáveis CSS)
- [x] Componentes base criados (Button, Card, Input, Sidebar)
- [ ] Login e recuperação de senha (usam dados mock)
- [ ] Dashboard Admin Sistema (usam dados mock)
- [ ] Dashboard Admin Cliente (usam dados mock)
- [ ] Página do Cliente (usam dados mock)
- [ ] Integração real das páginas com as APIs

### Fase 5: Chatbot e Automação - **CONCLUÍDA (parcialmente)**
- [x] Listener de eventos WhatsApp
- [x] Parser de comandos
- [x] Atualização de lista de números
- [ ] Timer de 5 minutos para reservas (validar)
- [ ] Boas-vindas para novos membros (validar)

### Fase 6: QA e Documentação - **PENDENTE**
- [ ] Testes unitários
- [ ] Testes E2E
- [ ] Documentação da API
- [ ] Ajustes finais de documentação

---

## 🏗️ Estrutura do Banco de Dados (Prisma)

### Entidades Principais:
- **User** (SYSTEM_ADMIN, CLIENT_ADMIN, CUSTOMER)
- **ClientAdmin** (tenant: subdomínio, cores, logo, grupo WhatsApp)
- **Customer** (vinculado a User)
- **Plan** (FIXED, RECURRENT)
- **PlanLimit** (limites e porcentagens)
- **Subscription** (ClientAdmin + Plan)
- **Raffle** (rifas com config de pagamento)
- **RaffleNumber** (estados: disponível, reservado, pago)
- **Sale** (vendas)
- **PaymentOrder** (pedidos de assinatura)
- **SystemConfig** (configurações globais)
- **WhatsappSession** (sessões por cliente)

---

## 📁 Arquivos Principais

### Configuração:
- `package.json` - Dependências e scripts
- `next.config.js` - Config Next.js + redirects para install
- `tsconfig.json` - TypeScript configurado
- `middleware.js` - Multi-tenancy
- `.env.example` - Variáveis de ambiente

### Backend (lib/):
- `lib/auth.js` - JWT e autenticação
- `lib/billing.js` - Lógica de cobrança
- `lib/prisma.js` - Cliente Prisma
- `lib/tenant.js` - Multi-tenancy
- `lib/whatsapp.js` - Integração WhatsApp
- `lib/pix.js` - Geração PIX
- `lib/email.js` - Envio de e-mails
- `lib/queue.js` - Fila de processamento

### API Routes (pages/api/):
- `api/auth/` - Login, registro, recover
- `api/raffles/` - CRUD rifas
- `api/subscriptions/` - Assinaturas
- `api/whatsapp/` - WhatsApp
- `api/install/` - Wizard instalação
- `api/plans/` - Planos
- `api/sales/` - Vendas
- `api/customers/` - Clientes
- `api/payment-orders/` - Pedidos pagamento
- `api/reports/` - Relatórios
- `api/webhooks/` - Webhooks

### Frontend (pages/):
- `pages/admin-sistema/` - Dashboard System Admin
- `pages/admin-cliente/` - Dashboard Client Admin
- `pages/cliente/` - Página Cliente Final
- `pages/install/` - Wizard

### Componentes (components/):
- `components/layout/` - Layouts
- `components/ui/` - Button, Card, Input, Sidebar

### Documentação:
- `README.md` - Visão geral
- `GUIA_USUARIO.md` - Guia do usuário
- `UI_UX_DESIGN.md` - Design system guide
- `ANALISE_PLANO.md` - Plano de desenvolvimento (6 fases)
- `IDEIAS.md` - Requisitos coletados
- `TEAM.md` - Estrutura do time

---

## 🔄 Histórico de Sessões

### Sessão 1 - 30/04/2026
**Iniciado por:** Kassio
**Objetivo:** Retomar projeto do onde parou

**O que foi feito:**
1. Analisou-se o projeto completamente usando o agente explore
2. Identificou-se que o projeto está na transição da Fase 3 para Fase 4
3. Lidas as documentações (ANALISE_PLANO.md, etc.)
4. Criado este arquivo de histórico

**Decisões tomadas:**
- Usuário quer continuar seguindo a sequência do plano
- Próximo passo: Fase 4 (Frontend e UI/UX)
- Usuário pediu criação deste arquivo de histórico

**Pendências identificadas:**
- Páginas frontend usam dados mock em vez de APIs reais
- Webhooks de pagamento não verificados
- Testes automatizados pendentes
- Deploy/infraestrutura não configurada

**Próximos passos definidos:**
- Escolher onde começar na Fase 4:
  1. Login e recuperação de senha
  2. Dashboard Admin Sistema
  3. Dashboard Admin Cliente
  4. Página do Cliente (URL customizada)

---

### Sessão 2 - 30/04/2026
**Iniciado por:** Kassio
**Objetivo:** Continuar Fase 4 - Login e recuperação de senha

**O que foi feito:**
1. Corrigido fluxo de login (`pages/login.js`):
   - Criada API `/api/auth/check-whatsapp` que estava faltando
   - Login agora usa `/api/auth/login` com `emailOrPhone` e `password`
   - Armazena token no localStorage após login
2. Criada página de recuperação de senha (`pages/recover-password.js`)
3. Criada página de reset de senha (`pages/reset-password.js`)
4. Corrigida API `/api/auth/reset-password` para aceitar campo `password`
5. Adicionados estilos para divider e mensagens de sucesso no CSS
6. Atualizado este histórico

**Arquivos modificados/criados:**
- `pages/api/auth/check-whatsapp.js` (novo)
- `pages/login.js` (corrigido)
- `pages/recover-password.js` (novo)
- `pages/reset-password.js` (novo)
- `pages/api/auth/reset-password.js` (corrigido)
- `styles/Login.module.css` (adicionados estilos)

**Próximos passos:**
- Testar fluxo completo: login → recuperação → reset
- Continuar Fase 4: Dashboard Admin Sistema

---

### Sessão 3 - 30/04/2026
**Iniciado por:** Kassio
**Objetivo:** Continuar Fase 4 - Dashboard Admin Sistema e integração com APIs

**O que foi feito:**
1. Criada lib `lib/api.js` com funções para consumir APIs
2. Atualizado `pages/admin-sistema/dashboard.js` (integrado)
3. Atualizado `pages/admin-sistema/planos.js` (integrado)
4. Atualizado `pages/admin-sistema/admins.js` (integrado)
5. Corrigido `lib/api.js` (removida duplicata)
6. Atualizado `pages/admin-cliente/dashboard.js` (integrado)
7. Atualizado `pages/admin-cliente/rifas.js` (integrado completamente)
8. Atualizado `pages/admin-cliente/relatorios.js` (integrado)
9. Atualizado `pages/admin-cliente/assinatura.js` (integrado)
10. Criada página `pages/admin-cliente/whatsapp.js` (nova - integração WhatsApp)
11. Criada página `pages/admin-cliente/sorteio.js` (nova - sorteio de rifas)

**Arquivos modificados/criados:**
- `lib/api.js` (novo - funções de API)
- `pages/admin-sistema/dashboard.js` (integrado)
- `pages/admin-sistema/planos.js` (integrado)
- `pages/admin-sistema/admins.js` (integrado)
- `pages/admin-cliente/dashboard.js` (integrado)
- `pages/admin-cliente/rifas.js` (integrado completamente)
- `pages/admin-cliente/relatorios.js` (integrado)
- `pages/admin-cliente/assinatura.js` (integrado)
- `pages/admin-cliente/whatsapp.js` (novo)
- `pages/admin-cliente/sorteio.js` (novo)
- `pages/api/users/index.js` (novo - API para admins cliente)

**Status da Fase 4:**
- ✅ Login e recuperação de senha (completo)
- ✅ Dashboard Admin Sistema (completo)
- ✅ Gestão de Planos (completo)
- ✅ Gestão de Admins Cliente (completo)
- ✅ Dashboard Admin Cliente (completo)
- ✅ Gestão de Rifas (completo)
- ✅ Relatórios (completo)
- ✅ Assinatura (completo)
- ✅ WhatsApp (completo)
- ✅ Sorteio (completo)

**Próximos passos:**
- Testar todas as funcionalidades implementadas
- Iniciar Fase 5: Chatbot e Automação (validar timers, fila FIFO)
- Fase 6: QA e Documentação

---

### Sessão 4 - 30/04/2026
**Iniciado por:** Kassio
**Objetivo:** Deploy no servidor whatsrifas.com.br

**O que foi feito:**
1. Corrigido `lib/api.js` no servidor (havia duplicatas causando erro de build)
2. Commitado e enviado para GitHub (commit `af85977`)
3. Código atualizado no servidor via `git pull origin master` (feito pelo usuário)
4. Corrigido `ecosystem.config.js` para Next.js (npm start em vez de server.js)
5. Alterada porta para 3000 no `ecosystem.config.js`
6. Adicionada captura de logs no `ecosystem.config.js`
7. Enviados commits `af85977`, `3d19cd5`, `c7628e0`, `35f05e9` para GitHub

**Status do Deploy:**
- ✅ Código atualizado no servidor (git pull funcionou)
- ✅ Build realizado com sucesso (`npm run build`)
- ✅ PM2 configurado com `ecosystem.config.js`
- ⚠️ Pendente: Configurar proxy no CyberPanel para domínio sem porta
- ⚠️ Pendente: Executar instalador em `/install`

**Configuração de Proxy (CyberPanel):**
Para acessar `whatsrifas.com.br` sem porta, configurar Proxy Pass no CyberPanel:
1. Acessar CyberPanel → Websites → whatsrifas.com.br
2. Clicar em **Rewrite Rules** ou **vHost Conf**
3. Adicionar regra para proxy para localhost:3000

**Próximos passos no servidor:**
```bash
# 1. Criar .env temporário para app subir
cd /home/rifasonline/htdocs/whatsrifas.com.br/rifasonline
cat > .env << 'EOF'
DATABASE_URL="mysql://temp:temp@localhost:3306/temp"
JWT_SECRET="temp-secret"
NEXT_PUBLIC_API_URL="http://whatsrifas.com.br"
NODE_ENV="production"
EOF

# 2. Iniciar aplicação
pm2 delete rifasonline
pm2 start ecosystem.config.js
pm2 save

# 3. Configurar proxy no CyberPanel para porta 3000
# 4. Acessar http://whatsrifas.com.br/install
```

---

## 🎯 Onde Paramos (Última Sessão)

**Data:** 30/04/2026 - Sessão 4
**Local:** Fase 4 - Frontend concluído, iniciando Deploy
**Situação:** Deploy no servidor whatsrifas.com.br em andamento

### Status Atual do Deploy:
- ✅ Código atualizado no GitHub (commit `7d4e6b0`)
- ✅ Build no servidor: SUCESSO
- ✅ PM2 configurado com `ecosystem.config.js`
- ✅ Porta alterada para 3000
- ✅ Log capture configurado
- ⚠️ Pendente: Configurar proxy nginx para domínio sem porta
- ⚠️ Pendente: Executar instalador `/install`

---

## 📝 Notas Importantes

### Regras de Negócio:
- Sistema SaaS multi-tenant com 3 tipos de usuários
- Cobrança quinzenal (15 em 15 dias)
- Plano Recorrente: porcentagem sobre vendas com limites acumulativos
- Plano Fixo: valor mensal
- Chatbot WhatsApp com reserva FIFO e timer 5 min
- Números: ✅ Disponível, 🔍 Reservado, 💰 Pago

### Padrões do Código:
- Componentes em CSS Modules
- Design system com CSS Custom Properties
- APIs RESTful com Next.js API Routes
- Autenticação JWT
- Multi-tenancy via middleware (identifica tenant pelo host)

### Comandos Úteis:
```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npx prisma studio # Visualizar banco
npx prisma migrate dev # Novas migrações
```

---

## 🖥️ Configuração do Servidor (whatsrifas.com.br)

### Acesso SSH:
- **Usuário:** rifasonline
- **Host:** whatsrifas.com.br
- **Diretório da aplicação:** `/home/rifasonline/htdocs/whatsrifas.com.br/rifasonline`

### Configuração do PM2 (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'rifasonline',
    script: 'npm',
    args: 'start',
    cwd: '/home/rifasonline/htdocs/whatsrifas.com.br/rifasonline',
    error_file: '/home/rifasonline/htdocs/whatsrifas.com.br/rifasonline/logs/error.log',
    out_file: '/home/rifasonline/htdocs/whatsrifas.com.br/rifasonline/logs/out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### Configuração do Nginx:
**Arquivo:** `/etc/nginx/sites-enabled/whatsrifas.com.br.conf`
**Porta da aplicação:** 3000
**Proxy configurado em location /:**
```nginx
proxy_pass http://127.0.0.1:3000;
```

### Arquivo .env (temporário para app subir):
```env
DATABASE_URL="mysql://temp:temp@localhost:3306/temp"
JWT_SECRET="temp"
NEXT_PUBLIC_API_URL="http://whatsrifas.com.br"
NODE_ENV="production"
```
⚠️ O instalador (`/install`) vai criar o `.env` correto com os dados reais do banco.

---

## 🚀 Passo a Passo para Próxima Sessão

### 1. Verificar se aplicação está rodando:
```bash
ssh rifasonline@whatsrifas.com.br
cd /home/rifasonline/htdocs/whatsrifas.com.br/rifasonline
pm2 status
curl http://localhost:3000
pm2 logs rifasonline --lines 50
```

### 2. Corrigir proxy nginx (se ainda não feito):
```bash
sudo nano /etc/nginx/sites-enabled/whatsrifas.com.br.conf
# Alterar linha do proxy_pass para: proxy_pass http://127.0.0.1:3000;
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Acessar instalador:
No navegador: `https://whatsrifas.com.br/install`
- O instalador vai:
  1. Testar conexão com MySQL
  2. Criar arquivo `.env` com `DATABASE_URL` correta
  3. Rodar migrações do Prisma (`npx prisma migrate deploy`)
  4. Criar usuário Admin Sistema

### 4. Após instalador rodar:
```bash
pm2 restart rifasonline
pm2 save
```

### 5. Verificar se tudo funciona:
- Acesse `https://whatsrifas.com.br`
- Teste login com admin criado no instalador
- Verifique logs: `pm2 logs rifasonline --lines 50`

---

## 🔍 O Que Verificar em Cada Nova Sessão

1. Ler este arquivo completo
2. Verificar se há novas migrações do Prisma
3. Checar package.json para novas dependências
4. Validar se o servidor de desenvolvimento sobe (`npm run dev`)
5. Conferir se o banco MySQL está rodando no servidor
6. Verificar sessões WhatsApp ativas
7. Testar fluxo básico: login -> criar rifa -> conectar WhatsApp
8. **Verificar status do deploy:** `pm2 status` e `curl http://localhost:3000`
9. **Verificar logs:** `pm2 logs rifasonline --lines 50`
10. **Verificar nginx:** `sudo nginx -t` e `sudo systemctl status nginx`

---

## 📦 Commits Recentes no GitHub:
- `7d4e6b0` - Update HISTORICO.md with deploy progress and nginx config
- `b26a8ac` - Add nginx vhost configuration for whatsrifas.com.br
- `35f05e9` - Add log capture to ecosystem.config.js
- `c7628e0` - Change port to 3000 for Next.js
- `3d19cd5` - Fix ecosystem.config.js for Next.js (npm start instead of server.js)
- `af85977` - Fix duplicate functions in lib/api.js

---

*Este arquivo deve ser atualizado ao final de cada sessão de trabalho com o que foi feito, decisões tomadas e próximos passos.*
