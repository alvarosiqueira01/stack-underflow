import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { buildPaginatedSchema } from '../../common/schemas/pagination.schema';
 
// ---------------------------------------------------------------------------
// TagStats — embedded in TagSchema
// ---------------------------------------------------------------------------
 
/**
 * Usage statistics for a single tag.
 * Gives users a quick sense of how active a tag is.
 */
export const TagStatsSchema = registry.register(
  'TagStats',
  z
    .object({
      questionsCount: z.number().int().nonnegative().openapi({
        description: 'Total number of questions that carry this tag.',
        example: 1_420,
      }),
      questionsThisWeek: z.number().int().nonnegative().openapi({
        description: 'Number of questions tagged in the past 7 days.',
        example: 38,
      }),
      questionsThisMonth: z.number().int().nonnegative().openapi({
        description: 'Number of questions tagged in the past 30 days.',
        example: 172,
      }),
      watchersCount: z.number().int().nonnegative().openapi({
        description: 'Number of users who are watching this tag.',
        example: 3_210,
      }),
    })
    .openapi('TagStats'),
);
 
// ---------------------------------------------------------------------------
// TagSchema — public list representation
// ---------------------------------------------------------------------------
 
/**
 * Compact representation of a tag returned in list responses.
 * Includes name, description and usage statistics.
 */
export const TagSchema = registry.register(
  'Tag',
  z
    .object({
      id: z.string().openapi({
        description: 'MongoDB ObjectId of the tag.',
        example: '665f1a2b3c4d5e6f7a8b9c10',
      }),
      name: z
        .string()
        .min(1)
        .max(35)
        .regex(/^[a-z0-9-]+$/)
        .openapi({
          description:
            'URL-safe tag name — lowercase letters, digits and hyphens only (1–35 chars).',
          example: 'typescript',
        }),
      description: z.string().max(500).nullable().openapi({
        description:
          'Short description of what the tag represents (max 500 chars). ' +
          'Null when no description has been written yet.',
        example:
          'TypeScript is a strongly typed programming language that builds on JavaScript.',
      }),
      stats: TagStatsSchema,
      createdAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of when the tag was created.',
        example: '2023-09-01T08:00:00.000Z',
      }),
    })
    .openapi('Tag'),
);
 
// ---------------------------------------------------------------------------
// TagDetails — rich single-tag response (GET /api/tags/{id})
// ---------------------------------------------------------------------------
 
/**
 * Full tag detail including its wiki body (long-form Markdown description)
 * and related tags — returned only on the individual tag endpoint.
 */
export const TagDetailsSchema = registry.register(
  'TagDetails',
  TagSchema.extend({
    wikiBody: z.string().nullable().openapi({
      description:
        'Full Markdown wiki body for the tag. ' +
        'May include usage guidance, links and code examples. ' +
        'Null when no wiki has been written yet.',
      example:
        '## TypeScript\n\nTypeScript is a superset of JavaScript that adds optional static typing...',
    }),
    relatedTags: z
      .array(
        z.object({
          id: z.string().openapi({ example: '665f1a2b3c4d5e6f7a8b9c11' }),
          name: z.string().openapi({ example: 'javascript' }),
        }),
      )
      .max(10)
      .openapi({
        description: 'Up to 10 tags frequently used together with this tag.',
      }),
    moderators: z
      .array(
        z.object({
          id: z.string().openapi({ example: '665f1a2b3c4d5e6f7a8b9c0d' }),
          name: z.string().openapi({ example: 'Ada Lovelace' }),
          avatarUrl: z.string().url().nullable().openapi({
            example: 'https://cdn.stackunderflow.dev/avatars/ada_lovelace.webp',
          }),
        }),
      )
      .openapi({
        description: 'Users designated as moderators / curators for this tag.',
      }),
  }).openapi('TagDetails'),
);
 
// ---------------------------------------------------------------------------
// PaginatedTags  (reuses the shared factory)
// ---------------------------------------------------------------------------
 
/**
 * Paginated list of tags — used by `GET /api/tags`.
 */
export const PaginatedTagsSchema = buildPaginatedSchema(TagSchema, 'PaginatedTags');
 
// ---------------------------------------------------------------------------
// CreateTag — request body for POST /api/tags
// ---------------------------------------------------------------------------
 
/**
 * Request body accepted by `POST /api/tags`.
 *
 * @remarks
 * Creating a tag requires the user to be an **Established User** (reputation ≥ 200),
 * as enforced by the service layer. The API returns 403 when this threshold
 * is not met.
 */
export const CreateTagSchema = registry.register(
  'CreateTag',
  z
    .object({
      name: z
        .string()
        .min(1)
        .max(35)
        .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, digits and hyphens are allowed.')
        .openapi({
          description:
            'Unique tag name — lowercase letters, digits and hyphens only (1–35 chars). ' +
            'Must not already exist in the system.',
          example: 'drizzle-orm',
        }),
      description: z.string().max(500).optional().openapi({
        description: 'Short description for the tag (max 500 chars). Recommended but optional.',
        example: 'Drizzle ORM is a TypeScript ORM for SQL databases.',
      }),
      wikiBody: z.string().optional().openapi({
        description:
          'Optional initial Markdown wiki body. ' +
          'Can be added or updated later by moderators.',
        example: '## Drizzle ORM\n\nDrizzle is a headless TypeScript ORM...',
      }),
    })
    .openapi('CreateTag'),
);
 
// ---------------------------------------------------------------------------
// TagWatchIgnoreBody — shared body for watch / ignore endpoints
// ---------------------------------------------------------------------------
 
/**
 * Request body accepted by `POST /api/users/me/tags/watch`
 * and `POST /api/users/me/tags/ignore`.
 *
 * Accepts an array of tag names so a user can manage multiple preferences
 * in a single round-trip.
 */
export const TagWatchIgnoreBodySchema = registry.register(
  'TagWatchIgnoreBody',
  z
    .object({
      tags: z
        .array(
          z.string().min(1).max(35).regex(/^[a-z0-9-]+$/).openapi({
            example: 'typescript',
          }),
        )
        .min(1)
        .max(20)
        .openapi({
          description:
            'Array of tag names to watch or ignore (1–20 per request). ' +
            'Tag names must already exist in the system.',
          example: ['typescript', 'nodejs', 'mongodb'],
        }),
    })
    .openapi('TagWatchIgnoreBody'),
);
 
// ---------------------------------------------------------------------------
// TagPreferencesResponse — response for watch / ignore endpoints
// ---------------------------------------------------------------------------
 
/**
 * Updated tag preference lists returned after a watch / ignore operation.
 */
export const TagPreferencesResponseSchema = registry.register(
  'TagPreferencesResponse',
  z
    .object({
      watchedTags: z.array(z.string()).openapi({
        description: 'Complete updated list of tag names the user is watching.',
        example: ['typescript', 'nodejs', 'mongodb'],
      }),
      ignoredTags: z.array(z.string()).openapi({
        description: 'Complete updated list of tag names the user is ignoring.',
        example: ['php', 'jquery'],
      }),
    })
    .openapi('TagPreferencesResponse'),
);
 