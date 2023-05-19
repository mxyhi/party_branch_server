import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import ServiceService from './service.service';

const serviceController: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // 添加活动
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/add',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Optional(Type.Number()),
          title: Type.String(),
          desc: Type.String(),
          content: Type.String(),
          poster: Type.Array(Type.String()),
          start_time: Type.String(),
          end_time: Type.String(),
          create_time: Type.Optional(Type.String()),
          address: Type.String(),
          people_count: Type.Number()
        }),
      },
    },
    async function (request) {
      return await ServiceService.create(request.body);
    }
  );

  // 分页获取活动
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/list',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          page: Type.Number(),
          limit: Type.Number(),
          id: Type.Number(),
        })
      },
    },
    async function (request) {
      return await ServiceService.getLimit(request.query);
    }
  );

  // 获取活动信息
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/one',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          eventId: Type.Number(),
          participateInId: Type.Optional(Type.Number()),
        })
      },
    },
    async function (request) {
      return await ServiceService.findOne(request.query);
    }
  );

  // 删除活动
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/del',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          eventId: Type.Number(),
        })
      },
    },
    async function (request) {
      return await ServiceService.delete(request.query.eventId);
    }
  );

   // 报名
   fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/join',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
          userId: Type.Number(),
        }),
      },
    },
    function (request) {
      return ServiceService.join(
        request.body
      );
    }
  );

  // 取消报名
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/cancel',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    function (request) {
      return ServiceService.cancel(
        request.body.id
      );
    }
  );
};

export default serviceController;
