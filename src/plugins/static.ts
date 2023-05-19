import fp from 'fastify-plugin';
import fastifyStatic, { FastifyStaticOptions } from '@fastify/static';
import * as path from 'path';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifyStaticOptions>(async fastify => {
  fastify.register(fastifyStatic, {
    root: path.resolve(__dirname, process.env.PUBLIC_PATH!),
    prefix: process.env.PUBLIC_PREFIX_PATH,
  });
});
