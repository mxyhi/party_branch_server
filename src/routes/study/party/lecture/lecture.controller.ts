import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import LectureService from './lecture.service';

const lectureController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // 新增或更新党课信息
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/create',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: Type.Object({
          id: Type.Optional(Type.Number()),
          title: Type.String(),
          desc: Type.String(),
          video_url: Type.String(),
          poster: Type.String(),
          start_time: Type.String(),
          end_time: Type.String(),
          content: Type.String(),
        }),
      },
    },
    function (request) {
      return LectureService.create(request.body);
    }
  );

  // 获取党课列表
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
      return LectureService.getListByLimit(request.query);
    }
  );

  // 删除党课
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
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
      return LectureService.delete(request.query.id);
    }
  );

  // 获取党课详情
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
      return LectureService.findOne(request.query.id);
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
      return LectureService.updateClickCount(request.body.id);
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
      return LectureService.updateStarCount(request.body.id);
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
      return LectureService.updateCollectCount(request.body.id);
    }
  );
};

export default lectureController;
