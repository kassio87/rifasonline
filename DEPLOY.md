# Guia de Deploy - whatsrifas.com.br (CyberPanel)

## Informações do Servidor
- **SSH:** `rifasonline@whatsrifas.com.br`
- **Caminho:** `/home/rifasonline/htdocs/whatsrifas.com.br`
- **Node.js:** v20 LTS
- **Porta:** 3088
- **SO:** Ubuntu

## Passo a Passo

### 1. No servidor (via SSH)

```bash
# Conectar ao servidor
ssh rifasonline@whatsrifas.com.br

# Ir para a pasta
cd /home/rifasonline/htdocs/whatsrifas.com.br

# Clonar repositório (primeira vez)
git clone https://github.com/kassio87/rifasonline.git .

# Ou atualizar (se já existir)
git pull origin master
```

### 2. Configurar variáveis de ambiente

```bash
# Criar arquivo .env.local baseado no exemplo
cp .env.production.example .env.local

# Editar com as configurações reais (banco de dados, etc.)
nano .env.local
```

### 3. Instalar dependências e fazer build

```bash
# Instalar dependências
npm install

# Gerar build de produção
npm run build
```

### 4. Configurar PM2 (Gerenciador de processos)

```bash
# Instalar PM2 globalmente (se não tiver)
npm install -g pm2

# Iniciar aplicação com PM2
pm2 start ecosystem.config.js

# Salvar configuração para iniciar com o sistema
pm2 startup
pm2 save
```

### 5. Configurar Proxy Reverso (se necessário)

Se o CyberPanel usa Nginx/Apache, configure para:
- Redirecionar porta 80/443 para localhost:3088

Exemplo Nginx:
```nginx
server {
    listen 80;
    server_name whatsrifas.com.br www.whatsrifas.com.br;

    location / {
        proxy_pass http://localhost:3088;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Configurar Banco de Dados MySQL

```bash
# Acessar MySQL
mysql -u root -p

# Criar banco e usuário (executar no MySQL)
CREATE DATABASE rifasonline;
CREATE USER 'rifasuser'@'localhost' IDENTIFIED BY 'sua_senha_forte';
GRANT ALL PRIVILEGES ON rifasonline.* TO 'rifasuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Rodar migrações do Prisma
npx prisma migrate deploy
npx prisma generate
```

### 7. Verificações

```bash
# Verificar status
pm2 status
pm2 logs rifasonline

# Reiniciar se necessário
pm2 restart rifasonline
```

## Comandos Úteis

```bash
# Ver logs
pm2 logs rifasonline

# Reiniciar aplicação
pm2 restart rifasonline

# Parar aplicação
pm2 stop rifasonline

# Atualizar código e reimplantar
cd /home/rifasonline/htdocs/whatsrifas.com.br
git pull origin master
npm install
npm run build
pm2 restart rifasonline
```

## Solução de Problemas

### Erro de porta em uso
```bash
# Verificar o que está usando a porta 3088
lsof -i:3088
# Matar processo se necessário
kill -9 PID
```

### Erro de build
```bash
# Limpar cache
rm -rf .next
npm run build
```

### Verificar se Node.js versão correta
```bash
node -v  # Deve ser v20.x
```
