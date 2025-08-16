import { FastifyInstance } from 'fastify';
import { User } from '../../auth/entities/user.entity';

export default async function (fastify: FastifyInstance) {
  fastify.patch('/me/nickname', async (request, reply) => {
    const { userId } = await request.jwtVerify<{ userId: string }>();
    const { nickname } = request.body as { nickname: string };

    const regex = /^[a-z0-9]+$/;
    if (!regex.test(nickname)) {
      return reply.code(400).send({
        error: 'Nickname can contain only lowercase letters and numbers',
      });
    }

    const repo = fastify.orm.getRepository(User);
    const existing = await repo.findOne({ where: { nickname } });
    if (existing) {
      return reply.code(409).send({ error: 'Nickname is already taken' });
    }

    await repo.update({ id: userId }, { nickname });

    return { success: true };
  });
}
