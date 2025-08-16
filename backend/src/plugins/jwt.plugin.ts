import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';

export default fp(async function jwtPlugin(fastify: FastifyInstance) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  fastify.register(fastifyJwt, {
    secret,
  });
});
