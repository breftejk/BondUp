import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verifyGoogleToken } from '../services/auth.service';

export default async function (fastify: FastifyInstance) {
  fastify.post(
    '/auth/google',
    async (
      request: FastifyRequest<{ Body: { idToken: string } }>,
      reply: FastifyReply,
    ) => {
      const { idToken } = request.body;
      const { token, requiresProfile } = await verifyGoogleToken(
        fastify,
        idToken,
      );
      reply.send({ token, requiresProfile });
    },
  );
}
