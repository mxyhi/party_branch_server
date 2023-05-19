import { Report } from '@prisma/client';

export type EventInfoType = Omit<
  Report,
  'updated_time' | 'id' | 'poster' | 'create_time'
> &
  Partial<Pick<Report, 'id' | 'create_time'>> & {
    poster: string[];
  };

export interface EventQuery {
  page: number;
  limit: number;
  id?: number;
}

