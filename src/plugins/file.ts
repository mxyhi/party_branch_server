import fp from 'fastify-plugin';
import fastifyMultipart, { FastifyMultipartOptions } from '@fastify/multipart';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifyMultipartOptions>(async fastify => {
  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 200 * 1024 * 1024,
      files: 1,
    },
  });
});
