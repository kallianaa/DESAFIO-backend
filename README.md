# DESAFIO-backend

Este é um projeto backend desenvolvido com Node.js e Express.

## Requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

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
   ```

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm run dev`

Executa o aplicativo no modo de desenvolvimento usando nodemon.\
O servidor será reiniciado automaticamente se você fizer edições no código.\
Acesse [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

### `npm start`

Executa o aplicativo em modo de produção.

## Estrutura do Projeto

```
src/
  ├── config/       # Arquivos de configuração
  ├── controllers/  # Controladores da aplicação
  ├── domain/      # Modelos de domínio
  ├── repositories/# Camada de acesso a dados
  ├── routes/      # Definição das rotas
  ├── security/    # Configurações de segurança
  └── services/    # Lógica de negócios
```

## Rotas Disponíveis

### Rota de Health Check

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

- Base URL Local: `http://localhost:3000`
- Health Check: `http://localhost:3000/health`
- API Welcome: `http://localhost:3000/`

## Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request