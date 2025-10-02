import Fastify, { FastifyInstance } from 'fastify';
import healthRoutes from '../src/routes/health.js';

describe('GET /health', () => {
  let app: FastifyInstance;

  beforeAll(() => {
    app = Fastify();
    app.register(healthRoutes);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with status ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(payload.status).toBe('ok');
    expect(payload).toHaveProperty('timestamp');
  });
});