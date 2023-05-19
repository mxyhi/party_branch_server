import { PartyLecture } from '@prisma/client';

export type SourceDataModel = PartyLecture;

export type CreateDataModel = Pick<
  SourceDataModel,
  | 'title'
  | 'desc'
  | 'content'
  | 'video_url'
  | 'poster'
  | 'start_time'
  | 'end_time'
> &
  Partial<Pick<SourceDataModel, 'id'>>;
