import { FastifyInstance } from 'fastify';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { env } from '../../../config';
import { UserService } from '../../user/services/user.service';

const googleClient = new google.auth.OAuth2();

interface VerifyResponse {
  token: string;
  requiresProfile: boolean;
}

export async function verifyGoogleToken(
  fastify: FastifyInstance,
  idToken: string,
): Promise<VerifyResponse> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID!,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.sub) {
    throw new Error('Invalid Google token payload');
  }

  const userService = new UserService(fastify);
  const user = await userService.findOrCreate({
    provider: 'google',
    providerId: payload.sub,
    email: payload.email || null,
    nickname: payload.given_name || null,
  });

  const internalToken = fastify.jwt.sign({ userId: user.id });
  const requiresProfile = !user.nickname;

  return {
    token: internalToken,
    requiresProfile,
  };
}

/* --------------------------- VERIFY APPLE TOKEN ---------------------------- */

const appleJwksClient = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
});

export async function verifyAppleToken(
  fastify: FastifyInstance,
  idToken: string,
): Promise<VerifyResponse> {
  const decodedToken: any = jwt.decode(idToken, { complete: true });
  if (!decodedToken || !decodedToken.header.kid) {
    throw new Error('Invalid Apple token format');
  }

  const key = await appleJwksClient.getSigningKey(decodedToken.header.kid);
  const publicKey = key.getPublicKey();

  const payload: any = jwt.verify(idToken, publicKey, {
    algorithms: ['RS256'],
    audience: env.APPLE_SIWA_CLIENT_ID,
    issuer: 'https://appleid.apple.com',
  });

  const userService = new UserService(fastify);
  const user = await userService.findOrCreate({
    provider: 'apple',
    providerId: payload.sub,
    email: payload.email || null,
    nickname: null,
  });

  const internalToken = fastify.jwt.sign({ userId: user.id });
  const requiresProfile = !user.nickname;

  return {
    token: internalToken,
    requiresProfile,
  };
}
