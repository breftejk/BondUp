import { FastifyInstance } from 'fastify';
import { Bond } from '../entities/bond.entity';

export default async function unbondRoute(fastify: FastifyInstance) {
  fastify.delete('/bond/:bondId', async (request, reply) => {
    const { userId } = await request.jwtVerify<{ userId: string }>();
    const { bondId } = request.params as { bondId: string };

    const repo = fastify.orm.getRepository(Bond);
    const bond = await repo.findOne({ where: { id: bondId } });

    if (!bond) {
      return reply.code(404).send({ error: 'Bond not found' });
    }

    if (bond.userAId !== userId && bond.userBId !== userId) {
      return reply.code(403).send({ error: 'Not your bond' });
    }

    await repo.delete(bondId);
    return { success: true };
  });
}
