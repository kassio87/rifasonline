# UI/UX Design - RifasOnline

## Guia Visual (Configurável pelo Admin do Sistema)

### Cores
- **Primária**: (a definir nas configurações)
- **Secundária**: (a definir nas configurações)
- **Sucesso**: #28a745 (Verde para disponível ✅)
- **Reservado**: #ffc107 (Amarelo para 🔍 reservado)
- **Pago**: #17a2b8 (Azul para 💰 pago)

### Tipografia
- Fonte principal: (sugerida) Inter ou Roboto
- Tamanhos:
  - Títulos: 24-32px
  - Subtítulos: 18-20px
  - Corpo: 14-16px
  - Pequeno: 12px

### Componentes Base (Next.js + CSS Modules ou Styled Components)

#### Login
- Campo único (WhatsApp) na primeira tela
- Após digitar, expande para "Criar Senha" e "Confirmar Senha"
- Botão primário para entrar/cadastrar

#### Dashboard Admin Sistema
- Sidebar: Gestão Planos, Admins Cliente, Configurações, Visualizar Dashboards
- Cards de resumo (total clientes, receita mensal, etc.)

#### Dashboard Admin Cliente
- Sidebar: Rifas, Relatórios, Assinatura, WhatsApp, Sorteio
- Cards de rifas ativas, vendas do dia, status assinatura

#### Chatbot (WhatsApp)
- Mensagens formatadas com emojis
- Lista de números em monoespaçado ou formatada

#### Página do Cliente (URL Customizada)
- Design limpo e focado na rifa
- Lista de números visível (disponível/reservado/pago)
- Instruções de como reservar

## Fluxos de Usuário

### Fluxo de Cadastro (WhatsApp)
1. Entra no grupo → Chatbot identifica → Boas-vindas + link
2. Pergunta nome (privado) → Armazena
3. Pergunta telefone (privado) → Armazena/Cadastra
4. Solicita acessar link customizado
5. No link: digita WhatsApp → Cria senha → Loga automaticamente

### Fluxo de Compra de Rifa (WhatsApp)
1. Cliente digita "Eu quero 10, 20" no grupo
2. Chatbot marca como 🔍 (reservado) na lista
3. Cliente tem 5 minutos para pagar
4. Se pagar: atualiza para 💰 (pago) + nome/telefone
5. Se não pagar: mantém 🔍 + nome/telefone
6. Lista atualizada é postada no grupo

## Responsividade
- Mobile-first (WhatsApp é mobile)
- Desktop para dashboards administrativos
- Tablets (opcional)

## Ícones e Emojis
- ✅ Disponível
- 🔍 Reservado (lupa)
- 💰 Pago (dinheiro)
- ♥️ Destaque no nome do comprador
- 🎉✨ Títulos de rifa
- 🍀 Boa sorte

## Próximos Passos para o Designer
1. Criar wireframes das telas principais
2. Definir paleta de cores padrão
3. Criar protótipos no Figma (ou similar)
4. Validar com o stakeholders