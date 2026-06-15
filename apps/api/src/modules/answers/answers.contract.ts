import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { commonErrorResponses } from '../../common/schemas/error.schema';
import {
  CommentSchema,
  CreateCommentSchema,
  FlagResponseSchema,
  FlagSchema,
  VoteResultSchema,
  VoteSchema,
} from '../questions/questions.schema';
import {
  AnswerListSchema,
  AnswerSchema,
  CreateAnswerSchema,
  UpdateAnswerSchema,
} from './answers.schema';

// ---------------------------------------------------------------------------
// Shared security requirement for authenticated routes
// ---------------------------------------------------------------------------

const bearerAuth = [{ bearerAuth: [] }];

// ---------------------------------------------------------------------------
// Shared path parameters
// ---------------------------------------------------------------------------

const questionIdParam = z.object({
  id: z.string().openapi({
    description: 'MongoDB ObjectId of the question.',
    example: '665f1a2b3c4d5e6f7a8b9c01',
  }),
});

const answerIdParam = z.object({
  id: z.string().openapi({
    description: 'MongoDB ObjectId of the answer.',
    example: '665f1a2b3c4d5e6f7a8b9c50',
  }),
});

// ---------------------------------------------------------------------------
// GET /api/questions/{id}/answers
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/questions/{id}/answers',
  tags: ['Answers'],
  summary: 'List answers for a question',
  description:
    'Returns all answers posted to the given question, with the accepted answer ' +
    '(if any) listed first, followed by the remaining answers ordered by vote count (desc).',
  request: {
    params: questionIdParam,
  },
  responses: {
    200: {
      description: 'List of answers for the question.',
      content: {
        'application/json': {
          schema: AnswerListSchema,
        },
      },
    },
    ...commonErrorResponses,
  },
});

// ---------------------------------------------------------------------------
// POST /api/questions/{id}/answers
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/questions/{id}/answers',
  tags: ['Answers'],
  summary: 'Post an answer',
  description:
    'Creates a new answer for the given question. ' +
    'Available to any authenticated user (no minimum reputation required — ' +
    '"Perguntar e responder" is the base permission tier). ' +
    'A user may post at most one answer per question; subsequent attempts ' +
    'should edit the existing answer instead.',
  security: bearerAuth,
  request: {
    params: questionIdParam,
    body: {
      required: true,
      content: {
        'application/json': {
          schema: CreateAnswerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Answer created successfully.',
      content: {
        'application/json': {
          schema: AnswerSchema,
        },
      },
    },
    400: commonErrorResponses[400],
    401: commonErrorResponses[401],
    404: commonErrorResponses[404],
  },
});

// ---------------------------------------------------------------------------
// PUT /api/answers/{id}
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'put',
  path: '/api/answers/{id}',
  tags: ['Answers'],
  summary: 'Edit an answer',
  description:
    'Updates the body of an answer. ' +
    '\n\n' +
    'Allowed for the answer`s original author at any time, or for users with a ' +
    'reputation of **200 or above** ("Editar posts da comunidade" permission tier) ' +
    'editing any answer.',
  security: bearerAuth,
  request: {
    params: answerIdParam,
    body: {
      required: true,
      content: {
        'application/json': {
          schema: UpdateAnswerSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated answer object.',
      content: {
        'application/json': {
          schema: AnswerSchema,
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
// DELETE /api/answers/{id}
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'delete',
  path: '/api/answers/{id}',
  tags: ['Answers'],
  summary: 'Delete an answer',
  description:
    'Permanently removes an answer and its associated comments. ' +
    '\n\n' +
    'Allowed for the answer`s original author, provided the answer has not been ' +
    'accepted and has no positive votes, or for users with the **moderator** role ' +
    '(reputation ≥ 1000), who may delete any answer.',
  security: bearerAuth,
  request: {
    params: answerIdParam,
  },
  responses: {
    204: {
      description: 'Answer deleted successfully. No content is returned.',
    },
    401: commonErrorResponses[401],
    403: {
      description:
        'Forbidden — the answer cannot be deleted by its author (e.g. it has been ' +
        'accepted or has votes) and the requester is not a moderator.',
      content: commonErrorResponses[403].content,
    },
    404: commonErrorResponses[404],
  },
});

// ---------------------------------------------------------------------------
// POST /api/answers/{id}/vote
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/answers/{id}/vote',
  tags: ['Answers'],
  summary: 'Vote on an answer',
  description:
    'Casts an upvote (`value: 1`) or downvote (`value: -1`) on the answer. ' +
    'Sending the same value as the user`s current vote removes it (toggle behaviour). ' +
    '\n\n' +
    'Reputation effects: the answer author gains **+10** for each upvote and ' +
    'loses **-2** for each downvote received.',
  security: bearerAuth,
  request: {
    params: answerIdParam,
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
// POST /api/answers/{id}/accept
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/answers/{id}/accept',
  tags: ['Answers'],
  summary: 'Accept an answer',
  description:
    'Marks this answer as the accepted answer for its question. ' +
    '\n\n' +
    '> **Only the author of the question can accept an answer.** Any other ' +
    'authenticated user will receive a `403 Forbidden` response. ' +
    '\n\n' +
    'If another answer to the same question was previously accepted, it is ' +
    'automatically unmarked (a question has at most one accepted answer). ' +
    'Accepting an answer grants its author **+15** reputation points. ' +
    'Calling this endpoint again on an already-accepted answer toggles ' +
    'acceptance off.',
  security: bearerAuth,
  request: {
    params: answerIdParam,
  },
  responses: {
    200: {
      description:
        'Acceptance state updated successfully. Returns the answer with its new ' +
        '`isAccepted` value.',
      content: {
        'application/json': {
          schema: AnswerSchema,
        },
      },
    },
    401: commonErrorResponses[401],
    403: {
      description:
        'Forbidden — only the author of the question may accept or unaccept an answer.',
      content: commonErrorResponses[403].content,
    },
    404: commonErrorResponses[404],
  },
});

// ---------------------------------------------------------------------------
// POST /api/answers/{id}/comments
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/answers/{id}/comments',
  tags: ['Answers'],
  summary: 'Comment on an answer',
  description:
    'Adds a comment to the answer. ' +
    '\n\n' +
    'Requires a reputation of **50 or above** ("Comentar" permission tier).',
  security: bearerAuth,
  request: {
    params: answerIdParam,
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
// POST /api/answers/{id}/flag
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/answers/{id}/flag',
  tags: ['Answers'],
  summary: 'Flag an answer for moderator review',
  description:
    'Reports the answer to moderators for review (e.g. spam, low-quality or ' +
    'offensive content). Available to any authenticated user. Flags are reviewed ' +
    'by users with a reputation of **1000 or above** ("Ferramentas de moderação" ' +
    'permission tier).',
  security: bearerAuth,
  request: {
    params: answerIdParam,
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