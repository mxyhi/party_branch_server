import { PartyHistory } from '@prisma/client';

export type CreateDataModel = Pick<
  PartyHistory,
  'title' | 'desc' | 'content' | 'poster' | 'start_time' | 'end_time'
> &
  Partial<Pick<PartyHistory, 'id'>>;
