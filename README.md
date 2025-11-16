# DESAFIO-backend

Sistema backend de gestão escolar desenvolvido com **Node.js**, **Express** e **PostgreSQL**. A aplicação implementa autenticação JWT, autorização baseada em papéis (roles), e gerenciamento completo de alunos, disciplinas, turmas e matrículas.

## Requisitos

- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)
- PostgreSQL (versão 12 ou superior)

## Dependências Principais

- **express**: Framework web
- **pg**: Driver PostgreSQL
- **jsonwebtoken**: Autenticação JWT
- **bcryptjs**: Hash seguro de senhas
- **dotenv**: Gerenciamento de variáveis de ambiente
- **uuid**: Geração de IDs únicos
- **nodemon** (dev): Recarregamento automático em desenvolvimento

## Configuração do Projeto

1. Clone o repositório:
```bash
git clone https://github.com/kallianaa/DESAFIO-backend.git
cd DESAFIO-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Exemplo de configuração do arquivo `.env`:
   ```
   PORT=3000
   DB_USER=admin
   DB_HOST=localhost
   DB_NAME=desafio_backend
   DB_PASSWORD='password'
   DB_PORT=5432
   ```

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm run dev`

Executa o aplicativo no modo de desenvolvimento usando nodemon.\
O servidor será reiniciado automaticamente se você fizer edições no código.\
Acesse [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

### `npm start`

Executa o aplicativo em modo de produção.

## Configuração do Banco de Dados

### Instalação do PostgreSQL

#### Ubuntu/Debian
```bash
# Atualizar os pacotes e instalar o PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Iniciar o serviço do PostgreSQL
sudo service postgresql start
```

#### MacOS
```bash
# Instalar via Homebrew
brew install postgresql

# Iniciar o serviço do PostgreSQL
brew services start postgresql
```

### Configuração Inicial do Banco de Dados

Execute o script de inicialização diretamente com o usuário postgres:
```bash
# A partir da raiz do projeto
sudo -u postgres psql -f src/database/init.sql
```

Este comando irá:
1. Criar o banco de dados
2. Criar todas as tabelas necessárias
3. Configurar as relações e constraints
4. Inserir dados básicos (roles)

1. Acesse o prompt do PostgreSQL:
```bash
sudo -u postgres psql
```

2. Crie um novo usuário e banco de dados:
```sql
-- Criar usuário
CREATE USER admin WITH PASSWORD 'password';

-- Criar banco de dados
CREATE DATABASE desafio_backend;

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE desafio_backend TO admin;
```

3. Inicialize o banco de dados com o script SQL:
```bash
# A partir da raiz do projeto
psql -U admin -d desafio_backend -f src/database/init.sql
```

### Verificando a Instalação

Para verificar se o PostgreSQL está funcionando corretamente:
```bash
# Verificar o status do serviço
sudo service postgresql status  # Ubuntu/Debian
brew services list             # MacOS

# Tentar conectar ao banco de dados
psql -U admin -d desafio_backend -h localhost
```

## Estrutura do Projeto

```
src/
  ├── config/        # Configurações (autenticação, banco de dados)
  ├── controllers/   # Controladores das rotas
  ├── database/      # Scripts SQL de inicialização
  ├── domain/        # Modelos de domínio (classes)
  ├── middlewares/   # Middlewares (autenticação, autorização)
  ├── repositories/  # Camada de acesso a dados (DAOs)
  ├── routes/        # Definição das rotas da API
  ├── security/      # Classes de segurança (JWT, Hash, DTOs)
  ├── services/      # Lógica de negócios
  └── index.js       # Arquivo principal da aplicação

documentation/    # Documentação técnica e diagramas
```

## Documentação

A pasta `documentation/` contém os diagramas e documentação técnica do projeto, incluindo:

- Modelo de Dados (Database Schema)
- Diagramas de Relacionamento de Entidades (ERD)
- Documentação da Arquitetura
- Fluxos de autenticação e autorização
- Especificações técnicas adicionais

## Autenticação e Segurança

### Fluxo de Autenticação

1. **Login:** Usuário fornece credenciais (usuário e senha)
2. **Validação:** Senha é validada contra hash armazenado no banco
3. **Token JWT:** Geração de token com informações do usuário e papéis
4. **Acesso Protegido:** Endpoints protegidos validam o token em cada requisição
5. **Autorização:** Middlewares verificam se o usuário tem permissão para o recurso

### Headers Necessários

Para acessar endpoints protegidos, inclua o token JWT no header:

```
Authorization: Bearer <seu_token_jwt>
```

## Documentação

### Autenticação e Autorização

A API utiliza **JWT (JSON Web Token)** para autenticação e controle de acesso baseado em papéis (roles). Existem dois papéis principais:
- **ADMIN**: Acesso completo ao sistema
- **USER**: Acesso limitado (apenas leitura de dados pessoais)
- **ALUNO**

**Rota de Autenticação:**
```
POST /auth/login
```
Realiza login e retorna um token JWT.

**Corpo da Requisição:**
```json
{
  "usuario": "nome_usuario",
  "senha": "sua_senha"
}
```

### Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Status da API |
| `GET` | `/` | Mensagem de boas-vindas |
| `POST` | `/auth/login` | Login do usuário |
| `GET` | `/usuario` | Listar usuários |
| `POST` | `/usuario` | Criar usuário |
| `PUT` | `/usuario/:id` | Atualizar usuário |
| `DELETE` | `/usuario/:id` | Deletar usuário |
| `GET` | `/aluno` | Listar alunos |
| `POST` | `/aluno` | Criar aluno |
| `PUT` | `/aluno/:id` | Atualizar aluno |
| `DELETE` | `/aluno/:id` | Deletar aluno |
| `GET` | `/matricula` | Listar matrículas |
| `POST` | `/matricula` | Criar matrícula |
| `PUT` | `/matricula/:id` | Atualizar matrícula |
| `DELETE` | `/matricula/:id` | Deletar matrícula |
| `GET` | `/turmas` | Listar turmas |
| `POST` | `/turmas` | Criar turma |
| `PUT` | `/turmas/:id` | Atualizar turma |
| `DELETE` | `/turmas/:id` | Deletar turma |
| `GET` | `/disciplinas` | Listar disciplinas |
| `POST` | `/disciplinas` | Criar disciplina |
| `PUT` | `/disciplinas/:id` | Atualizar disciplina |
| `DELETE` | `/disciplinas/:id` | Deletar disciplina |

### Exemplo de Resposta - Health Check

```
GET /health
```

Retorna o status atual da API com timestamp e uptime.

Exemplo de resposta:
```json
{
  "status": "OK",
  "timestamp": "2025-11-07T12:00:00.000Z",
  "uptime": 123.45
}
```

## Endpoints Base

- **Base URL Local:** `http://localhost:3000`
- **Health Check:** `http://localhost:3000/health`
- **API Welcome:** `http://localhost:3000/`

## Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request