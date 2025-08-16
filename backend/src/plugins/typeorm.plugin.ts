import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { DataSource } from 'typeorm';
import ormConfig from '../config/orm.config';

export default fp(async function typeormPlugin(fastify: FastifyInstance) {
  const dataSource = new DataSource(ormConfig);

  await dataSource.initialize();

  fastify.decorate('orm', dataSource);
});
