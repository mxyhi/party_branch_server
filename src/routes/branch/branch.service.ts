import * as moment from 'moment';
import prisma from '../../db';
import { res } from '../../utils/result';

export default class BranchService {
  /**
   * @description 分页获取党支部列表
   */
  static async getLimit({ page, limit }: { page: number; limit: number }) {
    const total = await prisma.partyBranch.count();
    const data = await prisma.partyBranch.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return res({
      code: 0,
      result: {
        data,
        total,
      },
      message: 'success',
    });
  }

  /**
   * @description 获取所有
   */
  static async getAll() {
    const data = await prisma.partyBranch.findMany();
    return res({
      code: 0,
      result: data,
      message: 'success',
    });
  }

  /**
   * @description 获取详情
   */
  static async getDetail(id: number) {
    const data = await prisma.partyBranch.findUnique({
      where: {
        id,
      },
    });
    return res({
      code: 0,
      result: data,
      message: 'success',
    });
  }

  /**
   * @description 创建党支部
   */
  static async create({
    name,
    desc,
    id,
  }: {
    name: string;
    desc: string;
    id?: number;
  }) {
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (id) {
      try {
        const result = await prisma.partyBranch.update({
          where: {
            id,
          },
          data: {
            name,
            desc,
            updated_time: nowTime,
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
          message: '更新数据失败或数据库错误',
          result: error,
        });
      }
    }
    try {
      const result = await prisma.partyBranch.create({
        data: {
          name,
          desc,
          create_time: nowTime,
          updated_time: nowTime,
          people_count: 0,
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
        message: '创建数据失败或数据库错误',
        result: error,
      });
    }
  }

  /**
   * @description 删除党支部
   */
  static async delete(id: number) {
    try {
      const result = await prisma.partyBranch.delete({
        where: {
          id,
        },
      });
      const defaultBranch = await prisma.partyBranch.findFirst({
        where: {
          name: '默认党支部',
        },
      });
      await prisma.user.updateMany({
        where: {
          partyBranchId: result.id,
        },
        data: {
          partyBranchId: defaultBranch!.id,
        },
      });
      await prisma.partyBranch.update({
        where: {
          id: defaultBranch!.id,
        },
        data: {
          people_count: await prisma.user.count({
            where: {
              partyBranchId: defaultBranch!.id,
            },
          }),
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
        message: '删除数据失败或数据库错误',
        result: error,
      });
    }
  }
}
