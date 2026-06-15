import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { commonErrorResponses } from '../../common/schemas/error.schema';
import {
  CloseQuestionSchema,
  CommentSchema,
  CreateCommentSchema,
  CreateQuestionSchema,
  FlagResponseSchema,
  FlagSchema,
  PaginatedQuestionsSchema,
  QuestionSchema,
  UpdateQuestionSchema,
  VoteResultSchema,
  VoteSchema,
} from './questions.schema';

// ---------------------------------------------------------------------------
// Shared security requirement for authenticated routes
// ---------------------------------------------------------------------------

const bearerAuth = [{ bearerAuth: [] }];

// ---------------------------------------------------------------------------
// Shared `id` path parameter
// ---------------------------------------------------------------------------

const questionIdParam = z.object({
  id: z.string().openapi({
    description: 'MongoDB ObjectId of the question.',
    example: '665f1a2b3c4d5e6f7a8b9c01',
  }),
});

// ---------------------------------------------------------------------------
// Query schema for GET /api/questions
// ---------------------------------------------------------------------------

/**
 * Query parameters accepted by `GET /api/questions`.
 * Extends global pagination with search and sort/filter controls.
 */
const QuestionsQuerySchema = registry.register(
  'QuestionsQuery',
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
      search: z.string().optional().openapi({
        description: 'Free-text search applied to question titles and bodies.',
        example: 'monad typescript',
      }),
      tag: z.string().optional().openapi({
        description: 'Filter results to questions containing this tag.',
        example: 'typescript',
      }),
      sort: z
        .enum(['newest', 'active', 'votes', 'unanswered'])
        .optional()
        .default('newest')
        .openapi({
          description:
            '`newest` — most recently created first. ' +
            '`active` — most recently updated/answered/commented first. ' +
            '`votes` — highest net votes first. ' +
            '`unanswered` — questions with zero answers, newest first.',
          example: 'newest',
        }),
    })
    .openapi('QuestionsQuery'),
);

// ---------------------------------------------------------------------------
// GET /api/questions
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/questions',
  tags: ['Questions'],
  summary: 'List questions',
  description:
    'Returns a paginated list of questions. ' +
    'Supports free-text `search`, filtering by `tag`, and ordering via `sort` ' +
    '(`newest`, `active`, `votes`, or `unanswered`).',
  request: {
    query: QuestionsQuerySchema,
  },
  responses: {
    200: {
      description: 'Paginated list of questions.',
      content: {
        'application/json': {
          schema: PaginatedQuestionsSchema,
        },
      },
    },
    ...commonErrorResponses,
  },
});

// ---------------------------------------------------------------------------
// POST /api/questions
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/questions',
  tags: ['Questions'],
  summary: 'Create a question',
  description:
    'Creates a new question. Available to any authenticated user ' +
    '(no minimum reputation required — "Perguntar e responder" is the base permission tier).',
  security: bearerAuth,
  request: {
    body: {
      required: true,
      description: 'Title, body and tags for the new question.',
      content: {
        'application/json': {
          schema: CreateQuestionSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Question created successfully.',
      content: {
        'application/json': {
          schema: QuestionSchema,
        },
      },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
  },
});

// ---------------------------------------------------------------------------
// GET /api/questions/{id}
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/questions/{id}',
  tags: ['Questions'],
  summary: 'Get question details',
  description:
    'Returns the full detail view for a single question, including author, tags, ' +
    'vote totals, answer count and moderation status. Viewing a question increments its view counter.',
  request: {
    params: questionIdParam,
  },
  responses: {
    200: {
      description: 'Full question detail object.',
      content: {
        'application/json': {
          schema: QuestionSchema,
        },
      },
    },
    ...commonErrorResponses,
  },
});

// ---------------------------------------------------------------------------
// PUT /api/questions/{id}
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'put',
  path: '/api/questions/{id}',
  tags: ['Questions'],
  summary: 'Edit a question',
  description:
    'Updates the title, body and/or tags of a question. ' +
    '\n\n' +
    'Allowed for the question`s original author at any time, or for users with a ' +
    'reputation of **200 or above** ("Editar posts da comunidade" permission tier) ' +
    'editing any question.',
  security: bearerAuth,
  request: {
    params: questionIdParam,
    body: {
      required: true,
      description: 'Fields to update. All fields are optional — at least one must be provided.',
      content: {
        'application/json': {
          schema: UpdateQuestionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated question object.',
      content: {
        'application/json': {
          schema: QuestionSchema,
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
// DELETE /api/questions/{id}
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'delete',
  path: '/api/questions/{id}',
  tags: ['Questions'],
  summary: 'Delete a question',
  description:
    'Permanently removes a question and its associated answers and comments. ' +
    '\n\n' +
    '> **Moderator role required** — this action is restricted to users with ' +
    'moderation privileges (reputation ≥ 1000). The original author **cannot** ' +
    'delete a question once it has received answers; in that case the request ' +
    'will receive a `403 Forbidden` response.',
  security: bearerAuth,
  request: {
    params: questionIdParam,
  },
  responses: {
    204: {
      description: 'Question deleted successfully. No content is returned.',
    },
    401: commonErrorResponses[401],
    403: {
      description:
        'Forbidden — the authenticated user does not have the moderator role ' +
        'required to delete this question.',
      content: commonErrorResponses[403].content,
    },
    404: commonErrorResponses[404],
  },
});

// ---------------------------------------------------------------------------
// POST /api/questions/{id}/vote
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/questions/{id}/vote',
  tags: ['Questions'],
  summary: 'Vote on a question',
  description:
    'Casts an upvote (`value: 1`) or downvote (`value: -1`) on the question. ' +
    'Sending the same value as the user`s current vote removes it (toggle behaviour). ' +
    '\n\n' +
    'Reputation effects: the question author gains **+5** for each upvote and ' +
    'loses **-2** for each downvote received.',
  security: bearerAuth,
  request: {
    params: questionIdParam,
    body: {
      required: true,
      content: {
        'application/json': {
          schema: VoteSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Vote registered. Returns the updated vote totals and the user`s vote state.',
      content: {
        'application/json': {
          schema: VoteResultSchema,
        },
      },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    404: commonErrorResponses[404],
  },
});

// ---------------------------------------------------------------------------
// POST /api/questions/{id}/comments
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/questions/{id}/comments',
  tags: ['Questions'],
  summary: 'Comment on a question',
  description:
    'Adds a comment to the question. ' +
    '\n\n' +
    'Requires a reputation of **50 or above** ("Comentar" permission tier).',
  security: bearerAuth,
  request: {
    params: questionIdParam,
    body: {
      required: true,
      content: {
        'application/json': {
          schema: CreateCommentSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Comment created successfully.',
      content: {
        'application/json': {
          schema: CommentSchema,
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
// POST /api/questions/{id}/flag
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/questions/{id}/flag',
  tags: ['Questions'],
  summary: 'Flag a question for moderator review',
  description:
    'Reports the question to moderators for review (e.g. spam, duplicate, off-topic content). ' +
    'Available to any authenticated user. Flags are reviewed by users with a ' +
    'reputation of **1000 or above** ("Ferramentas de moderação" permission tier).',
  security: bearerAuth,
  request: {
    params: questionIdParam,
    body: {
      required: true,
      content: {
        'application/json': {
          schema: FlagSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Flag submitted successfully and queued for moderator review.',
      content: {
        'application/json': {
          schema: FlagResponseSchema,
        },
      },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    404: commonErrorResponses[404],
  },
});

// ---------------------------------------------------------------------------
// POST /api/questions/{id}/close
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/questions/{id}/close',
  tags: ['Questions'],
  summary: 'Close a question',
  description:
    'Marks the question as closed, preventing new answers from being submitted. ' +
    '\n\n' +
    '> **Moderator role required** — closing a question requires a reputation of ' +
    '**1000 or above** ("Ferramentas de moderação" permission tier). ' +
    'When `reason` is `duplicate`, `duplicateOfQuestionId` must reference the ' +
    'original question.',
  security: bearerAuth,
  request: {
    params: questionIdParam,
    body: {
      required: true,
      content: {
        'application/json': {
          schema: CloseQuestionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Question closed successfully. Returns the updated question object.',
      content: {
        'application/json': {
          schema: QuestionSchema,
        },
      },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    403: {
      description:
        'Forbidden — the authenticated user does not have the moderator role ' +
        'required to close questions.',
      content: commonErrorResponses[403].content,
    },
    404: commonErrorResponses[404],
  },
});