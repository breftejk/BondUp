import { FastifyInstance } from 'fastify';
import { Invite } from '../entities/invite.entity';
import { Bond } from '../entities/bond.entity';

export default async function acceptInviteRoute(fastify: FastifyInstance) {
  fastify.post('/bond/connect/:code', async (request, reply) => {
    const { userId } = await request.jwtVerify<{ userId: string }>();
    const { code } = request.params as { code: string };

    const inviteRepo = fastify.orm.getRepository(Invite);
    const bondRepo = fastify.orm.getRepository(Bond);

    const invite = await inviteRepo.findOne({ where: { code } });
    if (!invite) {
      return reply.code(404).send({ error: 'Invalid invite code' });
    }

    if (invite.expiresAt < new Date()) {
      return reply.code(400).send({ error: 'Invite expired' });
    }

    if (invite.ownerId === userId) {
      return reply.code(400).send({ error: 'Cannot accept your own invite' });
    }

    if (invite.acceptedBy) {
      return reply.code(400).send({ error: 'Invite already used' });
    }

    // mark as accepted
    invite.acceptedBy = userId;
    await inviteRepo.save(invite);

    // create bond
    await bondRepo.save({ userAId: invite.ownerId, userBId: userId });

    return { success: true };
  });
}
