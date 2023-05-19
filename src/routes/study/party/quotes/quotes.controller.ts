import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import QuotesService from './quotes.service';

const quotesController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // 获取党史列表
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
    function (request) {
      return QuotesService.getListByLimit(request.query);
    }
  );

  // 新增或更新党史信息
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/create',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Optional(Type.Number()),
          title: Type.String(),
          desc: Type.String(),
          content: Type.String(),
          start_time: Type.String(),
          end_time: Type.String(),
        }),
      },
    },
    function (request) {
      return QuotesService.createOrUpdate(request.body);
    }
  );

  // 删除党史信息
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
    function (request) {
      return QuotesService.delete(request.body.id);
    }
  );

  // 获取党史详情
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/find',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    function (request) {
      return QuotesService.findOne(request.query.id);
    }
  );

  // click count
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/update-click',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    function (request) {
      return QuotesService.updateClickCount(request.body.id);
    }
  );

  // star count
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/update-star',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    function (request) {
      return QuotesService.updateStarCount(request.body.id);
    }
  );

  // collect count
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/update-collect',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    function (request) {
      return QuotesService.updateCollectCount(request.body.id);
    }
  );
};

export default quotesController;
