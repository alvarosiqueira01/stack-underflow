import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { commonErrorResponses } from '../../common/schemas/error.schema';
import { PaginationQuerySchema } from '../../common/schemas/pagination.schema';
import {
  CreateTagSchema,
  PaginatedTagsSchema,
  TagDetailsSchema,
  TagPreferencesResponseSchema,
  TagWatchIgnoreBodySchema,
} from './tags.schema';

// ---------------------------------------------------------------------------
// Shared security requirement for authenticated routes
// ---------------------------------------------------------------------------

const bearerAuth = [{ bearerAuth: [] }];

// ---------------------------------------------------------------------------
// Shared query schema for tag listing
// Extends global pagination with a `search` and `sort` parameter.
// ---------------------------------------------------------------------------

/**
 * Query parameters accepted by `GET /api/tags`.
 * Registered as a reusable component so the generator emits a clean $ref.
 */
const TagsQuerySchema = registry.register(
  'TagsQuery',
  z
    .object({
      page: z
        .string()
        .optional()
        .default('1')
        .openapi({ description: 'Page number (1-indexed).', example: '1' }),
      limit: z
        .string()
        .optional()
        .default('20')
        .openapi({ description: 'Items per page (1–100).', example: '20' }),
      search: z
        .string()
        .optional()
        .openapi({
          description:
            'Free-text filter applied to tag names and descriptions. ' +
            'Case-insensitive prefix match.',
          example: 'type',
        }),
      sort: z
        .enum(['popular', 'name', 'newest'])
        .optional()
        .default('popular')
        .openapi({
          description:
            '`popular` — order by total question count (desc). ' +
            '`name` — alphabetical order. ' +
            '`newest` — order by creation date (desc).',
          example: 'popular',
        }),
    })
    .openapi('TagsQuery'),
);

// ---------------------------------------------------------------------------
// GET /api/tags
// Paginated list of tags with search and sort
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/tags',
  tags: ['Tags'],
  summary: 'List tags',
  description:
    'Returns a paginated, searchable list of all tags. ' +
    'Use the `search` parameter to filter by name or description, and `sort` to control ordering.',
  request: {
    query: TagsQuerySchema,
  },
  responses: {
    200: {
      description: 'Paginated list of tags.',
      content: {
        'application/json': {
          schema: PaginatedTagsSchema,
        },
      },
    },
    ...commonErrorResponses,
  },
});

// ---------------------------------------------------------------------------
// GET /api/tags/{id}
// Full tag details including wiki body and related tags
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/tags/{id}',
  tags: ['Tags'],
  summary: 'Get tag details',
  description:
    'Returns the full detail view for a tag, including its wiki body (Markdown), ' +
    'usage statistics, related tags and assigned moderators.',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'MongoDB ObjectId or URL-safe name of the tag.',
        example: '665f1a2b3c4d5e6f7a8b9c10',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Full tag detail object.',
      content: {
        'application/json': {
          schema: TagDetailsSchema,
        },
      },
    },
    ...commonErrorResponses,
  },
});

// ---------------------------------------------------------------------------
// POST /api/tags
// Create a new tag — requires Established User status (reputation ≥ 200)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/tags',
  tags: ['Tags'],
  summary: 'Create a tag',
  description:
    'Creates a new tag in the system. ' +
    '\n\n' +
    '> **Established User required** — the authenticated user must have a reputation ' +
    'of **200 or above** to create tags. Requests from users below this threshold ' +
    'will receive a `403 Forbidden` response.\n\n' +
    'Tag names must be unique, URL-safe (lowercase letters, digits and hyphens) ' +
    'and between 1 and 35 characters long.',
  security: bearerAuth,
  request: {
    body: {
      required: true,
      description: 'Tag name, description and optional wiki body.',
      content: {
        'application/json': {
          schema: CreateTagSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Tag created successfully. Returns the full detail object of the new tag.',
      content: {
        'application/json': {
          schema: TagDetailsSchema,
        },
      },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    403: {
      description:
        "Forbidden — either the token is invalid, or the user's reputation " +
        "is below the 200-point threshold required to create tags.",
      content: commonErrorResponses[403].content,
    },
    409: {
      description: 'Conflict — a tag with this name already exists.',
      content: {
        'application/json': {
          schema: z
            .object({
              message: z.string().openapi({ example: "Tag 'typescript' already exists." }),
              code: z.number().int().openapi({ example: 409 }),
            })
            .openapi('ConflictError'),
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// POST /api/users/me/tags/watch
// Add tags to the authenticated user's watch list
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/users/me/tags/watch',
  tags: ['Tags', 'Users'],
  summary: 'Watch tags',
  description:
    "Adds one or more tags to the authenticated user's **watch list**. " +
    "Watched tags are used to personalise the question feed and send notifications. " +
    "Tags already being watched are silently ignored (idempotent). " +
    "Sending a tag that is currently on the **ignore list** will move it to watched.",
  security: bearerAuth,
  request: {
    body: {
      required: true,
      description: 'Array of tag names to add to the watch list (1–20 per request).',
      content: {
        'application/json': {
          schema: TagWatchIgnoreBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description:
        'Watch list updated. Returns the complete, updated tag preference lists.',
      content: {
        'application/json': {
          schema: TagPreferencesResponseSchema,
        },
      },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    404: {
      description: 'Not Found — one or more of the supplied tag names do not exist.',
      content: commonErrorResponses[404].content,
    },
  },
});

// ---------------------------------------------------------------------------
// POST /api/users/me/tags/ignore
// Add tags to the authenticated user's ignore list
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/users/me/tags/ignore',
  tags: ['Tags', 'Users'],
  summary: 'Ignore tags',
  description:
    "Adds one or more tags to the authenticated user's **ignore list**. " +
    "Questions carrying only ignored tags are hidden from the user's feed. " +
    "Tags already being ignored are silently skipped (idempotent). " +
    "Sending a tag that is currently on the **watch list** will move it to ignored.",
  security: bearerAuth,
  request: {
    body: {
      required: true,
      description: 'Array of tag names to add to the ignore list (1–20 per request).',
      content: {
        'application/json': {
          schema: TagWatchIgnoreBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description:
        'Ignore list updated. Returns the complete, updated tag preference lists.',
      content: {
        'application/json': {
          schema: TagPreferencesResponseSchema,
        },
      },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    404: {
      description: 'Not Found — one or more of the supplied tag names do not exist.',
      content: commonErrorResponses[404].content,
    },
  },
});