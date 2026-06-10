import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { commonErrorResponses } from '../../common/schemas/error.schema';
import {
  ReviewActionResponseSchema,
  ReviewActionSchema,
  ReviewQueueSchema,
  ReviewTaskSchema,
} from './reviews.schema';

const bearerAuth = [{ bearerAuth: [] }];

// ---------------------------------------------------------------------------
// GET /api/reviews
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/reviews',
  tags: ['Reviews'],
  summary: 'List active review queues',
  description:
    'Returns all moderation queues (Suggested Edits, Close Votes, Low Quality Posts) ' +
    'along with the number of tasks pending review in each one. ' +
    'Requires the user to have sufficient reputation to access review queues.',
  security: bearerAuth,
  responses: {
    200: {
      description: 'List of active review queues with pending task counts.',
      content: {
        'application/json': {
          schema: z.array(ReviewQueueSchema),
        },
      },
    },
    401: commonErrorResponses[401],
    403: {
      description: 'Forbidden — insufficient reputation to access review queues.',
      content: commonErrorResponses[403].content,
    },
  },
});

// ---------------------------------------------------------------------------
// GET /api/reviews/{id}
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/reviews/{id}',
  tags: ['Reviews'],
  summary: 'Get review task details',
  description:
    'Returns the full detail of a single review task, including the field-level diff ' +
    'between the original content and the suggested edit.',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
        .openapi({
          description: 'MongoDB ObjectId of the review task.',
          example: '665f1a2b3c4d5e6f7a8b9c0d',
        }),
    }),
  },
  responses: {
    200: {
      description: 'Review task found — detail with diff returned.',
      content: { 'application/json': { schema: ReviewTaskSchema } },
    },
    401: commonErrorResponses[401],
    404: commonErrorResponses[404],
  },
});

// ---------------------------------------------------------------------------
// POST /api/reviews/{id}/action
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/reviews/{id}/action',
  tags: ['Reviews'],
  summary: 'Submit a review decision',
  description:
    'Records the authenticated reviewer\'s decision for a pending review task. ' +
    'Possible actions: **approve**, **reject** (requires `rejectionReasons`), ' +
    '**improve**, or **skip**. ' +
    'Requires high reputation — only Established Users and above may review.',
  security: bearerAuth,
  request: {
    params: z.object({
      id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
        .openapi({
          description: 'MongoDB ObjectId of the review task to act upon.',
          example: '665f1a2b3c4d5e6f7a8b9c0d',
        }),
    }),
    body: {
      required: true,
      description: 'Review decision with optional rejection reasons.',
      content: { 'application/json': { schema: ReviewActionSchema } },
    },
  },
  responses: {
    200: {
      description: 'Decision recorded — confirmation returned.',
      content: { 'application/json': { schema: ReviewActionResponseSchema } },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    403: {
      description: 'Forbidden — insufficient reputation to submit a review.',
      content: commonErrorResponses[403].content,
    },
    404: commonErrorResponses[404],
  },
});
