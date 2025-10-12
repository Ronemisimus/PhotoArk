import supertest from 'supertest';
import fastify from '../src/server';
import { generateUploadUrl } from '../src/lib/s3';

// Mock the S3 service
jest.mock('../src/lib/s3', () => ({
  generateUploadUrl: jest.fn(),
}));

describe('Media Routes', () => {
  afterAll(() => {
    fastify.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array when no media exists', async () => {
    const response = await supertest(fastify.server).get('/media');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a new media item', async () => {
    const newMedia = {
      title: 'Test Media',
      description: 'A test media item',
      url: 'http://example.com/media.jpg',
      thumbnailUrl: 'http://example.com/media-thumb.jpg',
      mediaType: 'photo',
    };
    const response = await supertest(fastify.server).post('/media').send(newMedia);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newMedia.title);
  });

  it('should return the created media item', async () => {
    const newMedia = {
      title: 'Another Test',
      description: 'Another test media item',
      url: 'http://example.com/another.jpg',
      thumbnailUrl: 'http://example.com/another-thumb.jpg',
      mediaType: 'video',
    };
    const createResponse = await supertest(fastify.server).post('/media').send(newMedia);
    const mediaId = createResponse.body.id;

    const getResponse = await supertest(fastify.server).get(`/media/${mediaId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe(newMedia.title);
  });

  it('should return a 404 for a non-existent media item', async () => {
    const response = await supertest(fastify.server).get('/media/non-existent-id');
    expect(response.status).toBe(404);
  });

  it('should generate pre-signed URLs', async () => {
    const mockUploadUrl = 'http://s3.com/upload';
    const mockThumbnailUploadUrl = 'http://s3.com/upload-thumb';
    (generateUploadUrl as jest.Mock)
      .mockResolvedValueOnce(mockUploadUrl)
      .mockResolvedValueOnce(mockThumbnailUploadUrl);

    const response = await supertest(fastify.server)
      .post('/media/upload-url')
      .send({
        filename: 'test.jpg',
        thumbnailFilename: 'test-thumb.jpg',
        mediaType: 'photo',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('uploadUrl', mockUploadUrl);
    expect(response.body).toHaveProperty('thumbnailUploadUrl', mockThumbnailUploadUrl);
  });
});
