import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { config } from '@/config';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(provider: 'google' | 'apple', idToken: string) {
    let email: string | undefined;

    if (provider === 'google') {
      email = await this.verifyGoogleToken(idToken);
    }

    if (provider === 'apple') {
      email = await this.verifyAppleToken(idToken);
    }

    if (!email) {
      throw new UnauthorizedException('Invalid idToken');
    }

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return { userId: user.id };
  }

  private async verifyGoogleToken(
    idToken: string,
  ): Promise<string | undefined> {
    const { data } = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
    );

    if (data.aud !== config.GOOGLE_CLIENT_ID) {
      return undefined;
    }

    return data.email;
  }

  private async verifyAppleToken(idToken: string): Promise<string | undefined> {
    const decoded = jwt.decode(idToken) as any;

    if (decoded?.aud !== config.APPLE_SIWA_CLIENT_ID) {
      return undefined;
    }

    return decoded?.email;
  }
}
