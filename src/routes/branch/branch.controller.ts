import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import NoticeService from './branch.service';

const branchController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // 党支部列表
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/list',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          page: Type.Number(),
          limit: Type.Number(),
        }),
      },
    },
    async function (request) {
      return await NoticeService.getLimit(request.query);
    }
  );

  // 所有党支部列表
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/all',
    {
      onRequest: [fastify.authenticate],
    },
     function () {
      return  NoticeService.getAll();
    }
  );

  // 党支部详情
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/detail',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    async function (request) {
      return await NoticeService.getDetail(request.query.id);
    }
  );

  // 党支部新增
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/add',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          name: Type.String(),
          desc: Type.String(),
          id: Type.Optional(Type.Number()),
        }),
      },
    },
    async function (request) {
      return await NoticeService.create(request.body);
    }
  );

  // 党支部删除
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
      return await NoticeService.delete(request.body.id);
    }
  );
};

export default branchController;
