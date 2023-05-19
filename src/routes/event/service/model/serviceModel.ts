import { Service } from '@prisma/client';

export type EventInfoType = Omit<
  Service,
  'updated_time' | 'id' | 'poster' | 'create_time'
> &
  Partial<Pick<Service, 'id' | 'create_time'>> & {
    poster: string[];
  };

export interface EventQuery {
  page: number;
  limit: number;
  id?: number;
}
