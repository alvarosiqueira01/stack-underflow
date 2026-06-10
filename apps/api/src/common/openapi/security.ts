import { registry } from './registry';

registry.registerComponent(
  'securitySchemes',
  'bearerAuth',
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description:
      'JWT access token. Example: Bearer eyJhbGciOiJIUzI1NiIs...',
  },
);