import Fastify, { FastifyInstance } from 'fastify';
import { env } from './config';

// plugins
import jwtPlugin from './plugins/jwt.plugin';
import typeormPlugin from './plugins/typeorm.plugin';

// modules
import authGoogleRoute from './modules/auth/routes/google.route';
import authAppleRoute from './modules/auth/routes/apple.route';

import userMeRoute from './modules/user/routes/me.route';
import setNicknameRoute from './modules/user/routes/setNickname.route';

import generateInviteRoute from './modules/bond/routes/generateInvite.route';
import acceptInviteRoute from './modules/bond/routes/acceptInvite.route';
import listBondsRoute from './modules/bond/routes/listBonds.route';
import unbondRoute from './modules/bond/routes/unbound.route';

export class App {
  private fastify: FastifyInstance;

  constructor() {
    this.fastify = Fastify({
      logger: env.DOPPLER_ENVIRONMENT !== 'prd',
    });
  }

  private async registerPlugins() {
    await this.fastify.register(typeormPlugin);
    await this.fastify.register(jwtPlugin);
  }

  private async registerRoutes() {
    await this.fastify.register(authGoogleRoute);
    await this.fastify.register(authAppleRoute);

    await this.fastify.register(userMeRoute);
    await this.fastify.register(setNicknameRoute);

    await this.fastify.register(generateInviteRoute);
    await this.fastify.register(acceptInviteRoute);
    await this.fastify.register(listBondsRoute);
    await this.fastify.register(unbondRoute);
  }

  async start() {
    try {
      await this.registerPlugins();
      await this.registerRoutes();

      await this.fastify.listen({ port: env.PORT, host: '0.0.0.0' });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
