import { FastifyInstance } from 'fastify';
import { User } from '../entities/user.entity';

export default async function (fastify: FastifyInstance) {
  fastify.get('/me', async (request, reply) => {
    const { userId } = await request.jwtVerify<{ userId: string }>();

    const repo = fastify.orm.getRepository(User);
    const user = await repo.findOneByOrFail({ id: userId });

    console.log('Fetching user:', userId);

    return {
      id: user.id,
      nickname: user.nickname,
    };
  });
}
