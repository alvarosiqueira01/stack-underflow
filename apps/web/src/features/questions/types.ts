export type VoteValue = 1 | 0 | -1;

export interface AuthorSummary {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  reputation: number;
}

export interface Comment {
  id: string;
  body: string;
  author: AuthorSummary;
  createdAt: string;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  tags: string[];
  author: AuthorSummary;
  votes: number;
  userVote: VoteValue | null;
  viewsCount: number;
  answersCount: number;
  acceptedAnswerId: string | null;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  body: string;
  author: AuthorSummary;
  votes: number;
  userVote: VoteValue | null;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Breadcrumb {
  label: string;
  href: string;
}
