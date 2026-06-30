import { extendZodWithOpenApi, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import * as swaggerUi from 'swagger-ui-express';
import { connectToDatabase } from './config/db.config';
import { env } from './config/env.config';

import { authMiddleware, requireRole, requireReputation } from './common/middlewares/auth.middleware';
import { REPUTATION_THRESHOLDS } from './common/constants/reputation-thresholds';
import { validateRequest } from './common/middlewares/validate.middleware';
import { errorMiddleware } from './common/middlewares/error.middleware';
import { globalLimiter, authLimiter } from './common/middlewares/rate-limit.middleware';

// Contracts — registram paths no registry
import './modules/auth/auth.contract';
import './modules/reviews/reviews.contract';
import './modules/users/users.contract';
import './modules/tags/tags.contract';
import './modules/questions/questions.contract';
import './modules/answers/answers.contract';

import './common/openapi/security';
import { registry } from './common/openapi/registry';

// Controllers
import {
  loginController,
  registerController,
  socialAuthController,
  logoutController,
  sessionController,
} from './modules/auth/auth.controller';
import {
  reviewsListController,
  reviewsGetController,
  reviewsActionController,
} from './modules/reviews/reviews.controller';
import { QuestionsController } from './modules/questions/questions.controller';
import { AnswersController } from './modules/answers/answers.controller';
import { TagsController } from './modules/tags/tags.controller';
import { UsersController } from './modules/users/users.controller';
import { CommentsController } from './modules/comments/comments.controller';

// ── OpenAPI document ──────────────────────────────────────────────────────────
const generator = new OpenApiGeneratorV31(registry.definitions);
const openApiDocument = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'StackUnderflow API',
    version: '1.0.0',
    description: 'Community Q&A platform API inspired by Stack Overflow.',
  },
  servers: [{ url: `http://localhost:${env.PORT}`, description: 'Local Development' }],
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
app.use(cookieParser());
app.use(helmet()); // Adiciona headers de segurança
app.use(cors({ origin: env.CLIENT_URL, credentials: true })); // credentials: true permite enviar/receber o cookie httpOnly
app.use(globalLimiter); // Rate limiting global

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
app.post('/api/auth/logout', logoutController);
app.get('/api/auth/session', authMiddleware, sessionController);

// ── Rotas protegidas (requerem JWT) ───────────────────────────────────────────

// Reviews
app.get('/api/reviews',             authMiddleware, requireRole('established', 'moderator', 'admin'), reviewsListController);
app.get('/api/reviews/:id',         authMiddleware, requireRole('established', 'moderator', 'admin'), reviewsGetController);
app.post('/api/reviews/:id/action', authMiddleware, requireRole('established', 'moderator', 'admin'), reviewsActionController);

// Questions
const questionsController = new QuestionsController();

app.get('/api/questions',                     questionsController.list);
app.post('/api/questions',                    authMiddleware, questionsController.create);
app.get('/api/questions/:id',                 questionsController.getDetail);
app.put('/api/questions/:id',                 authMiddleware, questionsController.update);
app.delete('/api/questions/:id',              authMiddleware, questionsController.remove);
app.post('/api/questions/:id/vote',           authMiddleware, questionsController.vote);
app.post('/api/questions/:id/close',          authMiddleware, requireRole('moderator', 'admin'), questionsController.close);

// Answers
const answersController = new AnswersController();

app.get('/api/questions/:id/answers',         answersController.list);
app.post('/api/questions/:id/answers',        authMiddleware, answersController.create);
app.put('/api/answers/:id',                   authMiddleware, answersController.update);
app.delete('/api/answers/:id',                authMiddleware, answersController.remove);
app.post('/api/answers/:id/vote',             authMiddleware, answersController.vote);
app.post('/api/answers/:id/accept',           authMiddleware, answersController.accept);

// Comments
const commentsController = new CommentsController();

app.get('/api/questions/:id/comments',        commentsController.listForQuestion);
app.post('/api/questions/:id/comments',       authMiddleware, requireReputation(REPUTATION_THRESHOLDS.COMMENT), commentsController.createForQuestion);
app.get('/api/answers/:id/comments',          commentsController.listForAnswer);
app.post('/api/answers/:id/comments',         authMiddleware, requireReputation(REPUTATION_THRESHOLDS.COMMENT), commentsController.createForAnswer);

// Tags
const tagsController = new TagsController();

app.get('/api/tags',                          tagsController.list);
app.get('/api/tags/:id',                      tagsController.getDetail);
app.post('/api/tags',                         authMiddleware, requireReputation(REPUTATION_THRESHOLDS.CREATE_TAG), tagsController.create);
app.post('/api/users/me/tags/watch',          authMiddleware, tagsController.watchTags);
app.post('/api/users/me/tags/ignore',         authMiddleware, tagsController.ignoreTags);

// Users
const usersController = new UsersController();

app.get('/api/users',                         usersController.getUsers);
app.get('/api/users/:id',                     usersController.getUserById);
app.put('/api/users/me',                      authMiddleware, usersController.updateMe);
app.get('/api/users/:id/activity',            usersController.getActivity);
app.get('/api/users/me/dashboard',            authMiddleware, usersController.getDashboard);

// ── Tratamento de Erros Global ────────────────────────────────────────────────
app.use(errorMiddleware);

// ── Start ─────────────────────────────────────────────────────────────────────
async function start() {
  await connectToDatabase();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Swagger UI: http://localhost:${env.PORT}/docs`);
  });
}

start();
