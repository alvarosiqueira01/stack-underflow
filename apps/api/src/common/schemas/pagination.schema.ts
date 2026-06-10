import { z } from 'zod';
import { registry } from '../openapi/registry';
 
// ---------------------------------------------------------------------------
// Query-parameter schema
// ---------------------------------------------------------------------------
 
/**
 * Standard pagination query parameters accepted by every list endpoint.
 *
 * Usage — destructure inside your route handler:
 * @example
 * const { page, limit } = PaginationQuerySchema.parse(req.query);
 */
// export const PaginationQuerySchema = registry.register(
//   'PaginationQuery',
//   z
//     .object({
//       page: z
//         .string()
//         .optional()
//         .default('1')
//         .transform(Number)
//         .pipe(
//           z
//             .number()
//             .int()
//             .positive()
//             .openapi({
//               description: 'Page number (1-indexed).',
//               example: 1,
//             }),
//         )
//         .openapi('page'),
 
//       limit: z
//         .string()
//         .optional()
//         .default('20')
//         .transform(Number)
//         .pipe(
//           z
//             .number()
//             .int()
//             .min(1)
//             .max(100)
//             .openapi({
//               description: 'Number of items per page (max 100).',
//               example: 20,
//             }),
//         )
//         .openapi('limit'),
//     })
//     .openapi('PaginationQuery'),
// );
 
export const PaginationQuerySchema = registry.register(
  'PaginationQuery',
  z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
);
// ---------------------------------------------------------------------------
// Pagination meta (embedded in every paginated response)
// ---------------------------------------------------------------------------
 
/**
 * Metadata block that accompanies every paginated list response.
 */
export const PaginationMetaSchema = registry.register(
  'PaginationMeta',
  z
    .object({
      page: z.number().int().positive().openapi({
        description: 'Current page number.',
        example: 1,
      }),
      limit: z.number().int().positive().openapi({
        description: 'Number of items returned per page.',
        example: 20,
      }),
      total: z.number().int().nonnegative().openapi({
        description: 'Total number of items matching the query (across all pages).',
        example: 340,
      }),
      totalPages: z.number().int().nonnegative().openapi({
        description: 'Total number of pages given the current limit.',
        example: 17,
      }),
      hasNextPage: z.boolean().openapi({
        description: 'Whether a subsequent page exists.',
        example: true,
      }),
      hasPreviousPage: z.boolean().openapi({
        description: 'Whether a previous page exists.',
        example: false,
      }),
    })
    .openapi('PaginationMeta'),
);
 
// ---------------------------------------------------------------------------
// Generic paginated response factory
// ---------------------------------------------------------------------------
 
/**
 * Builds a typed, registered paginated-response schema for a given item schema.
 *
 * @param itemSchema  - Zod schema that describes a single item in the list.
 * @param componentName - Name used to register the wrapper as an OpenAPI component.
 *
 * @example
 * // In the users module:
 * export const PaginatedUsersSchema = buildPaginatedSchema(UserSchema, 'PaginatedUsers');
 *
 * // In the questions module:
 * export const PaginatedQuestionsSchema = buildPaginatedSchema(QuestionSchema, 'PaginatedQuestions');
 */
export function buildPaginatedSchema<T extends z.ZodTypeAny>(
  itemSchema: T,
  componentName: string,
) {
  return registry.register(
    componentName,
    z
      .object({
        data: z.array(itemSchema).openapi({
          description: 'Array of items for the current page.',
        }),
        meta: PaginationMetaSchema.openapi({
          description: 'Pagination metadata.',
        }),
      })
      .openapi(componentName),
  );
}
 