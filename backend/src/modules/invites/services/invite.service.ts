import { FastifyInstance } from 'fastify';
import { Repository, Not } from 'typeorm';
import { Invite } from '../entities/invite.entitity';
import { UserService } from '../../user/services/user.service';
import { randomUUID } from 'crypto';

export class InviteService {
  private readonly repo: Repository<Invite>;
  private readonly userService: UserService;
  private readonly redis;

  constructor(fastify: FastifyInstance) {
    this.repo = fastify.orm.getRepository(Invite);
    this.userService = new UserService(fastify);
    this.redis = fastify.redis;
  }

  /**
   * Send invite to user by username
   */
  async sendByUsername(fromUserId: string, username: string) {
    const toUserId = await this.userService.getIdByNickname(username);
    if (!toUserId) throw new Error('User not found');
    if (toUserId === fromUserId) throw new Error('Cannot invite yourself');

    /*if (await friendService.areFriends(invite.fromUserId, acceptedBy)) {
      throw new Error('You are already friends');
    }*/

    // check for existing PENDING invite for this pair
    const existing = await this.repo.findOne({
      where: { fromUserId, toUserId, status: 'PENDING' },
    });
    if (existing) {
      throw new Error('Invite already sent');
    }

    const invite = await this.repo.save({
      fromUserId,
      toUserId,
      status: 'PENDING',
    });

    await this.redis.publish(
      'events',
      JSON.stringify({
        type: 'invitation_sent',
        userId: toUserId,
        from: fromUserId,
        inviteId: invite.id,
      }),
    );

    return invite;
  }

  /**
   * Generate invite link (code)
   */
  async generateLink(fromUserId: string) {
    const code = randomUUID();
    await this.repo.save({ fromUserId, code, status: 'PENDING' });
    return { code };
  }

  async acceptById(inviteId: string, acceptedBy: string) {
    const invite = await this.repo.findOne({
      where: { id: inviteId, status: 'PENDING' },
    });
    if (!invite) throw new Error('Invalid invite');
    if (invite.toUserId !== acceptedBy)
      throw new Error('Not authorized to accept this invite');

    /*if (await friendService.areFriends(invite.fromUserId, acceptedBy)) {
      throw new Error('You are already friends');
    }*/

    await this.repo.update(inviteId, {
      status: 'ACCEPTED',
      acceptedAt: new Date(),
    });

    await this.redis.publish(
      'events',
      JSON.stringify({
        type: 'invitation_accepted',
        userId: invite.fromUserId,
        inviteId,
      }),
    );
  }

  async acceptByCode(code: string, acceptedBy: string) {
    const invite = await this.repo.findOne({
      where: { code, status: 'PENDING' },
    });
    if (!invite) throw new Error('Invalid or expired invite code');
    if (invite.fromUserId === acceptedBy)
      throw new Error('Cannot accept your own invite');

    /*if (await friendService.areFriends(invite.fromUserId, acceptedBy)) {
      throw new Error('You are already friends');
    }*/

    await this.repo.update(invite.id, {
      toUserId: acceptedBy,
      status: 'ACCEPTED',
      acceptedAt: new Date(),
    });

    await this.redis.publish(
      'events',
      JSON.stringify({
        type: 'invitation_accepted',
        userId: invite.fromUserId,
        inviteId: invite.id,
      }),
    );
  }
}
