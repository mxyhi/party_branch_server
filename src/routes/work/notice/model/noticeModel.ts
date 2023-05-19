import { WorkNotice } from '@prisma/client';

export type NoticeInfoType = Omit<WorkNotice, 'updated_time' | 'id'> &
  Partial<Pick<WorkNotice, 'id'>>;

export interface NoticeQuery {
  page: number;
  limit: number;
}
