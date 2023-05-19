import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import UserService from './user.service';

const userController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/info',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          uname: Type.String(),
        }),
      },
    },
    async function (request) {
      return await UserService.getUserInfo(request.query.uname);
    }
  );

  // 获取用户列表
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/list',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          page: Type.Number(),
          limit: Type.Number(),
          type: Type.Optional(Type.Number()),
        }),
      },
    },
    async function (request) {
      return await UserService.getLimit(request.query);
    }
  );

  // 添加用户
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/add',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          avatar: Type.String(),
          username: Type.String(),
          desc: Type.String(),
          password: Type.String(),
          type: Type.Number(),
          realName: Type.String(),
          homePath: Type.String(),
          class: Type.String(),
          age: Type.Number(),
          sex: Type.Number(),
          phone: Type.String(),
          userId: Type.Optional(Type.Number()),
          partyBranchId: Type.Number(),
        }),
      },
    },
    async function (request) {
      return await UserService.create(request.body);
    }
  );

  // 删除用户
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/delete',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    async function (request) {
      return await UserService.delete(request.body.id);
    }
  );
};

export default userController;
