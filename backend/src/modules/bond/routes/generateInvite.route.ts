import { FastifyInstance } from 'fastify';
import { Invite } from '../entities/invite.entity';

export default async function generateInviteRoute(fastify: FastifyInstance) {
  fastify.post('/bond/invite', async (request, reply) => {
    const { userId } = await request.jwtVerify<{ userId: string }>();

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const repo = fastify.orm.getRepository(Invite);
    const invite = repo.create({ code, ownerId: userId, expiresAt });
    await repo.save(invite);

    return { code };
  });
}
