import { FastifyInstance } from 'fastify';
import { Invite } from '../entities/invite.entity';

export default async function listInvitesRoute(fastify: FastifyInstance) {
  fastify.get('/bond/invites', async (request, reply) => {
    const { userId } = await request.jwtVerify<{ userId: string }>();

    const inviteRepo = fastify.orm.getRepository(Invite);
    const invites = await inviteRepo.find({
      where: { acceptedBy: null },
    });

    const result = invites.filter((inv: Invite) => inv.ownerId !== userId);

    return result.map((inv: Invite) => ({
      id: inv.id,
      code: inv.code,
      ownerId: inv.ownerId,
      expiresAt: inv.expiresAt,
    }));
  });
}
