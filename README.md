# RifasOnline

Sistema SaaS completo para gerenciamento de rifas online com assinaturas recorrentes e integração via WhatsApp.

## 🚀 Tecnologias

- **Frontend/Backend**: Next.js (React)
- **Banco de Dados**: MySQL (via WampServer)
- **ORM**: Prisma
- **WhatsApp**: whatsapp-web.js (API não oficial)
- **Autenticação**: JWT + NextAuth
- **UI**: CSS Modules + variáveis CSS customizáveis

## 📋 Pré-requisitos

- Node.js 18+
- MySQL (WampServer)
- NPM ou Yarn

## 🔧 Instalação

1. **Clone o repositório ou acesse a pasta**
   ```bash
   cd C:\Users\Kassio\Documents\Saas\rifasonline
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   - Crie um banco MySQL chamado `rifasonline` no WampServer
   - Edite o arquivo `.env` com suas configurações:
     ```
     DATABASE_URL="mysql://root@localhost:3306/rifasonline"
     ```

4. **Execute as migrações do Prisma**
   ```bash
   npx prisma migrate dev
   ```

5. **Gere o cliente Prisma**
   ```bash
   npx prisma generate
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

7. **Acesse o Install Wizard**
   - Abra http://localhost:3000 (ou 3001 se 3000 estiver ocupado)
   - Siga as instruções para criar o admin do sistema, configurar banco e conectar WhatsApp

## 🎯 Funcionalidades

### Admin do Sistema
- Criar administradores de clientes
- Criar e gerenciar planos (Recorrente com limites configuráveis ou Fixo)
- Configurar sistema (logo, nome, cores)
- Visualizar qualquer dashboard de cliente

### Admin Cliente
- Gerar rifas para vender
- Dashboard com sidebar (Rifas, Relatórios, Assinatura, WhatsApp, Sorteio)
- Configurar métodos de cobrança (PagSeguro, PIX próprio)
- Conectar WhatsApp (QR Code, grupos, sessão isolada)
- Visualizar relatórios de vendas
- Fazer sorteio da rifa

### Cliente (Usuário Final)
- Entra no grupo do WhatsApp → recebe boas-vindas + link
- Responde perguntas no privado (nome/telefone)
- Reserva números via comandos:
  - "Eu quero 10" (individual)
  - "Quero 10 ao 20" (intervalo)
  - "#Fecha" (todos)
- Paga via PIX/PagSeguro
- Visualiza lista atualizada de números

## 🤖 Chatbot WhatsApp

- **Sessão isolada** por admin cliente (persistente)
- Comandos de reserva com fila FIFO
- Timer de 5 minutos para pagamento
- Atualização automática da lista de números
- Notificações de novos membros no grupo

## 💰 Sistema de Assinaturas

### Plano Recorrente
- Cobrança por porcentagem das vendas
- Limites configuráveis (ex: 1000 nums → 5%, 3000 nums → 4%)
- Cobrança quinzenal (15 em 15 dias)
- Acumula vendas no mês (zera só na virada)

### Plano Fixo
- Valor mensal fixo independente de vendas

## 🏗 Estrutura do Projeto

```
rifasonline/
├── pages/            # Rotas Next.js
│   ├── api/         # Endpoints da API
│   ├── admin-sistema/    # Páginas do admin sistema
│   ├── admin-cliente/    # Páginas do admin cliente
│   └── cliente/         # Páginas do cliente final
├── components/       # Componentes React
│   ├── layout/      # Layouts (Sidebar, etc.)
│   └── ui/          # Componentes base (Button, Input, Card)
├── lib/             # Lógica de negócio
├── prisma/          # Schema e migrações
├── styles/          # CSS global e modules
├── docs/            # Documentação
└── public/          # Arquivos estáticos
```

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte o arquivo `docs/GUIA_USUARIO.md`
- Verifique os logs do servidor

---

**Desenvolvido por:** Time RifasOnline (Agentes Especializados)
**Data:** Abril 2026