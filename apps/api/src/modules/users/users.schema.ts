
import { z } from 'zod';
import { registry } from '../../common/openapi/registry';
import { buildPaginatedSchema } from '../../common/schemas/pagination.schema';
 
// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
 
/**
 * A badge earned by a user through community participation.
 * Modelled after the Stack Overflow bronze / silver / gold system.
 */
export const BadgeSchema = registry.register(
  'Badge',
  z
    .object({
      id: z.string().openapi({
        description: 'Unique badge identifier.',
        example: '665f1a2b3c4d5e6f7a8b9c0d',
      }),
      name: z.string().openapi({
        description: 'Display name of the badge.',
        example: 'First Answer',
      }),
      description: z.string().openapi({
        description: 'Short description of what earns this badge.',
        example: 'Posted your first accepted answer.',
      }),
      tier: z.enum(['bronze', 'silver', 'gold']).openapi({
        description: 'Badge tier indicating its prestige level.',
        example: 'bronze',
      }),
      awardedAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of when the badge was awarded.',
        example: '2024-06-01T12:00:00.000Z',
      }),
    })
    .openapi('Badge'),
);
 
// ---------------------------------------------------------------------------
// UserResponse
// ---------------------------------------------------------------------------
 
/**
 * Public representation of a user returned by the API.
 * Excludes sensitive fields (password hash, email for non-owners, etc.).
 */
export const UserResponseSchema = registry.register(
  'UserResponse',
  z
    .object({
      id: z.string().openapi({
        description: 'MongoDB ObjectId of the user.',
        example: '665f1a2b3c4d5e6f7a8b9c0d',
      }),
      name: z.string().openapi({
        description: 'Full display name of the user.',
        example: 'Ada Lovelace',
      }),
      username: z.string().openapi({
        description: 'Unique username / handle.',
        example: 'ada_lovelace',
      }),
      avatarUrl: z.string().url().nullable().openapi({
        description: "URL of the user's avatar image. Null when no avatar is set.",
        example: 'https://cdn.stackunderflow.dev/avatars/ada_lovelace.webp',
      }),
      bio: z.string().max(300).nullable().openapi({
        description: 'Short biography written by the user (max 300 chars).',
        example: 'Mathematician and writer. First programmer in history.',
      }),
      reputation: z.number().int().nonnegative().openapi({
        description:
          'Accumulated reputation points earned through upvotes, accepted answers, etc.',
        example: 4820,
      }),
      badges: z
        .object({
          gold: z.number().int().nonnegative().openapi({ example: 1 }),
          silver: z.number().int().nonnegative().openapi({ example: 3 }),
          bronze: z.number().int().nonnegative().openapi({ example: 8 }),
        })
        .openapi({ description: 'Badge counts grouped by tier.' }),
      createdAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of account creation.',
        example: '2023-11-15T09:30:00.000Z',
      }),
    })
    .openapi('UserResponse'),
);
 
// ---------------------------------------------------------------------------
// PaginatedUsers  (reuses the shared factory)
// ---------------------------------------------------------------------------
 
/**
 * Paginated list of users — used by `GET /api/users`.
 */
export const PaginatedUsersSchema = buildPaginatedSchema(
  UserResponseSchema,
  'PaginatedUsers',
);
 
// ---------------------------------------------------------------------------
// UpdateProfile
// ---------------------------------------------------------------------------
 
/**
 * Request body accepted by `PUT /api/users/me`.
 * All fields are optional so the client can perform partial updates.
 */
export const UpdateProfileSchema = registry.register(
  'UpdateProfile',
  z
    .object({
      name: z.string().min(2).max(80).optional().openapi({
        description: 'Updated display name (2–80 chars).',
        example: 'Ada Lovelace',
      }),
      username: z
        .string()
        .min(3)
        .max(30)
        .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, digits and underscores.')
        .optional()
        .openapi({
          description:
            'Updated username — lowercase letters, digits and underscores only (3–30 chars).',
          example: 'ada_lovelace_42',
        }),
      bio: z.string().max(300).optional().openapi({
        description: 'Updated biography (max 300 chars).',
        example: 'Mathematician, writer, and pioneer of computing.',
      }),
      avatarUrl: z.string().url().optional().openapi({
        description: 'URL pointing to the new avatar image.',
        example: 'https://cdn.stackunderflow.dev/avatars/ada_new.webp',
      }),
    })
    .openapi('UpdateProfile'),
);
 
// ---------------------------------------------------------------------------
// ActivityFeed — individual events
// ---------------------------------------------------------------------------
 
/**
 * Union of activity event types that can appear in a user's feed.
 */
const ActivityEventTypeSchema = z
  .enum([
    'question_posted',
    'answer_posted',
    'answer_accepted',
    'vote_cast',
    'badge_earned',
    'reputation_changed',
  ])
  .openapi({
    description: 'The kind of action that generated this activity event.',
    example: 'answer_accepted',
  });
 
/**
 * A single entry in a user's activity feed.
 */
export const ActivityEventSchema = registry.register(
  'ActivityEvent',
  z
    .object({
      id: z.string().openapi({
        description: 'Unique identifier of this activity event.',
        example: '665f1a2b3c4d5e6f7a8b9c0e',
      }),
      type: ActivityEventTypeSchema,
      description: z.string().openapi({
        description: 'Human-readable summary of the event.',
        example: 'Your answer to "What is a monad?" was accepted.',
      }),
      reputationDelta: z.number().int().nullable().openapi({
        description:
          'Reputation change caused by this event. Null when the event does not affect reputation.',
        example: 15,
      }),
      relatedEntityId: z.string().nullable().openapi({
        description:
          'ObjectId of the question, answer, or badge related to this event. Null when not applicable.',
        example: '665f1a2b3c4d5e6f7a8b9c01',
      }),
      relatedEntityType: z
        .enum(['question', 'answer', 'badge'])
        .nullable()
        .openapi({
          description: 'Collection / resource type of the related entity.',
          example: 'answer',
        }),
      occurredAt: z.string().datetime().openapi({
        description: 'ISO-8601 timestamp of when the event occurred.',
        example: '2024-05-20T14:22:00.000Z',
      }),
    })
    .openapi('ActivityEvent'),
);
 
/**
 * Full activity feed response returned by `GET /api/users/{id}/activity`.
 * Paginated to support infinite-scroll or traditional pagination on the frontend.
 */
export const ActivityFeedSchema = registry.register(
  'ActivityFeed',
  z
    .object({
      userId: z.string().openapi({
        description: 'ObjectId of the user whose activity is listed.',
        example: '665f1a2b3c4d5e6f7a8b9c0d',
      }),
      events: z.array(ActivityEventSchema).openapi({
        description: 'Chronologically ordered list of activity events (newest first).',
      }),
      meta: z
        .object({
          page: z.number().int().positive().openapi({ example: 1 }),
          limit: z.number().int().positive().openapi({ example: 20 }),
          total: z.number().int().nonnegative().openapi({ example: 87 }),
          totalPages: z.number().int().nonnegative().openapi({ example: 5 }),
          hasNextPage: z.boolean().openapi({ example: true }),
          hasPreviousPage: z.boolean().openapi({ example: false }),
        })
        .openapi({ description: 'Pagination metadata for the activity feed.' }),
    })
    .openapi('ActivityFeed'),
);
 
// ---------------------------------------------------------------------------
// Dashboard stats (authenticated — GET /api/users/me/dashboard)
// ---------------------------------------------------------------------------
 
/**
 * Aggregated statistics returned for the authenticated user's dashboard.
 */
export const DashboardStatsSchema = registry.register(
  'DashboardStats',
  z
    .object({
      reputation: z.number().int().nonnegative().openapi({
        description: 'Current total reputation.',
        example: 4820,
      }),
      reputationThisMonth: z.number().int().openapi({
        description: 'Reputation delta for the current calendar month.',
        example: 340,
      }),
      questionsCount: z.number().int().nonnegative().openapi({
        description: 'Total number of questions posted by the user.',
        example: 12,
      }),
      answersCount: z.number().int().nonnegative().openapi({
        description: 'Total number of answers posted by the user.',
        example: 47,
      }),
      acceptedAnswersCount: z.number().int().nonnegative().openapi({
        description: 'Number of answers that were accepted by the question author.',
        example: 23,
      }),
      acceptanceRate: z.number().min(0).max(1).openapi({
        description:
          'Ratio of accepted answers to total answers, expressed as a decimal between 0 and 1.',
        example: 0.49,
      }),
      upvotesReceived: z.number().int().nonnegative().openapi({
        description: 'Total upvotes received across all questions and answers.',
        example: 318,
      }),
      badgesCount: z
        .object({
          gold: z.number().int().nonnegative().openapi({ example: 1 }),
          silver: z.number().int().nonnegative().openapi({ example: 5 }),
          bronze: z.number().int().nonnegative().openapi({ example: 14 }),
        })
        .openapi({ description: 'Badge counts grouped by tier.' }),
      recentBadges: z.array(BadgeSchema).max(5).openapi({
        description: 'Up to 5 most recently awarded badges.',
      }),
      topTags: z
        .array(
          z.object({
            tag: z.string().openapi({ example: 'typescript' }),
            postsCount: z.number().int().positive().openapi({ example: 18 }),
            score: z.number().int().openapi({
              description:
                'Net score (upvotes minus downvotes) for all posts under this tag.',
              example: 94,
            }),
          }),
        )
        .max(10)
        .openapi({ description: 'Top 10 tags by post count for this user.' }),
    })
    .openapi('DashboardStats'),
);