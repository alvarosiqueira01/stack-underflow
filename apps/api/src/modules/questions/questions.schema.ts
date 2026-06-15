import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { buildPaginatedSchema } from '../../common/schemas/pagination.schema';

// ---------------------------------------------------------------------------
// AuthorSummary — embedded author info shown alongside questions/answers
// ---------------------------------------------------------------------------

/**
 * Compact author representation embedded in questions, answers and comments.
 *
 * @remarks
 * Also reused by the `answers` module — questions are treated as the
 * "owning" domain for this shared shape.
 */
export const AuthorSummarySchema = registry.register(
  'AuthorSummary',
  z
    .object({
      id: z.string().openapi({
        description: 'MongoDB ObjectId of the author.',
        example: '665f1a2b3c4d5e6f7a8b9c0d',
      }),
      name: z.string().openapi({
        description: 'Display name of the author.',
        example: 'Ada Lovelace',
      }),
      username: z.string().openapi({
        description: 'Unique username / handle.',
        example: 'ada_lovelace',
      }),
      avatarUrl: z.string().url().nullable().openapi({
        description: 'URL of the author`s avatar image. Null when no avatar is set.',
        example: 'https://cdn.stackunderflow.dev/avatars/ada_lovelace.webp',
      }),
      reputation: z.number().int().nonnegative().openapi({
        description: 'Current reputation score of the author.',
        example: 4820,
      }),
    })
    .openapi('AuthorSummary'),
);

// ---------------------------------------------------------------------------
// Vote
// ---------------------------------------------------------------------------

/**
 * Request body for casting a vote on a question or answer.
 *
 * `1` registers an upvote, `-1` registers a downvote. Sending the same value
 * the user already cast removes the vote (toggle behaviour).
 */
export const VoteSchema = registry.register(
  'Vote',
  z
    .object({
      value: z.union([z.literal(1), z.literal(-1)]).openapi({
        description:
          '`1` for an upvote, `-1` for a downvote. ' +
          'Sending the same value as the user`s current vote removes it.',
        example: 1,
      }),
    })
    .openapi('Vote'),
);

/**
 * Response returned after a vote is cast — reflects the new totals and the
 * authenticated user's current vote state on the resource.
 */
export const VoteResultSchema = registry.register(
  'VoteResult',
  z
    .object({
      votes: z.number().int().openapi({
        description: 'Updated net vote count (upvotes minus downvotes) for the resource.',
        example: 43,
      }),
      userVote: z.union([z.literal(1), z.literal(-1), z.literal(0)]).openapi({
        description:
          'The authenticated user`s current vote on this resource. ' +
          '`0` means no active vote (e.g. it was just toggled off).',
        example: 1,
      }),
    })
    .openapi('VoteResult'),
);

// ---------------------------------------------------------------------------
// Flag
// ---------------------------------------------------------------------------

/**
 * Reasons a question, answer or comment can be flagged for moderator review.
 */
export const FlagReasonEnum = z.enum([
  'spam',
  'offensive_or_abusive',
  'duplicate',
  'low_quality',
  'off_topic',
  'other',
]);

/**
 * Request body for flagging content for moderator review.
 */
export const FlagSchema = registry.register(
  'Flag',
  z
    .object({
      reason: FlagReasonEnum.openapi({
        description: 'Category of the issue being reported.',
        example: 'spam',
      }),
      details: z.string().max(500).optional().openapi({
        description: 'Optional free-text details to help moderators evaluate the flag.',
        example: 'This post copies content verbatim from another site without attribution.',
      }),
    })
    .openapi('Flag'),
);

/**
 * Response returned after a flag is successfully submitted.
 */
export const FlagResponseSchema = registry.register(
  'FlagResponse',
  z
    .object({
      id: z.string().openapi({
        description: 'Unique identifier of the created flag record.',
        example: '665f1a2b3c4d5e6f7a8b9c20',
      }),
      status: z.enum(['pending', 'reviewed']).openapi({
        description: 'Moderation status of the flag.',
        example: 'pending',
      }),
      createdAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of when the flag was submitted.',
        example: '2024-06-10T18:45:00.000Z',
      }),
    })
    .openapi('FlagResponse'),
);

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

/**
 * Request body for posting a comment on a question or answer.
 *
 * @remarks
 * Posting comments requires a reputation of **50 or above**
 * ("Comentar" permission tier).
 */
export const CreateCommentSchema = registry.register(
  'CreateComment',
  z
    .object({
      body: z.string().min(5).max(600).openapi({
        description: 'Plain-text or Markdown comment body (5–600 chars).',
        example: 'Could you clarify what version of Node.js this applies to?',
      }),
    })
    .openapi('CreateComment'),
);

/**
 * A comment attached to a question or answer.
 */
export const CommentSchema = registry.register(
  'Comment',
  z
    .object({
      id: z.string().openapi({
        description: 'Unique identifier of the comment.',
        example: '665f1a2b3c4d5e6f7a8b9c30',
      }),
      body: z.string().openapi({
        description: 'Comment text.',
        example: 'Could you clarify what version of Node.js this applies to?',
      }),
      author: AuthorSummarySchema,
      createdAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of when the comment was posted.',
        example: '2024-06-10T19:00:00.000Z',
      }),
    })
    .openapi('Comment'),
);

// ---------------------------------------------------------------------------
// Close question
// ---------------------------------------------------------------------------

/**
 * Reasons a question can be closed, mirroring Stack Overflow's close-reason taxonomy.
 */
export const CloseReasonEnum = z.enum([
  'duplicate',
  'off_topic',
  'needs_details_or_clarity',
  'opinion_based',
  'too_broad',
]);

/**
 * Request body for closing a question.
 *
 * @remarks
 * Closing requires a reputation of **1000 or above** (moderation tools tier),
 * or the question's own author for self-closing certain reason codes.
 */
export const CloseQuestionSchema = registry.register(
  'CloseQuestion',
  z
    .object({
      reason: CloseReasonEnum.openapi({
        description: 'Reason code explaining why the question is being closed.',
        example: 'duplicate',
      }),
      duplicateOfQuestionId: z.string().optional().openapi({
        description:
          'Required when `reason` is `duplicate` — ObjectId of the original question.',
        example: '665f1a2b3c4d5e6f7a8b9c40',
      }),
      details: z.string().max(500).optional().openapi({
        description: 'Optional additional context for the closure.',
        example: 'This exact question was answered comprehensively here.',
      }),
    })
    .openapi('CloseQuestion'),
);

// ---------------------------------------------------------------------------
// QuestionSchema — full representation
// ---------------------------------------------------------------------------

/**
 * Full representation of a question, including author, tags, vote totals,
 * answer metadata and moderation state.
 */
export const QuestionSchema = registry.register(
  'Question',
  z
    .object({
      id: z.string().openapi({
        description: 'MongoDB ObjectId of the question.',
        example: '665f1a2b3c4d5e6f7a8b9c01',
      }),
      title: z.string().min(10).max(150).openapi({
        description: 'Question title (10–150 chars).',
        example: 'What is a monad in functional programming?',
      }),
      body: z.string().min(30).openapi({
        description: 'Question body in Markdown (min 30 chars).',
        example:
          "I've read several explanations of monads but still don't understand how they apply to error handling in TypeScript...",
      }),
      tags: z.array(z.string()).max(5).openapi({
        description: 'Up to 5 tag names associated with this question.',
        example: ['typescript', 'functional-programming', 'monads'],
      }),
      author: AuthorSummarySchema,
      votes: z.number().int().openapi({
        description: 'Net vote count (upvotes minus downvotes).',
        example: 27,
      }),
      userVote: z.union([z.literal(1), z.literal(-1), z.literal(0)]).nullable().openapi({
        description:
          'The authenticated user`s current vote on this question. ' +
          'Null when the request is unauthenticated.',
        example: 0,
      }),
      viewsCount: z.number().int().nonnegative().openapi({
        description: 'Total number of times this question has been viewed.',
        example: 1_204,
      }),
      answersCount: z.number().int().nonnegative().openapi({
        description: 'Total number of answers posted to this question.',
        example: 4,
      }),
      acceptedAnswerId: z.string().nullable().openapi({
        description: 'ObjectId of the accepted answer. Null when no answer has been accepted.',
        example: '665f1a2b3c4d5e6f7a8b9c50',
      }),
      status: z.enum(['open', 'closed']).openapi({
        description: 'Whether the question is open or has been closed by moderators.',
        example: 'open',
      }),
      closeReason: CloseReasonEnum.nullable().openapi({
        description: 'Reason code for closure. Null when the question is open.',
        example: null,
      }),
      createdAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of creation.',
        example: '2024-05-01T10:00:00.000Z',
      }),
      updatedAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of the last edit.',
        example: '2024-05-02T08:30:00.000Z',
      }),
    })
    .openapi('Question'),
);

// ---------------------------------------------------------------------------
// PaginatedQuestions  (reuses the shared factory)
// ---------------------------------------------------------------------------

/**
 * Paginated list of questions — used by `GET /api/questions`.
 */
export const PaginatedQuestionsSchema = buildPaginatedSchema(
  QuestionSchema,
  'PaginatedQuestions',
);

// ---------------------------------------------------------------------------
// CreateQuestion
// ---------------------------------------------------------------------------

/**
 * Request body for `POST /api/questions`.
 */
export const CreateQuestionSchema = registry.register(
  'CreateQuestion',
  z
    .object({
      title: z.string().min(10).max(150).openapi({
        description: 'Question title (10–150 chars).',
        example: 'What is a monad in functional programming?',
      }),
      body: z.string().min(30).openapi({
        description: 'Question body in Markdown (min 30 chars).',
        example:
          "I've read several explanations of monads but still don't understand how they apply to error handling in TypeScript...",
      }),
      tags: z.array(z.string()).min(1).max(5).openapi({
        description: 'Between 1 and 5 tag names. Tags must already exist in the system.',
        example: ['typescript', 'functional-programming', 'monads'],
      }),
    })
    .openapi('CreateQuestion'),
);

// ---------------------------------------------------------------------------
// UpdateQuestion
// ---------------------------------------------------------------------------

/**
 * Request body for `PUT /api/questions/{id}`.
 * All fields are optional to support partial edits.
 */
export const UpdateQuestionSchema = registry.register(
  'UpdateQuestion',
  z
    .object({
      title: z.string().min(10).max(150).optional().openapi({
        description: 'Updated title (10–150 chars).',
        example: 'What exactly is a monad in functional programming?',
      }),
      body: z.string().min(30).optional().openapi({
        description: 'Updated body in Markdown (min 30 chars).',
        example: 'Edited for clarity: I now understand monads as a design pattern for...',
      }),
      tags: z.array(z.string()).min(1).max(5).optional().openapi({
        description: 'Updated tag list (1–5 tags).',
        example: ['typescript', 'functional-programming'],
      }),
      editSummary: z.string().max(200).optional().openapi({
        description: 'Optional short note explaining the reason for the edit.',
        example: 'Fixed typo in title and clarified the question body.',
      }),
    })
    .openapi('UpdateQuestion'),
);