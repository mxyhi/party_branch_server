import { FastifyPluginAsync } from 'fastify';

const exampleController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { num: Math.floor(Math.random() * 1000 + 1) };
  });
};

export default exampleController;
