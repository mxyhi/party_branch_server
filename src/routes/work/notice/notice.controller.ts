import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import NoticeService from './notice.service';

const noticeController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // list
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

  // add
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/add',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          title: Type.String(),
          desc: Type.String(),
          content: Type.String(),
          poster: Type.String(),
          start_time: Type.String(),
          end_time: Type.String(),
        }),
      },
    },
    async function (request) {
      return await NoticeService.create(request.body);
    }
  );

  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/edit',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Number(),
          title: Type.String(),
          desc: Type.String(),
          content: Type.String(),
          poster: Type.String(),
          create_time: Type.String(),
          click_count: Type.Number(),
          start_time: Type.String(),
          end_time: Type.String(),
        }),
      },
    },
    async function (request) {
      return await NoticeService.update(request.body);
    }
  );

  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/clickCount',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    async function (request) {
      return await NoticeService.updateClickCount(request.query.id);
    }
  );
  // delete
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
      return await NoticeService.deleteItem(request.body.id);
    }
  );

  // 获取工作通知信息
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/findOne',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    async function (request) {
      return await NoticeService.findOne(request.query.id);
    }
  );
};

export default noticeController;
