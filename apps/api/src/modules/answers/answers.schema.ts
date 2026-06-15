import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { AuthorSummarySchema } from '../questions/questions.schema';

// ---------------------------------------------------------------------------
// AnswerSchema — full representation
// ---------------------------------------------------------------------------

/**
 * Full representation of an answer, including author, vote totals and
 * acceptance state.
 *
 * @remarks
 * Reuses `AuthorSummarySchema` from the `questions` module — author
 * information has the same shape across questions, answers and comments.
 */
export const AnswerSchema = registry.register(
  'Answer',
  z
    .object({
      id: z.string().openapi({
        description: 'MongoDB ObjectId of the answer.',
        example: '665f1a2b3c4d5e6f7a8b9c50',
      }),
      questionId: z.string().openapi({
        description: 'ObjectId of the question this answer belongs to.',
        example: '665f1a2b3c4d5e6f7a8b9c01',
      }),
      body: z.string().min(30).openapi({
        description: 'Answer body in Markdown (min 30 chars).',
        example:
          'A monad is essentially a design pattern that wraps a value and provides ' +
          '`map`/`flatMap`-style operations to chain computations while handling ' +
          'side effects such as errors or asynchronicity...',
      }),
      author: AuthorSummarySchema,
      votes: z.number().int().openapi({
        description: 'Net vote count (upvotes minus downvotes).',
        example: 18,
      }),
      userVote: z.union([z.literal(1), z.literal(-1), z.literal(0)]).nullable().openapi({
        description:
          'The authenticated user`s current vote on this answer. ' +
          'Null when the request is unauthenticated.',
        example: 0,
      }),
      isAccepted: z.boolean().openapi({
        description:
          'Whether this answer has been marked as the accepted answer ' +
          'by the question`s author.',
        example: false,
      }),
      createdAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of creation.',
        example: '2024-05-01T11:00:00.000Z',
      }),
      updatedAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of the last edit.',
        example: '2024-05-01T11:00:00.000Z',
      }),
    })
    .openapi('Answer'),
);

// ---------------------------------------------------------------------------
// AnswerList — array response for GET /api/questions/{id}/answers
// ---------------------------------------------------------------------------

/**
 * List of answers for a question, returned by `GET /api/questions/{id}/answers`.
 *
 * @remarks
 * Not paginated — answer counts per question are bounded in practice, and the
 * frontend renders the full thread at once (accepted answer first, then by votes).
 */
export const AnswerListSchema = registry.register(
  'AnswerList',
  z.array(AnswerSchema).openapi({
    description:
      'All answers for the question, ordered with the accepted answer first ' +
      '(if any), followed by the remaining answers sorted by vote count (desc).',
  }),
);

// ---------------------------------------------------------------------------
// CreateAnswer
// ---------------------------------------------------------------------------

/**
 * Request body for `POST /api/questions/{id}/answers`.
 */
export const CreateAnswerSchema = registry.register(
  'CreateAnswer',
  z
    .object({
      body: z.string().min(30).openapi({
        description: 'Answer body in Markdown (min 30 chars).',
        example:
          'A monad is essentially a design pattern that wraps a value and provides ' +
          '`map`/`flatMap`-style operations to chain computations while handling ' +
          'side effects such as errors or asynchronicity...',
      }),
    })
    .openapi('CreateAnswer'),
);

// ---------------------------------------------------------------------------
// UpdateAnswer
// ---------------------------------------------------------------------------

/**
 * Request body for `PUT /api/answers/{id}`.
 */
export const UpdateAnswerSchema = registry.register(
  'UpdateAnswer',
  z
    .object({
      body: z.string().min(30).openapi({
        description: 'Updated answer body in Markdown (min 30 chars).',
        example: 'Edited for clarity: a monad can be thought of as a "programmable semicolon"...',
      }),
      editSummary: z.string().max(200).optional().openapi({
        description: 'Optional short note explaining the reason for the edit.',
        example: 'Added a concrete TypeScript example.',
      }),
    })
    .openapi('UpdateAnswer'),
);