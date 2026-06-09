import 'reflect-metadata';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const express = require('express');
import * as swaggerUi from 'swagger-ui-express';

import * as path from 'path';

// import './modules/auth/auth.contract';

import './modules/users/users.contract';

import './modules/tags/tags.contract';

// import './modules/questions/questions.contract';

// import './modules/answers/answers.contract';

// import './modules/reviews/reviews.contract';

import './common/openapi/security';
import { OpenAPIObject } from 'openapi3-ts/oas31';

const app = express();

app.use(express.json());
import { registry } from './common/openapi/registry';

console.log(registry.definitions);
const openApiDocument: OpenAPIObject = require(path.join(__dirname, '../../scripts/generate-openapi')).openApiDocument;

// SWAGGER UI
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    explorer: true,
    customSiteTitle: 'StackUnderflow API Docs',
  }),
);

app.get('/openapi.json', (_: any, res: { json: (arg0: OpenAPIObject) => void; }) => {
  res.json(openApiDocument);
});

app.get('/', (_: any, res: { json: (arg0: { name: string; docs: string; openapi: string; }) => void; }) => {
  res.json({
    name: 'StackUnderflow API',
    docs: '/docs',
    openapi: '/openapi.json',
  });
});

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`,
  );

  console.log(
    `Swagger UI available at http://localhost:${PORT}/docs`,
  );

  console.log(
    `OpenAPI JSON available at http://localhost:${PORT}/openapi.json`,
  );
});