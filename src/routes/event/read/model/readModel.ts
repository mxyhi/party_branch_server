import { Read } from '@prisma/client';

export type EventInfoType = Omit<
  Read,
  'updated_time' | 'id' | 'poster' | 'create_time'
> &
  Partial<Pick<Read, 'id' | 'create_time'>> & {
    poster: string[];
  };

export interface EventQuery {
  page: number;
  limit: number;
  id?: number;
}
