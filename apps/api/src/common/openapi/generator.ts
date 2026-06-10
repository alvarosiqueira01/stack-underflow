import {
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';

import { registry } from './registry';

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(
    registry.definitions,
  );

  return generator.generateDocument({
    openapi: '3.1.0',

    info: {
      title: 'StackUnderflow API',
      version: '1.0.0',
      description:
        'Community Q&A platform API inspired by Stack Overflow.',
    },

    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Local Development',
      },
    ],

    tags: [
      {
        name: 'Auth',
      },
      {
        name: 'Users',
      },
      {
        name: 'Questions',
      },
      {
        name: 'Answers',
      },
      {
        name: 'Reviews',
      },
      {
        name: 'Tags',
      },
    ],
  });
}