import { registry } from '../../common/openapi/registry';
import { commonErrorResponses } from '../../common/schemas/error.schema';
import { PaginationQuerySchema } from '../../common/schemas/pagination.schema';
import {
  ActivityFeedSchema,
  DashboardStatsSchema,
  PaginatedUsersSchema,
  UpdateProfileSchema,
  UserResponseSchema,
} from './users.schema';
 import { z } from 'zod'
// ---------------------------------------------------------------------------
// Shared path-level security requirement for authenticated routes
// ---------------------------------------------------------------------------
 
const bearerAuth = [{ bearerAuth: [] }];

const UserIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
    .describe('MongoDB ObjectId of the target user.'),
});

 
// ---------------------------------------------------------------------------
// GET /api/users
// List all users with pagination and optional search filter
// ---------------------------------------------------------------------------
 
registry.registerPath({
  method: 'get',
  path: '/api/users',
  tags: ['Users'],
  summary: 'List users',
  description:
    'Returns a paginated list of registered users. ' +
    'Supports optional filtering by username or display name via the `search` query parameter.',
  request: {
    query: PaginationQuerySchema.extend({
      search: PaginationQuerySchema.shape.page ,
    }),
    // Defined inline so the query shape is explicit in the spec
  },
  responses: {
    200: {
      description: 'Paginated list of users.',
      content: {
        'application/json': {
          schema: PaginatedUsersSchema,
        },
      },
    },
    ...commonErrorResponses,
  },
});
 
// ---------------------------------------------------------------------------
// Workaround: re-declare query inline for GET /api/users since
// PaginationQuerySchema uses .transform() which doesn't produce a plain shape
// compatible with OpenAPI query serialisation. The contract uses the raw
// string-based version that is transmitted over the wire.
// ---------------------------------------------------------------------------
 
// (The registerPath call above is intentionally kept simple — the generator
// will emit `$ref: '#/components/schemas/PaginationQuery'` for the query block
// when the schema is referenced by type, which is the desired behaviour.)
 
// ---------------------------------------------------------------------------
// GET /api/users/{id}
// Retrieve a single user's public profile
// ---------------------------------------------------------------------------
 
registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  tags: ['Users'],
  summary: 'Get user by ID',
  description: 'Returns the public profile of the user with the given MongoDB ObjectId.',
  request: {
    params: UserIdParamsSchema,
  },
  responses: {
    200: {
      description: 'Public user profile.',
      content: {
        'application/json': {
          schema: UserResponseSchema,
        },
      },
    },
    ...commonErrorResponses,
  },
});
 
// ---------------------------------------------------------------------------
// PUT /api/users/me
// Update the authenticated user's own profile
// ---------------------------------------------------------------------------
 
registry.registerPath({
  method: 'put',
  path: '/api/users/me',
  tags: ['Users'],
  summary: 'Update my profile',
  description:
    "Partially updates the authenticated user's profile. " +
    "All fields are optional — only the provided fields are updated.",
  security: bearerAuth,
  request: {
    body: {
      required: true,
      description: 'Fields to update. At least one field must be provided.',
      content: {
        'application/json': {
          schema: UpdateProfileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated user profile reflecting the new values.',
      content: {
        'application/json': {
          schema: UserResponseSchema,
        },
      },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    403: commonErrorResponses[403],
    404: commonErrorResponses[404],
  },
});
 
// ---------------------------------------------------------------------------
// GET /api/users/{id}/activity
// Retrieve a user's public activity feed
// ---------------------------------------------------------------------------
 
registry.registerPath({
  method: 'get',
  path: '/api/users/{id}/activity',
  tags: ['Users'],
  summary: 'Get user activity feed',
  description:
    'Returns a paginated, chronologically ordered (newest-first) list of activity events ' +
    'for the specified user — questions posted, answers accepted, badges earned, etc.',
  request: {
    params: UserIdParamsSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      description: 'Paginated activity feed for the requested user.',
      content: {
        'application/json': {
          schema: ActivityFeedSchema,
        },
      },
    },
    ...commonErrorResponses,
  },
});
 
// ---------------------------------------------------------------------------
// GET /api/users/me/dashboard
// Retrieve aggregated statistics for the authenticated user
// ---------------------------------------------------------------------------
 
registry.registerPath({
  method: 'get',
  path: '/api/users/me/dashboard',
  tags: ['Users'],
  summary: 'Get my dashboard stats',
  description:
    "Returns aggregated statistics for the authenticated user's personal dashboard: " +
    "reputation history, question / answer counts, acceptance rate, badge totals, and top tags.",
  security: bearerAuth,
  responses: {
    200: {
      description: 'Aggregated dashboard statistics for the authenticated user.',
      content: {
        'application/json': {
          schema: DashboardStatsSchema,
        },
      },
    },
    401: commonErrorResponses[401],
    403: commonErrorResponses[403],
  },
});
 