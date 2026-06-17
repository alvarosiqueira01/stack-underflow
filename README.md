# StackUnderflow

Trabalho da disciplina de Desenvolvimento de Software para Web, implementando um fórum de perguntas e respostas inspirado no Stack Overflow.

## Objetivo

O StackUnderflow é uma plataforma colaborativa onde usuários podem criar perguntas, responder dúvidas, votar em conteúdos e construir reputação dentro da comunidade.

O projeto tem como foco a aplicação de boas práticas de desenvolvimento web moderno, arquitetura escalável, documentação de APIs e organização em monorepo.

---

# Arquitetura Geral

O projeto utiliza uma arquitetura **Monorepo**, permitindo compartilhar código, configurações e tipos entre frontend e backend.

```text
stack-underflow/
│
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend Express + TypeScript
│
├── packages/
│   ├── shared-types/
│   ├── eslint-config/
│   └── tsconfig/
│
├── infrastructure/
│   ├── docker/
│   └── mongo-init/
│
├── docs/
│
│
└── docker-compose.yml
```

---
Inicialização:
- docker-compose up mongodb
e na pasta /api ou /web:
- npm run dev


# Tecnologias Utilizadas

## Frontend

* Next.js 15+
* React 19+
* TypeScript
* Tailwind CSS
* TanStack Query
* Zustand
* React Hook Form
* Zod
* React Markdown
* Rehype Sanitize
* Axios

## Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* Zod
* JWT
* Bcrypt
* Helmet
* Express Rate Limit

## Infraestrutura

* Docker
* Docker Compose
* MongoDB
* GitHub Actions

---

# Organização do Frontend

O frontend segue o padrão **Feature Sliced Design (FSD)** para facilitar escalabilidade e separação de responsabilidades.

```text
apps/web/src/

app/
features/
components/
store/
hooks/
lib/
services/
types/
```

## App

Contém as rotas da aplicação utilizando o App Router do Next.js.

```text
app/
├── page.tsx
├── login/
├── register/
├── questions/
└── profile/
```

## Features

Cada funcionalidade é organizada de forma isolada.

```text
features/
├── auth/
├── questions/
├── answers/
├── tags/
└── users/
```

Exemplo:

```text
features/questions/

components/
hooks/
services/
schemas/
types/
```

## Store

Gerenciamento de estados globais utilizando Zustand.

```text
store/

auth.store.ts
theme.store.ts
```

## Services

Responsável pela comunicação com a API.

```typescript
// services/api.ts

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

## Segurança de Markdown

As perguntas e respostas são armazenadas em Markdown.

Para evitar ataques XSS:

```typescript
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

<ReactMarkdown rehypePlugins={[rehypeSanitize]}>
  {content}
</ReactMarkdown>;
```

---

# Organização do Backend

O backend utiliza uma arquitetura modular simplificada.

Cada domínio possui:

* Controller
* Service
* Schema
* Contract
* Model

Estrutura:

```text
src/modules/

auth/
users/
questions/
answers/
tags/
reviews/
```

Exemplo:

```text
questions/

questions.controller.ts
questions.service.ts
questions.schema.ts
questions.contract.ts
questions.model.ts
```

---

# Fluxo de Responsabilidades

## Controller

Recebe requisições HTTP.

```typescript
POST /questions
GET /questions/:id
PATCH /questions/:id
DELETE /questions/:id
```

Responsável apenas por:

* Ler request
* Chamar services
* Retornar response

---

## Service

Contém regras de negócio.

Exemplos:

* Criar pergunta
* Editar pergunta
* Votar em pergunta
* Aceitar resposta
* Calcular reputação

---

## Schema

Validação de entrada usando Zod.

Exemplo:

```typescript
import { z } from "zod";

export const createQuestionSchema = z.object({
  title: z.string().min(10).max(150),
  body: z.string().min(30),
  tags: z.array(z.string()).max(5),
});
```

---

## Contract

Define a documentação OpenAPI da rota.

Exemplo:

```typescript
registry.registerPath({
  method: "post",
  path: "/questions",
  tags: ["Questions"],
});
```

---

## Model

Define a estrutura persistida no MongoDB.

Exemplo:

```typescript
const QuestionSchema = new mongoose.Schema({
  title: String,
  body: String,
  votes: Number,
});
```

---

# Sistema de Autenticação

O projeto utiliza JWT.

Fluxo:

```text
Login
 ↓
Validação de credenciais
 ↓
Geração do JWT
 ↓
Retorno para frontend
 ↓
Armazenamento seguro
 ↓
Envio via Authorization Header
```

Header esperado:

```http
Authorization: Bearer TOKEN
```

---

# Sistema de Reputação

Inspirado no Stack Overflow.

Ações previstas:

| Evento                        | Pontos |
| ----------------------------- | -----: |
| Pergunta recebe voto positivo |     +5 |
| Resposta recebe voto positivo |    +10 |
| Resposta aceita               |    +15 |
| Recebe voto negativo          |     -2 |

A reputação poderá ser utilizada para desbloquear funcionalidades específicas.

Exemplos:

| Reputação | Permissão                  |
| --------- | -------------------------- |
| 0         | Perguntar e responder      |
| 50        | Comentar                   |
| 200       | Editar posts da comunidade |
| 1000      | Ferramentas de moderação   |

---

# Sistema de Tags

As perguntas são categorizadas por tags.

Exemplos:

```text
javascript
typescript
react
nextjs
nodejs
mongodb
docker
```

Cada pergunta pode possuir até 5 tags.

---

# Documentação OpenAPI

A documentação da API é gerada automaticamente a partir dos Schemas e Contracts.

Gerar documentação:

```bash
npm run docs:generate
```

Arquivo gerado:

```text
docs/generated/openapi.yaml
```

Benefícios:

* Fonte única de verdade
* Tipagem consistente
* Integração com Swagger UI
* Integração com clientes OpenAPI

---

# Segurança

Medidas implementadas:

## Helmet

Proteção de headers HTTP.

```typescript
app.use(helmet());
```

## Rate Limit

Proteção contra spam e brute force.

```typescript
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

## Validação de Entrada

Todas as entradas são validadas utilizando Zod.

## Sanitização de Markdown

Prevenção contra XSS em perguntas e respostas.

---

# Banco de Dados

MongoDB utilizando Mongoose.

Coleções previstas:

```text
users
questions
answers
tags
reviews
```

Relacionamentos:

```text
User
 ├── Questions
 ├── Answers
 └── Reviews

Question
 ├── Author
 ├── Tags
 ├── Answers
 └── Votes

Answer
 ├── Author
 ├── Question
 └── Votes
```

---

# Infraestrutura com Docker

Subir todos os serviços:

```bash
docker-compose up -d
```

Serviços:

```text
Frontend (Next.js)
Backend (Express)
MongoDB
```

Parar ambiente:

```bash
docker-compose down
```

---

# Roadmap

## MVP

* [ ] Cadastro de usuários
* [ ] Login
* [ ] CRUD de perguntas
* [ ] CRUD de respostas
* [ ] Sistema de votos
* [ ] Tags
* [ ] Perfil de usuário

## Versão 2

* [ ] Comentários
* [ ] Resposta aceita
* [ ] Sistema de reputação
* [ ] Busca avançada
* [ ] Notificações

## Versão 3

* [ ] Moderação
* [ ] Relatórios administrativos
* [ ] Ranking de usuários
* [ ] Gamificação
* [ ] Badges

---

# Equipe

Projeto desenvolvido para a disciplina de Desenvolvimento de Software para Web.

Instituição: Universidade Federal do Ceará

Semestre: 2026.1

Integrantes:

* Álvaro Costa Lima Sales
* Álvaro Siqueira Galvão
* Fábio Agostinho Filho
* Samuel Sales Furtado
