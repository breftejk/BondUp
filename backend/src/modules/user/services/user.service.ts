import { FastifyInstance } from 'fastify';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

type ProviderProfile = {
  provider: 'google' | 'apple';
  providerId: string;
  email: string | null;
  nickname: string | null;
};

export class UserService {
  private readonly repo: Repository<User>;

  constructor(fastify: FastifyInstance) {
    this.repo = fastify.orm.getRepository(User);
  }

  async getById(id: string) {
    return this.repo.findOneBy({ id });
  }

  async getIdByNickname(nickname: string): Promise<string | null> {
    const user = await this.repo.findOne({
      where: { nickname },
      select: ['id'],
    });
    return user?.id ?? null;
  }

  /**
   * Find or create user based on provider profile
   */
  async findOrCreate(profile: ProviderProfile): Promise<User> {
    const whereClause =
      profile.provider === 'google'
        ? { googleId: profile.providerId }
        : { appleId: profile.providerId };

    let user = await this.repo.findOne({ where: whereClause });

    if (!user) {
      user = this.repo.create({
        email: profile.email,
        nickname: profile.nickname,
        googleId: profile.provider === 'google' ? profile.providerId : null,
        appleId: profile.provider === 'apple' ? profile.providerId : null,
      });

      await this.repo.save(user);
    }

    return user;
  }
}
