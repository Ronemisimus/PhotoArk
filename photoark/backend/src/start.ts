import fastify from './server.js';

// Start the server
const start = async () => {
  try {
    const port = Number((fastify as any).config.PORT);
    await fastify.listen({ port: port, host: '0.0.0.0' });
    fastify.log.info(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
