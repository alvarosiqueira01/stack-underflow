import mongoose, { Schema, Document, Types } from 'mongoose';

// -- Sub-types

export type QueueType = 'suggested_edits' | 'close_votes' | 'low_quality_posts';
export type PostType = 'question' | 'answer';
export type ReviewStatus = 'pending' | 'completed' | 'skipped';
export type ReviewAction = 'approve' | 'reject' | 'improve' | 'skip';
export type RejectionReason =
  | 'spam'
  | 'vandalism'
  | 'no_improvement'
  | 'irrelevant'
  | 'conflicts_with_author';

// -- Interfaces

export interface IReviewDiff {
  field: string;
  original: string;
  suggested: string;
}

export interface IReviewDecision {
  reviewerId: Types.ObjectId;
  action: ReviewAction;
  rejectionReasons?: RejectionReason[];
  decidedAt: Date;
}

export interface IReviewTask extends Document {
  queueType: QueueType;
  status: ReviewStatus;
  postId: Types.ObjectId;
  postType: PostType;
  editSummary?: string;
  diffs: IReviewDiff[];
  submittedBy: Types.ObjectId;
  decisions: IReviewDecision[];
  createdAt: Date;
  updatedAt: Date;
}

// -- Sub-schemas

const ReviewDiffSchema = new Schema<IReviewDiff>(
  {
    field: { type: String, required: true },
    original: { type: String, required: true },
    suggested: { type: String, required: true },
  },
  { _id: false },
);

const ReviewDecisionSchema = new Schema<IReviewDecision>(
  {
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['approve', 'reject', 'improve', 'skip'],
      required: true,
    },
    rejectionReasons: {
      type: [String],
      enum: ['spam', 'vandalism', 'no_improvement', 'irrelevant', 'conflicts_with_author'],
      default: undefined,
    },
    decidedAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

// -- Schema

const ReviewTaskSchema = new Schema<IReviewTask>(
  {
    queueType: {
      type: String,
      enum: ['suggested_edits', 'close_votes', 'low_quality_posts'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'skipped'],
      default: 'pending',
      index: true,
    },
    postId: { type: Schema.Types.ObjectId, required: true, index: true },
    postType: {
      type: String,
      enum: ['question', 'answer'],
      required: true,
    },
    editSummary: { type: String, default: undefined },
    diffs: { type: [ReviewDiffSchema], default: [] },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    decisions: { type: [ReviewDecisionSchema], default: [] },
  },
  { timestamps: true, versionKey: false, collection: 'review_tasks' },
);

ReviewTaskSchema.index({ queueType: 1, status: 1, createdAt: -1 });

export const ReviewTaskModel = mongoose.model<IReviewTask>('ReviewTask', ReviewTaskSchema);
