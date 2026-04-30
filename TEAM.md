# Time de Desenvolvimento RifasOnline

## Regras de Comunicação
- **IDIOMA OBRIGATÓRIO**: Todos os agentes devem responder SEMPRE em português
- Isso garante que o usuário entenda o que está acontecendo em cada etapa
- Documentação técnica pode conter termos em inglês quando necessário, mas explicações devem ser em português

## Estrutura do Time de Agentes

### 1. Arquiteto de Software (`@arquiteto`)
**Responsabilidades:**
- Definir arquitetura do sistema
- Escolher tecnologias e frameworks
- Definir padrões de código
- Revisar decisões técnicas

### 2. Desenvolvedor Backend (`@backend`)
**Responsabilidades:**
- APIs RESTful/GraphQL
- Lógica de negócio
- Banco de dados
- Autenticação/Autorização
- Integrações

### 3. Desenvolvedor Frontend (`@frontend`)
**Responsabilidades:**
- Interfaces de usuário
- UX/UI
- Integração com APIs
- Responsividade
- Estado da aplicação

### 4. DevOps/Infraestrutura (`@devops`)
**Responsabilidades:**
- CI/CD pipelines
- Deploy e configuração de servidores
- Monitoramento
- Banco de dados e infra
- Segurança

### 5. QA/Testes (`@qa`)
**Responsabilidades:**
- Testes unitários
- Testes de integração
- Testes E2E
- Automação de testes
- Validação de qualidade

### 6. Documentação (`@docs`)
**Responsabilidades:**
- Documentação técnica
- Documentação de API
- Manuais do usuário
- README e guias

## Metodologia de Trabalho
1. Arquiteto define a estrutura inicial
2. Backend e Frontend desenvolvem em paralelo
3. DevOps configura ambientes
4. QA valida continuamente
5. Docs documenta durante o processo

## Como Usar
Cada agente pode ser chamado usando o comando `/task` com o tipo apropriado:
- Para arquitetura: usar subagent_type="general" com prompt específico
- Para código: usar subagent_type="explore" ou "general"
