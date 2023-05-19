import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import ImageService from './image.service';

const imageController: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/upload',
    {
      onRequest: [fastify.authenticate],
    },
    async function (request) {
      const file = await request.file();
      if (file) {
        return ImageService.create(file);
      } else {
        return {
          code: -1,
          result: null,
          type: 'error',
          message: '上传参数错误',
        };
      }
    }
  );
};

export default imageController;
