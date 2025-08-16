import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verifyAppleToken } from '../services/auth.service';

export default async function (fastify: FastifyInstance) {
  fastify.post(
    '/auth/apple',
    async (
      request: FastifyRequest<{ Body: { idToken: string } }>,
      reply: FastifyReply,
    ) => {
      const { idToken } = request.body;
      const { token, requiresProfile } = await verifyAppleToken(
        fastify,
        idToken,
      );
      reply.send({ token, requiresProfile });
    },
  );
}
