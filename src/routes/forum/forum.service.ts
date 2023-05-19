import * as moment from 'moment';
import prisma from '../../db';
import { res } from '../../utils/result';
import { CreateForumModel, ForumListQuery } from './model/forumModel';

export default class ForumService {
  /**
   * @description: 创建文章
   */
  static async create(data: CreateForumModel, token: string) {
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
      const user = await prisma.user.findUnique({
        where: {
          token: token.split(' ')[1],
        },
      });
      if (user) {
        const newData = await prisma.forum.create({
          data: {
            ...data,
            updated_time: nowTime,
            create_time: nowTime,
            click_count: 0,
            star_count: 0,
            collect_count: 0,
            comment_id: [],
            author_id: user.userId,
          },
        });
        return res({
          code: 0,
          message: 'success',
          result: newData,
        });
      }
    } catch (error) {
      return res({
        code: -1,
        message: '新增数据失败或数据库错误',
        result: error,
      });
    }
    return res({
      code: 0,
      message: 'success',
      result: {
        data,
        token,
      },
    });
  }

  /**
   * @description: 获取文章列表,分页
   */
  static async getLimit({ limit, page }: ForumListQuery) {
    try {
      const total = await prisma.forum.count();
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
      const data = await prisma.forum.findMany({
        skip: skipCount,
        take: limit,
      });
      return res({
        code: 0,
        result: {
          total,
          data,
        },
        message: 'success',
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
   * @description: 获取文章详情
   */
  static async getDetail(id: number) {
    try {
      const data = await prisma.forum.findUnique({
        where: {
          id: id,
        },
      });
      return res({
        code: 0,
        result: data,
        message: 'success',
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
   * @description: 删除文章
   */
  static async delete(id: number) {
    try {
      const data = await prisma.forum.delete({
        where: {
          id,
        },
      });
      return res({
        code: 0,
        result: data,
        message: 'success',
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
