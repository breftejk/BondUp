import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { config } from '@/config';
import jwksRsa from 'jwks-rsa';
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(provider: 'google' | 'apple', idToken: string) {
    let email: string | undefined;

    if (provider === 'google') {
      email = await this.verifyGoogleToken(idToken);
    } else if (provider === 'apple') {
      email = await this.verifyAppleToken(idToken);
    } else {
      throw new UnauthorizedException('Unsupported provider');
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

  /** Google Sign In token validation */
  private async verifyGoogleToken(
    idToken: string,
  ): Promise<string | undefined> {
    const googleClient = jwksRsa({
      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 3600_000,
    });

    const getKey = (header: JwtHeader, cb: SigningKeyCallback) => {
      googleClient.getSigningKey(header.kid!, (err, key) => {
        const publicKey = key?.getPublicKey();
        cb(err, publicKey);
      });
    };

    try {
      const decoded = jwt.verify(idToken, getKey, {
        algorithms: ['RS256'],
        issuer: ['https://accounts.google.com', 'accounts.google.com'],
        audience: config.GOOGLE_CLIENT_ID,
      }) as any;

      return decoded.email;
    } catch {
      return undefined;
    }
  }

  /** Apple Sign In token validation */
  private async verifyAppleToken(idToken: string): Promise<string | undefined> {
    const appleClient = jwksRsa({
      jwksUri: 'https://appleid.apple.com/auth/keys',
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 3600_000,
    });

    const getKey = (header: JwtHeader, cb: SigningKeyCallback) => {
      appleClient.getSigningKey(header.kid!, (err, key) => {
        const publicKey = key?.getPublicKey();
        cb(err, publicKey);
      });
    };

    try {
      const decoded = jwt.verify(idToken, getKey, {
        algorithms: ['RS256'],
        issuer: 'https://appleid.apple.com',
        audience: config.APPLE_SIWA_CLIENT_ID,
      }) as any;

      return decoded.email;
    } catch {
      return undefined;
    }
  }
}
