import * as Fastify from 'fastify';

const app = Fastify.fastify();

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.listen({
  port: 3000,
  host: '0.0.0.0',
});

export default app;
