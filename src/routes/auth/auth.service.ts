import prisma from '../../db';
import { JWT } from '@fastify/jwt';
import * as md5 from 'js-md5';
import { res } from '../../utils/result';

export interface LoginFromType {
  username: string;
  password: string;
}

export default class AuthService {
  static async login(
    { username = '', password = '' }: LoginFromType,
    jwt: JWT
  ) {
    let userInfo;
    try {
      userInfo = await prisma.user.findUnique({
        where: {
          username,
        },
      });
    } catch (error) {
      return res({
        code: -1,
        message: '查询数据库错误',
        result: error,
      });
    }
    if (userInfo && md5(password) === userInfo?.password) {
      let result;
      try {
        result = await prisma.user.update({
          where: {
            username,
          },
          data: {
            token: jwt.sign({
              username,
              realName: userInfo.realName,
            }),
          },
        });
      } catch (error) {
        return res({
          code: -1,
          message: '查询数据库错误',
          result: error,
        });
      }
      const { password, ...req } = result;
      return res({
        code: 0,
        result: {
          expiresIn: jwt.options.sign.expiresIn,
          ...req,
        },
        message: '登录成功',
      });
    }
    return { code: 1, result: null, message: '用户名或密码不正确' };
  }

  static async logout() {
    return res({
      code: 0,
      message: 'Token has been destroyed',
      result: null,
    });
  }
}
