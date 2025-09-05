// src/routes/health.test.ts
import request from 'supertest';
import app from './app'; // Import your Express app

describe('GET /health', () => {
  it('should respond with a 200 status code and a status message', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('uptime');
  });
});