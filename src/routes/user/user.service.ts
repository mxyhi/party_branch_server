import prisma from '../../db';
import { res } from '../../utils/result';
import * as moment from 'moment';
import * as md5 from 'js-md5';

export interface LoginFromType {
  uname: string;
  pwd: string;
}
// e10adc3949ba59abbe56e057f20f883e
export default class UserService {
  static async getUserInfo(uname: string) {
    let userInfo;
    try {
      userInfo = await prisma.user.findUnique({
        where: {
          username: uname,
        },
      });
    } catch (error) {
      return res({
        code: -1,
        message: '查询数据库错误',
        result: error,
      });
    }
    if (userInfo) {
      const partyBranch = await prisma.partyBranch.findUnique({
        where: {
          id: userInfo.partyBranchId,
        },
      });
      const { password, ...req } = userInfo;
      return res({
        code: 0,
        result: {
          ...req,
          partyBranchName: partyBranch?.name,
        },
        message: 'success',
      });
    } else {
      return res({
        code: -1,
        message: '查询数据库错误',
        result: null,
      });
    }
  }

  /**
   * @description list
   */
  static async getLimit({
    type,
    page,
    limit,
  }: {
    type?: number;
    page: number;
    limit: number;
  }) {
    const data = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        type,
      },
    });
    const total = await prisma.user.count({
      where: {
        type,
      },
    });
    if (data.length) {
      const partyBranch = await prisma.partyBranch.findMany({
        where: {
          id: {
            in: data.map(item => item.partyBranchId),
          },
        },
      });
      if (partyBranch.length) {
        (data as any).forEach((item: any) => {
          const branch = partyBranch.find(
            branch => branch.id === item.partyBranchId
          );
          if (branch) {
            item.partyBranchName = branch.name;
          }
        });
      }
    }

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
   * @description 新增用户
   */
  static async create(postData: {
    type: number;
    password: string;
    avatar: string;
    desc: string;
    username: string;
    realName: string;
    sex: number;
    phone: string;
    age: number;
    class: string;
    homePath: string;
    userId?: number;
    partyBranchId: number;
  }) {
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    let roles: { roleName: string; value: string }[] = [];
    switch (postData.type) {
      case 0:
        roles = [{ roleName: '管理员', value: 'admin' }];
        break;
      case 1:
        roles = [{ roleName: '党支部', value: 'branch' }];
        break;
      case 2:
        roles = [{ roleName: '党员', value: 'user' }];
        break;
    }
    if (postData.userId) {
      try {
        const result = await prisma.user.update({
          where: {
            userId: postData.userId,
          },
          data: {
            ...postData,
            roles,
            password: md5(postData.password),
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
          message: '新增数据失败或数据库错误',
          result: error,
        });
      }
    }
    try {
      const result = await prisma.user.create({
        data: {
          ...postData,
          roles,
          password: md5(postData.password),
          create_time: nowTime,
          updated_time: nowTime,
        },
      });
      await prisma.partyBranch.update({
        where: {
          id: postData.partyBranchId,
        },
        data: {
          people_count: {
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
        message: '新增数据失败或数据库错误',
        result: error,
      });
    }
  }

  /**
   * @description 删除用户
   */
  static async delete(id: number) {
    try {
      const result = await prisma.user.delete({
        where: {
          userId: id,
        },
      });
      await prisma.partyBranch.update({
        where: {
          id: result.partyBranchId,
        },
        data: {
          people_count: {
            decrement: 1,
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
        message: '删除数据失败或数据库错误',
        result: error,
      });
    }
  }
}
