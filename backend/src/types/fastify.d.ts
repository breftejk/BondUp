import '@fastify/oauth2';
import '@fastify/jwt';
import 'typeorm';

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
  }
}
