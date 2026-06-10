import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { buildPaginatedSchema } from '../../common/schemas/pagination.schema';

// ---------------------------------------------------------------------------
// ReviewQueue — summary of a moderation queue
// ---------------------------------------------------------------------------

/**
 * High-level summary of a single moderation queue returned by GET /api/reviews.
 */
export const ReviewQueueSchema = registry.register(
  'ReviewQueue',
  z
    .object({
      id: z.string().openapi({
        description: 'Unique identifier of the review queue.',
        example: 'suggested_edits',
      }),
      type: z.enum(['suggested_edits', 'close_votes', 'low_quality_posts']).openapi({
        description: 'Machine-readable queue type.',
        example: 'suggested_edits',
      }),
      label: z.string().openapi({
        description: 'Human-readable display name for the queue.',
        example: 'Suggested Edits',
      }),
      description: z.string().openapi({
        description: 'Short description of what this queue reviews.',
        example: 'Review community-suggested edits to questions and answers.',
      }),
      pendingCount: z.number().int().nonnegative().openapi({
        description: 'Number of tasks currently awaiting review in this queue.',
        example: 14,
      }),
    })
    .openapi('ReviewQueue'),
);

// ---------------------------------------------------------------------------
// ReviewDiff — a single field change inside a suggested edit
// ---------------------------------------------------------------------------

/**
 * Represents the diff for one field between the original and suggested content.
 */
export const ReviewDiffSchema = registry.register(
  'ReviewDiff',
  z
    .object({
      field: z.string().openapi({
        description: 'Name of the document field that was edited.',
        example: 'body',
      }),
      original: z.string().openapi({
        description: 'Original content before the suggested edit.',
        example: 'How do I reverse a string in Pyhton?',
      }),
      suggested: z.string().openapi({
        description: 'Proposed content after the suggested edit.',
        example: 'How do I reverse a string in Python?',
      }),
    })
    .openapi('ReviewDiff'),
);

// ---------------------------------------------------------------------------
// ReviewTask — full detail of one review task
// ---------------------------------------------------------------------------

/**
 * Detailed view of a single review task, including the diff between
 * original and suggested content. Returned by GET /api/reviews/{id}.
 */
export const ReviewTaskSchema = registry.register(
  'ReviewTask',
  z
    .object({
      id: z.string().openapi({
        description: 'Unique identifier of the review task.',
        example: '665f1a2b3c4d5e6f7a8b9c0d',
      }),
      queueType: z.enum(['suggested_edits', 'close_votes', 'low_quality_posts']).openapi({
        description: 'Queue this task belongs to.',
        example: 'suggested_edits',
      }),
      postId: z.string().openapi({
        description: 'ObjectId of the question or answer being reviewed.',
        example: '665f1a2b3c4d5e6f7a8b9c01',
      }),
      postType: z.enum(['question', 'answer']).openapi({
        description: 'Whether the referenced post is a question or an answer.',
        example: 'question',
      }),
      editSummary: z.string().optional().openapi({
        description: 'Optional summary provided by the editor describing their changes.',
        example: 'Fixed typo in the question title.',
      }),
      diffs: z.array(ReviewDiffSchema).openapi({
        description: 'List of field-level diffs between original and suggested content.',
      }),
      submittedBy: z
        .object({
          id: z.string().openapi({ example: '665f1a2b3c4d5e6f7a8b9c0e' }),
          username: z.string().openapi({ example: 'helpful_editor' }),
        })
        .openapi({ description: 'User who submitted this edit for review.' }),
      createdAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of when this review task was created.',
        example: '2024-06-01T10:30:00.000Z',
      }),
    })
    .openapi('ReviewTask'),
);

export const PaginatedReviewQueuesSchema = buildPaginatedSchema(
  ReviewQueueSchema,
  'PaginatedReviewQueues',
);

// ---------------------------------------------------------------------------
// ReviewAction — decision submitted by a reviewer
// ---------------------------------------------------------------------------

/**
 * Request body for POST /api/reviews/{id}/action.
 * Rejection reasons are required when `action` is "reject".
 */
export const ReviewActionSchema = registry.register(
  'ReviewAction',
  z
    .object({
      action: z.enum(['approve', 'reject', 'improve', 'skip']).openapi({
        description:
          '**approve** — accept the edit as-is. ' +
          '**reject** — decline the edit (requires `rejectionReasons`). ' +
          '**improve** — accept with additional modifications. ' +
          '**skip** — defer to another reviewer.',
        example: 'approve',
      }),
      rejectionReasons: z
        .array(
          z.enum(['spam', 'vandalism', 'no_improvement', 'irrelevant', 'conflicts_with_author']),
        )
        .optional()
        .openapi({
          description:
            'One or more reasons for rejection. Required when `action` is "reject".',
          example: ['no_improvement'],
        }),
    })
    .openapi('ReviewAction'),
);

// ---------------------------------------------------------------------------
// ReviewActionResponse — confirmation returned after an action is recorded
// ---------------------------------------------------------------------------

export const ReviewActionResponseSchema = registry.register(
  'ReviewActionResponse',
  z
    .object({
      reviewId: z.string().openapi({
        description: 'ObjectId of the review task that was acted upon.',
        example: '665f1a2b3c4d5e6f7a8b9c0d',
      }),
      action: z.string().openapi({
        description: 'The action that was recorded.',
        example: 'approve',
      }),
      reviewedBy: z.string().openapi({
        description: 'Username of the reviewer who submitted this decision.',
        example: 'ada_lovelace',
      }),
      reviewedAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of when the action was recorded.',
        example: '2024-06-01T11:00:00.000Z',
      }),
    })
    .openapi('ReviewActionResponse'),
);

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type ReviewActionDto = z.infer<typeof ReviewActionSchema>;
