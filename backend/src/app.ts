import Fastify, { FastifyInstance } from 'fastify';
import { env } from './config';

// plugins
import jwtPlugin from './plugins/jwt.plugin';
import typeormPlugin from './plugins/typeorm.plugin';
import realtimePlugin from './plugins/realtime.plugin';
import redisPlugin from './plugins/redis.plugin';

// modules
import authGoogleRoute from './modules/auth/routes/google.route';
import authAppleRoute from './modules/auth/routes/apple.route';

import userMeRoute from './modules/user/routes/me.route';
import setNicknameRoute from './modules/user/routes/setNickname.route';

export class App {
  private fastify: FastifyInstance;

  constructor() {
    this.fastify = Fastify({
      logger: env.DOPPLER_ENVIRONMENT !== 'prd',
    });

    this.fastify.setErrorHandler((err, req, reply) => {
      if ((err as any).statusCode) {
        return reply.code((err as any).statusCode).send({ error: err.message });
      }

      reply.code(400).send({ error: err.message });
    });
  }

  private async registerPlugins() {
    await this.fastify.register(typeormPlugin);
    await this.fastify.register(jwtPlugin);
    await this.fastify.register(redisPlugin);
    await this.fastify.register(realtimePlugin);
  }

  private async registerRoutes() {
    await this.fastify.register(authGoogleRoute);
    await this.fastify.register(authAppleRoute);

    await this.fastify.register(userMeRoute);
    await this.fastify.register(setNicknameRoute);
  }

  async registerAppleAppSiteAssociate() {
    this.fastify.get(
      '/.well-known/apple-app-site-association',
      async (request, reply) => {
        reply.header('Content-Type', 'application/json');
        return {
          applinks: {
            details: [
              {
                appID: 'LXHBBTZY2Q.com.marcinkondrat.BondUp',
                paths: ['/invite/*'],
              },
            ],
          },
        };
      },
    );

    this.fastify.get('/invite/:code', async (req, reply) => {
      const { code } = req.params as { code: string };
      reply.redirect(`bondup://invite/${code}`);
    });
  }

  async start() {
    try {
      this.registerAppleAppSiteAssociate();
      await this.registerPlugins();
      await this.registerRoutes();

      await this.fastify.listen({ port: env.PORT, host: '0.0.0.0' });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
