import '@fastify/oauth2';
import '@fastify/jwt';
import 'typeorm';
import { createClient } from 'redis';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: any;
    appleOAuth2: any;
    jwt: {
      sign(payload: any): string;
      verify<T = any>(token: string): T;
    };
    orm: {
      getRepository: (entity: any) => any;
    };
    redis: ReturnType<typeof createClient>;
    redisSubscriber: ReturnType<typeof createClient>;
  }
}
