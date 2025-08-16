import { FastifyInstance } from 'fastify';
import { User } from '../../auth/entities/user.entity';

export default async function (fastify: FastifyInstance) {
  fastify.get('/me', async (request, reply) => {
    const { userId } = await request.jwtVerify<{ userId: string }>();

    const repo = fastify.orm.getRepository(User);
    const user = await repo.findOneByOrFail({ id: userId });

    return {
      id: user.id,
      nickname: user.nickname,
    };
  });
}
