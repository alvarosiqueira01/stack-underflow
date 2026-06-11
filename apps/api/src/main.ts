import { extendZodWithOpenApi, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './config/db.config';
import { env } from './config/env.config';
import { authMiddleware } from './common/middlewares/auth.middleware';

// Contracts — registram paths no registry
import './modules/auth/auth.contract';
import './modules/reviews/reviews.contract';
import './modules/users/users.contract';
import './modules/tags/tags.contract';
// import './modules/questions/questions.contract';
// import './modules/answers/answers.contract';

import './common/openapi/security';
import { registry } from './common/openapi/registry';

// Controllers
import {
  loginController,
  registerController,
  socialAuthController,
} from './modules/auth/auth.controller';

// ── OpenAPI document ──────────────────────────────────────────────────────────
const generator = new OpenApiGeneratorV31(registry.definitions);
const openApiDocument = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'StackUnderflow API',
    version: '1.0.0',
    description: 'Community Q&A platform API inspired by Stack Overflow.',
  },
  servers: [{ url: `http://localhost:${env.port}`, description: 'Local Development' }],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Questions' },
    { name: 'Answers' },
    { name: 'Reviews' },
    { name: 'Tags' },
  ],
});

// ── App 
const app = express();
app.use(express.json());

// Swagger UI
app.use('/docs', swaggerUi.serve as any, swaggerUi.setup(openApiDocument, {
  explorer: true,
  customSiteTitle: 'StackUnderflow API Docs',
}) as any);

app.get('/openapi.json', (_req, res) => res.json(openApiDocument));
app.get('/', (_req, res) => res.json({ name: 'StackUnderflow API', docs: '/docs' }));

// ── Rotas públicas ────────────────────────────────────────────────────────────
app.post('/api/auth/login', loginController);
app.post('/api/auth/register', registerController);
app.post('/api/auth/social', socialAuthController);

// ── Rotas protegidas (requerem JWT) ───────────────────────────────────────────
// Exemplo — descomentar conforme os módulos forem implementados:
// app.get('/api/users/me/dashboard', authMiddleware, usersDashboardController);
// app.put('/api/users/me', authMiddleware, usersUpdateController);
// app.post('/api/questions', authMiddleware, questionsCreateController);
// app.delete('/api/questions/:id', authMiddleware, requireRole('moderator'), questionsDeleteController);
// app.get('/api/reviews', authMiddleware, reviewsListController);

// ── Start ─────────────────────────────────────────────────────────────────────
async function start() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`Swagger UI: http://localhost:${env.port}/docs`);
  });
}

start();
