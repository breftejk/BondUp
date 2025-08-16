import fp from 'fastify-plugin';
import { createClient } from 'redis';
import { FastifyInstance } from 'fastify';
import { env } from '../config';

export default fp(async function redisPlugin(fastify: FastifyInstance) {
  const client = createClient({ url: env.REDIS_URL });
  await client.connect();

  const subscriber = client.duplicate();
  await subscriber.connect();

  fastify.decorate('redis', client);
  fastify.decorate('redisSubscriber', subscriber);
});
