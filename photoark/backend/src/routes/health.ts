import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

/**
 * Health check routes for the service.
 * @param {FastifyInstance} fastify
 * @param {object} options
 */
export default async function healthRoutes(fastify: FastifyInstance, options: object) {
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
}