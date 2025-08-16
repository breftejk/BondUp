import { FastifyInstance } from 'fastify';
import { Bond } from '../entities/bond.entity';
import { User } from '../../auth/entities/user.entity';

export default async function listBondsRoute(fastify: FastifyInstance) {
  fastify.get('/bond', async (request, reply) => {
    const { userId } = await request.jwtVerify<{ userId: string }>();

    const bondRepo = fastify.orm.getRepository(Bond);
    const userRepo = fastify.orm.getRepository(User);

    const bonds = await bondRepo
      .createQueryBuilder('b')
      .where('b.userAId = :id OR b.userBId = :id', { id: userId })
      .getMany();

    // map to "other user"
    const result = await Promise.all(
      bonds.map(async (b: any) => {
        const otherId = b.userAId === userId ? b.userBId : b.userAId;
        const otherUser = await userRepo.findOneBy({ id: otherId });
        return {
          bondId: b.id,
          userId: otherUser?.id,
          nickname: otherUser?.nickname,
        };
      }),
    );

    return result;
  });
}
