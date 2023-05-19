import fp from 'fastify-plugin';
import jwt, { FastifyJWTOptions } from '@fastify/jwt';

const t = (num: number) => {
  return {
    num,
    day() {
      return this.hour() * 24;
    },
    hour() {
      return this.minute() * 60;
    },
    minute() {
      return this.sec() * 60;
    },
    sec() {
      return this.num * 1000;
    },
  };
};
/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifyJWTOptions>(async fastify => {
  fastify.register(jwt, {
    secret: 'yanzhibu',
    sign: {
      expiresIn: t(7).day(),
    },
  });

  type HandlerParameters = Parameters<
    Parameters<(typeof fastify)['route']>[0]['handler']
  >;

  fastify.decorate(
    'authenticate',
    async function (
      request: HandlerParameters[0],
      reply: HandlerParameters[1]
    ) {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.send({ code: 1, result: error, message: '请重试登录' });
      }
    }
  );
});

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate(request?: any, reply?: any): void;
  }
}
