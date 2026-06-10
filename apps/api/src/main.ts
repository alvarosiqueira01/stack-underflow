import { extendZodWithOpenApi, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

import express from 'express';
import * as swaggerUi from 'swagger-ui-express';

// Contracts — each import registers paths into the registry
import './modules/auth/auth.contract';
import './modules/reviews/reviews.contract';
import './modules/users/users.contract';
import './modules/tags/tags.contract';
// import './modules/questions/questions.contract';
// import './modules/answers/answers.contract';

import './common/openapi/security';
import { registry } from './common/openapi/registry';

// Generate OpenAPI document from registry
const generator = new OpenApiGeneratorV31(registry.definitions);
const openApiDocument = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'StackUnderflow API',
    version: '1.0.0',
    description: 'Community Q&A platform API inspired by Stack Overflow.',
  },
  servers: [{ url: 'http://localhost:8080', description: 'Local Development' }],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Questions' },
    { name: 'Answers' },
    { name: 'Reviews' },
    { name: 'Tags' },
  ],
});

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve as any, swaggerUi.setup(openApiDocument, {
  explorer: true,
  customSiteTitle: 'StackUnderflow API Docs',
}) as any);

app.get('/openapi.json', (_req, res) => {
  res.json(openApiDocument);
});

app.get('/', (_req, res) => {
  res.json({
    name: 'StackUnderflow API',
    docs: '/docs',
    openapi: '/openapi.json',
  });
});

const PORT = process.env.PORT ?? 8081;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
  console.log(`OpenAPI JSON available at http://localhost:${PORT}/openapi.json`);
});
