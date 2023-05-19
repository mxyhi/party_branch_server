import { Obligation } from "@prisma/client";

export type EventInfoType = Omit<
  Obligation,
  'updated_time' | 'id' | 'poster' | 'create_time'
> &
  Partial<Pick<Obligation, 'id' | 'create_time'>> & {
    poster: string[];
  };

export interface EventQuery {
  page: number;
  limit: number;
  id: number;
}