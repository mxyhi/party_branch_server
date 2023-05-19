import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import HistoryService from './history.service';

const historyController: FastifyPluginAsync = async (
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
      return HistoryService.getListByLimit(request.query);
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
          poster: Type.String(),
          start_time: Type.String(),
          end_time: Type.String(),
        }),
      },
    },
    function (request) {
      return HistoryService.createOrUpdate(request.body);
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
      return HistoryService.delete(request.body.id);
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
      return HistoryService.findOne(request.query.id);
    }
  );

  // clickCount
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/clickCount',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    function (request) {
      return HistoryService.updateClickCount(request.body.id);
    }
  );

  // star count
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/starCount',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    function (request) {
      return HistoryService.updateStarCount(request.body.id);
    }
  );

  // collect count
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/collectCount',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    function (request) {
      return HistoryService.updateCollectCount(request.body.id);
    }
  );
};

export default historyController;
