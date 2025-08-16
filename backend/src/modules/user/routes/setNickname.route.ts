import { FastifyInstance } from 'fastify';
import { User } from '../entities/user.entity';

export default async function (fastify: FastifyInstance) {
  fastify.patch(
    '/me/nickname',
    {
      schema: {
        body: {
          type: 'object',
          required: ['nickname'],
          properties: {
            nickname: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { userId } = await request.jwtVerify<{ userId: string }>();
      const { nickname } = request.body as { nickname: string };

      // Validate allowed characters (letters + numbers only)
      const regex = /^[a-zA-Z0-9]+$/;
      if (!regex.test(nickname)) {
        return reply.code(400).send({
          error: 'Nickname can contain only letters and numbers',
        });
      }

      const repo = fastify.orm.getRepository(User);

      // case-insensitive uniqueness check
      const existing = await repo
        .createQueryBuilder('user')
        .where('LOWER(user.nickname) = LOWER(:nickname)', { nickname })
        .getOne();

      if (existing) {
        return reply.code(409).send({ error: 'Nickname is already taken' });
      }

      await repo.update({ id: userId }, { nickname });

      return { success: true };
    },
  );
}
