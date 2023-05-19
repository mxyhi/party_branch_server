import * as moment from 'moment';
import prisma from '../../db';
import { res } from '../../utils/result';
import { CreateAMessageModel, AMessageListQuery } from './model/aMessageModel';

export default class AMessageService {
  /**
   * @description 新增留言
   */
  static async create(postData: CreateAMessageModel, token: string) {
    try {
      const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const { content, id } = postData;
      if (id) {
        const result = await prisma.aMessage.update({
          where: {
            id,
          },
          data: {
            content,
            updated_time: nowTime,
          },
        });
        return res({
          code: 0,
          message: 'success',
          result,
        });
      }
      const user = await prisma.user.findUnique({
        where: {
          token: token.split(' ')[1],
        },
      });
      if (user) {
        const result = await prisma.aMessage.create({
          data: {
            content,
            create_time: nowTime,
            updated_time: nowTime,
            user_id: user.userId,
          },
        });
        return res({
          code: 0,
          message: 'success',
          result,
        });
      }
    } catch (error) {
      return res({
        code: -1,
        message: 'error',
        result: error,
      });
    }
  }

  /**
   * @description 获取分页留言
   */
  static async getList({ limit, page, id }: AMessageListQuery) {
    try {
      const total = await prisma.aMessage.count({
        where: {
          user_id: id,
        },
      });
      const skipCount = (page - 1) * limit;
      if (total <= skipCount)
        return res({
          code: 0,
          result: {
            total,
            data: [],
          },
          message: 'success',
        });
      const data = await prisma.aMessage.findMany({
        skip: skipCount,
        take: limit,
        where: {
          user_id: id,
        },
      });
      const userList = await prisma.user.findMany({
        where: {
          userId: {
            in: data.map(item => item.user_id),
          },
        },
      });
      return res({
        code: 0,
        message: 'success',
        result: {
          total,
          data: data.map(item => {
            const user = userList.find(
              userItem => userItem.userId === item.user_id
            );
            return {
              ...item,
              user,
            };
          }),
        },
      });
    } catch (error) {
      return res({
        code: -1,
        message: 'error',
        result: error,
      });
    }
  }

  /**
   * @description 删除留言
   */
  static async delete(id: number) {
    try {
      const result = await prisma.aMessage.delete({
        where: {
          id,
        },
      });
      return res({
        code: 0,
        message: 'success',
        result,
      });
    } catch (error) {
      return res({
        code: -1,
        message: 'error',
        result: error,
      });
    }
  }

  /**
   * @description 获取留言详情
   */
  static async getDetail(id: number) {
    try {
      const result = await prisma.aMessage.findUnique({
        where: {
          id,
        },
      });
      if (!result)
        return res({
          code: -1,
          message: 'error',
          result: null,
        });
      const user = await prisma.user.findFirst({
        where: {
          userId: result.user_id,
        },
      });
      return res({
        code: 0,
        message: 'success',
        result: {
          result,
          user,
        },
      });
    } catch (error) {
      return res({
        code: -1,
        message: 'error',
        result: error,
      });
    }
  }
}
