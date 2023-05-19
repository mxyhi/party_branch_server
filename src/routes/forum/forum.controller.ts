import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import ForumService from './forum.service';

const forumController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // 新增文章
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/create',
    {
      onRequest: [fastify.authenticate],
      schema: {
        headers: Type.Object({
          authorization: Type.String(),
        }),
        body: Type.Object({
          title: Type.String(),
          desc: Type.String(),
          content: Type.String(),
          poster: Type.String(),
        }),
      },
    },
    async function (request) {
      return await ForumService.create(
        request.body,
        request.headers.authorization
      );
    }
  );

  // 获取文章列表
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
      return ForumService.getLimit(request.query);
    }
  );

  // 获取文章详情
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
    function (request) {
      return ForumService.getDetail(request.query.id);
    }
  );

  // 删除文章
  fastify.withTypeProvider<TypeBoxTypeProvider>().delete(
    '/delete',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: Type.Object({
          id: Type.Number(),
        }),
      },
    },
    function (request) {
      return ForumService.delete(request.query.id);
    }
  );
};

export default forumController;
