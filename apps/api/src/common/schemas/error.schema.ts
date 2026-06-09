import { z } from 'zod';
import { registry } from '../openapi/registry';
 
// ---------------------------------------------------------------------------
// Base error shape
// ---------------------------------------------------------------------------
 
/**
 * Generic error body shared by all HTTP error responses.
 *
 * @example
 * {
 *   "message": "Resource not found.",
 *   "code": 404
 * }
 */
const ErrorSchema = z
  .object({
    message: z.string().openapi({
      description: 'Human-readable description of the error.',
      example: 'An unexpected error occurred.',
    }),
    code: z.number().int().openapi({
      description: 'HTTP status code mirrored inside the response body.',
      example: 400,
    }),
  })
  .openapi('Error');
 
/**
 * 400 Bad Request — malformed payload or failed validation.
 */
export const BadRequestSchema = registry.register(
  'BadRequest',
  ErrorSchema.extend({
    message: z.string().openapi({ example: 'Validation failed.' }),
    code: z.number().int().openapi({ example: 400 }),
  }).openapi('BadRequest'),
);
 
/**
 * 401 Unauthorized — missing or invalid authentication credentials.
 */
export const UnauthorizedSchema = registry.register(
  'Unauthorized',
  ErrorSchema.extend({
    message: z.string().openapi({ example: 'Authentication is required.' }),
    code: z.number().int().openapi({ example: 401 }),
  }).openapi('Unauthorized'),
);
 
/**
 * 403 Forbidden — authenticated but lacking the necessary permissions.
 */
export const ForbiddenSchema = registry.register(
  'Forbidden',
  ErrorSchema.extend({
    message: z
      .string()
      .openapi({ example: 'You do not have permission to access this resource.' }),
    code: z.number().int().openapi({ example: 403 }),
  }).openapi('Forbidden'),
);
 
/**
 * 404 Not Found — requested resource does not exist.
 */
export const NotFoundSchema = registry.register(
  'NotFound',
  ErrorSchema.extend({
    message: z.string().openapi({ example: 'The requested resource was not found.' }),
    code: z.number().int().openapi({ example: 404 }),
  }).openapi('NotFound'),
);
 
// ---------------------------------------------------------------------------
// Convenience map — use when wiring route response definitions
// ---------------------------------------------------------------------------
 
/**
 * Pre-built response entries for the four most common error status codes.
 *
 * @example
 * registry.registerPath({
 *   ...
 *   responses: {
 *     ...commonErrorResponses,
 *     200: { ... },
 *   },
 * });
 */
export const commonErrorResponses = {
  400: {
    description: 'Bad Request — the request payload is invalid or failed validation.',
    content: { 'application/json': { schema: BadRequestSchema } },
  },
  401: {
    description: 'Unauthorized — a valid authentication token is required.',
    content: { 'application/json': { schema: UnauthorizedSchema } },
  },
  403: {
    description: 'Forbidden — you lack the necessary permissions.',
    content: { 'application/json': { schema: ForbiddenSchema } },
  },
  404: {
    description: 'Not Found — the requested resource does not exist.',
    content: { 'application/json': { schema: NotFoundSchema } },
  },
} as const;
 