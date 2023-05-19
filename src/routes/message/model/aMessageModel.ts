import { AMessage } from '@prisma/client';

export type CreateAMessageModel = Pick<AMessage, 'content'> &
  Partial<Pick<AMessage, 'id'>>;

export interface AMessageListQuery {
  page: number;
  limit: number;
  id?: number;
}
