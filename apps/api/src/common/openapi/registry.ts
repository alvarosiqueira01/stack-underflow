import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
 
/**
 * Central OpenAPI registry — the single source of truth for all schemas and
 * route definitions across every module of this application.
 *
 * Usage pattern
 * -------------
 * Import `registry` in any module file and call:
 *   - `registry.register(name, zodSchema)`   → registers a reusable component
 *   - `registry.registerPath({ ... })`       → registers an operation
 *
 * The generator in `openapi.generator.ts` will read from this instance to
 * produce the final OpenAPI 3.1 document.
 */
export const registry = new OpenAPIRegistry();