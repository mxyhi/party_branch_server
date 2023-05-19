import * as moment from 'moment';
import prisma from '../../../../db';
import { res } from '../../../../utils/result';
import { CreateDataModel } from './model/quotesModel';

class QuotesService {
  /**
   * @description 添加党史
   */
  static async createOrUpdate(postData: CreateDataModel) {
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (postData.id) {
      try {
        // 更新
        const result = await prisma.partyQuotes.update({
          where: {
            id: postData.id,
          },
          data: {
            ...postData,
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
          message: '数据不存在或更新数据失败',
          result: error,
        });
      }
    }
    // 新增
    try {
      const result = await prisma.partyQuotes.create({
        data: {
          ...postData,
          click_count: 0,
          updated_time: nowTime,
          create_time: nowTime,
          collect_count: 0,
          star_count: 0,
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
        message: '新增数据失败或数据库错误',
        result: error,
      });
    }
  }

  /**
   * @description 获取党史列表
   */
  static async getListByLimit({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) {
    try {
      // 获取总数
      const total = await prisma.partyQuotes.count();
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
      // 获取数据
      const data = await prisma.partyQuotes.findMany({
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
        message: '获取数据失败或数据库错误',
        result: error,
      });
    }
  }

  /**
   * @description 删除党史
   */
  static async delete(id: number) {
    try {
      const result = await prisma.partyQuotes.delete({
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
        message: '删除数据失败或数据库错误',
        result: error,
      });
    }
  }

  /**
   * @description 获取党史详情
   */
  static async findOne(id: number) {
    try {
      const result = await prisma.partyQuotes.findUnique({
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
        message: '获取数据失败或数据库错误',
        result: error,
      });
    }
  }

  /**
   * @description click count + 1
   */
  static async updateClickCount(id: number) {
    try {
      const result = await prisma.partyQuotes.update({
        where: {
          id,
        },
        data: {
          click_count: {
            increment: 1,
          },
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

  /**
   * @description star count + 1
   */
  static async updateStarCount(id: number) {
    try {
      const result = await prisma.partyQuotes.update({
        where: {
          id,
        },
        data: {
          star_count: {
            increment: 1,
          },
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

  /**
   * @description collect count + 1
   */
  static async updateCollectCount(id: number) {
    try {
      const result = await prisma.partyQuotes.update({
        where: {
          id,
        },
        data: {
          collect_count: {
            increment: 1,
          },
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
}

export default QuotesService;
