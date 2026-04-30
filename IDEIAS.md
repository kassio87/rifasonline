# Ideia do Sistema - RifasOnline

## Visão Geral
Sistema SaaS com assinaturas recorrentes.

## Requisitos Coletados

### 1. Modelo de Negócio
- [x] Sistema SaaS (Software as a Service)
- [x] Assinaturas recorrentes

### 2. Arquitetura do Sistema
- [x] Frontend (interface do usuário)
- [x] Backend (API e lógica de negócio)
- [x] Dashboard administrativo (sistema)
- [x] Tela de login e senha (autenticação de usuários)
- [x] Funcionalidade "Esqueci minha senha"
  - [x] Solicitar reset de senha por e-mail
  - [x] Solicitar reset de senha por WhatsApp
- [x] Tecnologia: Next.js (web application)
- [x] Logo e favicon definidos nas configurações do sistema
- [x] Banco de dados: MySQL
- [x] Multi-tenancy: cada admin cliente tem uma URL customizada
- [x] Cada URL customizada se torna uma web application independente (instância separada por cliente)
- [x] Install Wizard (assistente de instalação inicial):
  - [x] Definir nome do administrador do sistema
  - [x] Definir senha do administrador
  - [x] Configurar banco de dados MySQL (host, porta, usuário, senha, nome do banco)
  - [x] Conectar WhatsApp (gerar QR Code para o admin do sistema)

### 3. Papéis de Usuários

#### Admin do Sistema
- [x] Gerencia todo o sistema
- [x] Cria administradores de clientes (cliente admin)
- [x] Cria e gerencia planos de assinatura
  - **Plano Recorrente**:
    - [x] Cobrança baseada em porcentagem das vendas de números
    - [x] Configurável: limites de vendas (quantidade de números vendidos) e porcentagem cobrada para cada limite
    - [x] Limites padrão:
      - 1000 números vendidos a R$10 → 5%
      - 3000 números vendidos → 4%
      - 10000 números vendidos → 3%
      - 20000 números vendidos → 2%
    - [x] Permite adicionar novos limites personalizados (quantidade de vendas + porcentagem)
    - [x] Cobrança quinzenal (a cada 15 dias)
    - [x] A cada 15 dias: sistema faz análise de vendas e gera pedido de pagamento no painel do cliente
    - [x] Se atingir qualquer limite antes dos 15 dias: gera pedido de pagamento antecipado
    - [x] Após pagamento: continua contabilizando no decorrer do mês
    - [x] Limites NÃO zeram antes dos 15 dias, acumulam no mês
    - [x] Limites só zeram quando virar o mês (virada de mês)
  - **Plano Fixo**:
    - [x] Valor fixo mensal (independente de vendas)
- [x] Configura sistema (logo, nome)
  - [x] Definir cores primárias e secundárias do sistema
- [x] Pode visualizar a dashboard do admin cliente

#### Admin Cliente
- [x] Gerencia conta de cliente específica
- [x] Gera rifas para vender para seus clientes
- [x] Dashboard com sidebar contendo:
  - [x] Menu Rifas (criar, editar, excluir)
  - [x] Relatório de vendas
  - [x] Funcionalidade "Fazer Sorteio" da rifa
  - [x] Campo "Assinatura" (status da assinatura atual, plano, validade)
  - [x] Visualizar plano contratado
  - [x] Fazer pagamento da assinatura (renovação)
- [x] Configuração da integração com WhatsApp (API, mensagens, notificações)
- [x] Cada admin cliente tem sua própria sessão do WhatsApp isolada e persistente
- [x] Configuração de chatbot para atendimento e vendas automáticas
- [x] Opções de conexão:
  - [x] Conectar ao WhatsApp (gerar QR Code)
  - [x] Resetar conexão
  - [x] Excluir conexão
- [x] Após conectar, campo para selecionar um grupo do WhatsApp
- [x] Configuração de métodos de cobrança das rifas com dados próprios:
  - [x] PagSeguro (com dados do cliente)
  - [x] PIX (com chave do cliente)
  - [x] PIX Copia e Cola (com dados do cliente)

#### Comandos do Chatbot (WhatsApp)
- [x] Reservar números individuais:
  - "Eu quero 10"
  - "Quero 10, 20"
  - "Marca 15"
- [x] Reservar sequência (intervalo):
  - "Eu quero 10 ao 20"
  - "Quero 10 ao 20"
  - "Marca 10 ao 20"
- [x] Reservar todos os números restantes:
  - "#Fecha"
- [x] Ao digitar um comando e selecionar números:
  - Marcar como "Reservado" com ícone de lupa (🔍)
  - Formato: "🔍 [Nome do Cliente] (@[Número do Cliente])"
  - Exemplo: "🔍 João Silva (@554199999999)"
  - **Tempo de reserva**: 5 minutos para pagamento
  - **Após 5 minutos sem pagamento**: atualizar lista mantendo os números como reservados com nome e número do cliente
  - **Fila de processamento**: sempre adicionar à fila na ordem exata de recebimento dos comandos (FIFO - First In, First Out)

#### Eventos do Chatbot (WhatsApp)
- [x] Ao novo cliente entrar no grupo do WhatsApp:
  - Identificar automaticamente o novo membro
  - Enviar mensagem de boas-vindas contendo o link customizado do cliente (URL da sua web app)
  - Enviar perguntas no chat particular (privado) do cliente:
    - "Digite seu nome"
    - "Digite seu telefone"
  - Após coletar dados: sistema cadastra o cliente
  - Solicitar que cliente entre no link customizado do cliente
  - Link abre página de login com apenas campo "Número do WhatsApp"
  - Após digitar o número: aparecem campos "Criar Senha" e "Confirmar Senha"
  - Criar conta e fazer login automático

#### Cliente
- [x] Usuário final do sistema

### 4. Métodos de Pagamento
- [x] PagSeguro
- [x] PIX
- [x] PIX Copia e Cola

### 5. Integrações e Notificações
- [x] API não oficial do WhatsApp para notificar os admins cliente do sistema

### 6. Formato de Exibição de Números (Pós-Venda)
- [x] Após a conclusão de cada venda, deve ser postada a lista de números no seguinte formato:
  ```
  *Lista de Números da Rifa
  "🎉✨ RIFA PÓS-FESTAS – AINDA DÁ TEMPO DE GANHAR! ✨🎉"*

  1 - ✅ Disponível
  2 - 💰 Karen E Alexia ♥️ (@554198829898)
  3 - ✅ Disponível
  4 - 💰 Johny Souza (@554197786764)
  5 - 💰 Kevin (@554199264099)
  6 - ✅ Disponível
  7 - 💰 Nina Mello (@554198008094)
  8 - ✅ Disponível
  9 - 💰 Karen E Alexia ♥️ (@554198829898)
  10 - 💰 LUIZ ROSA (@554191676408)
  11 - 💰 LUIZ ROSA (@554191676408)
  12 - 💰 LUIZ ROSA (@554191676408)
  13 - 💰 LUIZ ROSA (@554191676408)
  14 - 💰 LUIZ ROSA (@554191676408)
  15 - 💰 LUIZ ROSA (@554191676408)
  16 - 💰 Fabiano de Souza (@554198895834)
  17 - ✅ Disponível
  18 - 💰 Ednilson Canutes (@554791147825)
  19 - ✅ Disponível
  20 - ✅ Disponível
  21 - ✅ Disponível
  22 - 💰 Nina Mello (@554198008094)
  23 - 💰 Johny Souza (@554197786764)
  24 - 💰 Kevin (@554199264099)
  25 - 💰 Messias (@554197801387)
  26 - ✅ Disponível
  27 - ✅ Disponível
  28 - ✅ Disponível
  29 - ✅ Disponível
  30 - ✅ Disponível
  31 - ✅ Disponível
  32 - 💰 Nina Mello (@554198008094)
  33 - 💰 Nina Mello (@554198008094)
  34 - ✅ Disponível
  35 - 💰 Lucas Faker (@554498330064)
  36 - ✅ Disponível
  37 - ✅ Disponível
  38 - ✅ Disponível
  39 - ✅ Disponível
  40 - 💰 Lucas Faker (@554498330064)
  41 - ✅ Disponível
  42 - ✅ Disponível
  43 - ✅ Disponível
  44 - ✅ Disponível
  45 - ✅ Disponível
  46 - 💰 Lucas Faker (@554498330064)
  47 - ✅ Disponível
  48 - 💰 Robson (@554198376053)
  49 - ✅ Disponível
  50 - ✅ Disponível
  51 - ✅ Disponível
  52 - ✅ Disponível
  53 - ✅ Disponível
  54 - ✅ Disponível
  55 - ✅ Disponível
  56 - ✅ Disponível
  57 - ✅ Disponível
  58 - ✅ Disponível
  59 - ✅ Disponível
  60 - ✅ Disponível
  61 - ✅ Disponível
  62 - ✅ Disponível
  63 - ✅ Disponível
  64 - ✅ Disponível
  65 - ✅ Disponível
  66 - ✅ Disponível
  67 - ✅ Disponível
  68 - ✅ Disponível
  69 - ✅ Disponível
  70 - ✅ Disponível
  71 - 💰 Nina Mello (@554198008094)
  72 - ✅ Disponível
  73 - ✅ Disponível
  74 - ✅ Disponível
  75 - ✅ Disponível
  76 - ✅ Disponível
  77 - ✅ Disponível
  78 - ✅ Disponível
  79 - ✅ Disponível
  80 - ✅ Disponível
  81 - ✅ Disponível
  82 - ✅ Disponível
  83 - 💰 Nina Mello (@554198008094)
  84 - ✅ Disponível
  85 - ✅ Disponível
  86 - ✅ Disponível
  87 - ✅ Disponível
  88 - ✅ Disponível
  89 - ✅ Disponível
  90 - ✅ Disponível
  91 - 💰 Kevin (@554199264099)
  92 - ✅ Disponível
  93 - ✅ Disponível
  94 - ✅ Disponível
  95 - ✅ Disponível
  96 - ✅ Disponível
  97 - ✅ Disponível
  98 - ✅ Disponível
  99 - ✅ Disponível
  100 - ✅ Disponível

  Para participar, digite os comandos aceitos para reservar numeros.
  *Eu quero 1, 2, 3*
  *Quero 1, 2, 3*
  *Marca 1, 2, 3*

  Boa sorte a todos! 🍀
  ```

- [x] Ao confirmar o pagamento do cliente, os números reservados são atualizados na lista: substituir "✅ Disponível" pelo nome do cliente e número de contato no formato "💰 [Nome] ♥️ (@[Número])"

---

*Adicionar mais requisitos conforme solicitado*