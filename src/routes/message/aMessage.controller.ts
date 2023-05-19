import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import AMessageService from './aMessage.service';

const aMessageController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // 新增留言
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/add',
    {
      onRequest: [fastify.authenticate],
      schema: {
        headers: Type.Object({
          authorization: Type.String(),
        }),
        body: Type.Object({
          content: Type.String(),
          id: Type.Optional(Type.Integer()),
        }),
      },
    },
    async function (request) {
      return await AMessageService.create(
        request.body,
        request.headers.authorization
      );
    }
  );

  // 获取分页留言
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/list',
    {
      schema: {
        querystring: Type.Object({
          page: Type.Integer(),
          limit: Type.Integer(),
          id:Type.Optional(Type.Number()),
        }),
      },
    },
    async function (request) {
      return await AMessageService.getList(request.query);
    }
  );

  // 删除留言
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/delete',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Integer(),
        }),
      },
    },
    async function (request) {
      return await AMessageService.delete(request.body.id);
    }
  );

  // 获取留言详情
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/detail',
    {
      schema: {
        querystring: Type.Object({
          id: Type.Integer(),
        }),
      },
    },
    async function (request) {
      return await AMessageService.getDetail(request.query.id);
    }
  );
};

export default aMessageController;
