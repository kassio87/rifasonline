# Análise e Plano de Desenvolvimento - RifasOnline

## Resumo do que foi Compreendido

### Visão Geral
Sistema SaaS para gerenciamento de rifas online com modelos de assinatura recorrente e fixa, multi-tenant (URLs customizadas por cliente), integração profunda com WhatsApp para vendas automáticas via chatbot e notificações.

### Tecnologias Definidas
- **Frontend/Backend**: Next.js (Full-stack)
- **Banco de Dados**: MySQL
- **Integrações**: API não oficial do WhatsApp, PagSeguro, PIX
- **Arquitetura**: Web application com multi-tenancy (cada cliente tem URL e instância separada)

### Principais Módulos Identificados

#### 1. Autenticação e Gestão de Usuários
- Login com senha (Admin Sistema, Admin Cliente, Cliente)
- Login via WhatsApp (número + senha)
- Recuperação de senha (e-mail e WhatsApp)
- Cadastro de clientes via Chatbot (coleta nome/telefone no privado)

#### 2. Gestão de Assinaturas e Planos
- Admin Sistema cria planos (Recorrente vs Fixo)
- **Plano Recorrente**: Porcentagem sobre vendas (5% até 1000 nums, 4% até 3000, 3% até 10000, 2% até 20000 - configurável)
- Cobrança quinzenal (15 em 15 dias), acumulando limites no mês (zera só na virada do mês)
- **Plano Fixo**: Valor mensal fixo
- Geração de pedidos de pagamento no painel

#### 3. Gestão de Rifas (Admin Cliente)
- Criar, editar, excluir rifas
- Definir métodos de cobrança próprios (PagSeguro/PIX com seus dados)
- Relatório de vendas
- Funcionalidade "Fazer Sorteio"
- Dashboard com sidebar

#### 4. Chatbot e WhatsApp
- API não oficial do WhatsApp com sessões isoladas/persistentes por Admin Cliente
- Comandos: "Eu quero X", "Quero X ao Y", "#Fecha"
- Reserva com 🔍 (lupa) por 5 minutos (FIFO queue)
- Se não pagar em 5 min: mantém reservado com nome/📱
- Se pagar: atualiza para 💰 nome ♥️ (@numero)
- Novo membro no grupo: boas-vindas + link customizado + perguntas no privado (nome/tel)
- Após cadastro: pede para entrar no link -> login com WhatsApp -> criar senha -> loga

#### 5. Configurações do Sistema
- Install Wizard: Admin inicial, senha, MySQL, conectar WhatsApp
- Logo, nome, favicon, cores primárias/secundárias
- Admin Sistema pode ver dashboard de qualquer Admin Cliente

#### 6. Formato de Exibição
- Lista de números com emojis (✅ Disponível, 🔍 Reservado, 💰 Pago)
- Atualização automática pós-venda/pagamento

## Plano de Desenvolvimento com Agentes

### Fase 1: Arquitetura e Infraestrutura (Agente: @arquiteto + @devops)
1. Definir schema do MySQL (usuários, rifas, números, assinaturas, vendas, planos)
2. Estruturar pastas Next.js (pages, components, api, lib, styles)
3. Configurar conexão MySQL e ORM (Prisma/Sequelize)
4. Implementar multi-tenancy (middleware de subdomain/URL customizada)
5. Criar Install Wizard

### Fase 2: Backend Core (Agente: @backend)
1. API de autenticação (JWT, login WhatsApp, recover)
2. CRUD de Planos e Assinaturas (lógica de cobrança recorrente/fixa)
3. CRUD de Rifas e Números (estados: disponível, reservado, pago)
4. Lógica de fila FIFO para reservas (5 min timeout)
5. Relatórios de vendas e cálculo de comissões

### Fase 3: Integrações (Agente: @backend)
1. Integração WhatsApp (sessões isoladas, QR Code, reset, delete)
2. Webhook para comandos do chatbot (parser de mensagens)
3. Integração PagSeguro e PIX (geração de cobranças)
4. Notificações de pedidos de pagamento

### Fase 4: Frontend e UI/UX (Agente: @frontend + @designer)
1. Design system (cores, tipografia, componentes base)
2. Login e recuperação de senha
3. Dashboard Admin Sistema (gestão planos, admins cliente, configurações)
4. Dashboard Admin Cliente (rifas, relatórios, sorteio, assinatura, WhatsApp)
5. Página do Cliente (via URL customizada, login WhatsApp)

### Fase 5: Chatbot e Automação (Agente: @backend)
1. Listener de eventos do WhatsApp (novo membro no grupo)
2. Envio de boas-vindas e perguntas no privado
3. Parser de comandos e atualização de lista de números
4. Timer de 5 minutos para reservas

### Fase 6: QA e Documentação (Agente: @qa + @docs)
1. Testes unitários e de integração
2. Testes E2E dos fluxos principais
3. Documentação da API e guias do usuário

## Próximos Passos
1. Validar esta análise
2. Iniciar Fase 1 com o Arquiteto
3. Prosseguir sequencialmente com os agentes

---
*Análise gerada em: 30/04/2026*