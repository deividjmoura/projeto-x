# Projeto-X - Login/Cadastro com React + Chakra UI

Aplicação completa de autenticação com **React** (frontend), **Express** (backend) e **PostgreSQL** (Neon).

## Tecnologias

- **Frontend**: React 19 + Vite + Chakra UI
- **Backend**: Express.js
- **Database**: PostgreSQL (Neon)
- **Autenticação**: JWT + bcryptjs

## Setup Rápido

### 1. Configurar Variáveis de Ambiente

Copie o `.env.example` para `.env` e preencha as variáveis:

```bash
cp .env.example .env
```

Edite `.env`:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=seu-secret-muito-seguro
VITE_API_BASE=http://localhost:4000
```

### 2. Instalar Dependências

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
npm --prefix server install
```

### 3. Rodar Servidores

Em **dois terminais separados**:

**Terminal 1 - Backend (porta 4000):**
```bash
npm --prefix server start
```

**Terminal 2 - Frontend (porta 5173/5174):**
```bash
npm run dev
```

Abra: http://localhost:5173 (ou a porta indicada pelo Vite)

## Endpoints da API

### `POST /api/register`
Cria novo usuário.
```json
{
  "name": "João",
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```
**Response**: `{ user: { id, email, name }, token }`

### `POST /api/login`
Autentica usuário e retorna JWT.
```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```
**Response**: `{ user: { id, email, name }, token }`

## Estrutura do Projeto

```
projeto-x/
├── src/
│   ├── App.jsx           # Componente principal
│   ├── LoginRegister.jsx # Tela de login/cadastro
│   ├── main.jsx          # Entrypoint React
│   ├── App.css           # Estilos da app
│   └── index.css         # Estilos globais
├── server/
│   ├── index.js          # Express server + endpoints
│   └── package.json      # Dependências do servidor
├── .env                  # Variáveis de ambiente (NÃO versione!)
├── .env.example          # Template de .env
├── package.json          # Dependências do frontend
└── README.md             # Este arquivo
```

## Recursos Implementados

✅ Cadastro com hash de senha (bcryptjs)
✅ Login com JWT
✅ CORS configurado para desenvolvimento
✅ Criação automática de tabela `users` no Neon
✅ Componentes Chakra UI com comments
✅ Auto-commenting de arquivos (script `npm run autocomment`)

## Próximos Passos Recomendados

- [ ] Adicionar validação de email (verificação)
- [ ] Implementar refresh tokens
- [ ] Proteger rotas do frontend com middleware de autenticação
- [ ] Adicionar endpoint para logout
- [ ] Fazer deploy no Vercel/Railway/Render
- [ ] Configurar HTTPS em produção
- [ ] Usar variáveis de ambiente seguros em produção

## Deploy em Produção

Antes de fazer deploy:

1. Mude `JWT_SECRET` para algo bem mais seguro (gere com `openssl rand -base64 32`)
2. Configure `DATABASE_URL` com credenciais do seu banco de produção
3. Coloque `VITE_API_BASE` para a URL do backend em produção
4. **Nunca** commite o `.env` real no git — use `.env.example` como guia

## Auto-comentários

Para adicionar comentários automaticamente em novos arquivos:
```bash
npm run autocomment
```

## Licença

MIT

