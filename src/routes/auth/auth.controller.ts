import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import AuthService from './auth.service';

const authController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/login',
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async function (request) {
      return AuthService.login(request.body, fastify.jwt);
    }
  );

  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/logout',
    {
      onRequest: [fastify.authenticate],
    },
    function () {
      return AuthService.logout();
    }
  );
};

export default authController;
