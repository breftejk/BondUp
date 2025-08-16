import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';

export default fp(async function realtimePlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyWebsocket);

  // Map<userId, WebSocket>
  const clients = new Map<string, WebSocket>();

  // HTTP -> WS upgrade endpoint
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    const { userId } = req.query as { userId: string };

    clients.set(userId, connection.socket);

    connection.socket.on('close', () => {
      clients.delete(userId);
    });
  });

  // Redis subscriber (singleton)
  const subscriber = fastify.redisSubscriber;

  await subscriber.subscribe('events', (message: string) => {
    const event = JSON.parse(message);

    // dispatch event -> WebSocket
    const socket = clients.get(event.userId);
    if (!socket) return;

    switch (event.type) {
      case 'invitation_sent':
        socket.send(
          JSON.stringify({ type: 'invitation_sent', from: event.from }),
        );
        break;

      case 'invitation_accepted':
        socket.send(
          JSON.stringify({
            type: 'invitation_accepted',
            inviteId: event.inviteId,
          }),
        );
        break;

      case 'bond_created':
        socket.send(
          JSON.stringify({ type: 'bond_created', createdBy: event.createdBy }),
        );
        break;
    }
  });
});
