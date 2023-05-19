import { PartyQuotes } from '@prisma/client';

export type SourceDataModel = PartyQuotes;

export type CreateDataModel = Pick<
  SourceDataModel,
  | 'title'
  | 'desc'
  | 'content'
  | 'start_time'
  | 'end_time'
> &
  Partial<Pick<SourceDataModel, 'id'>>;
