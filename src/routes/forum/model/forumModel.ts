import { Forum } from '@prisma/client';

export type CreateForumModel = Pick<
  Forum,
  'title' | 'desc' | 'content' | 'poster'
> &
  Partial<Pick<Forum, 'id'>>;

export interface ForumListQuery {
  page: number;
  limit: number;
}
