const request = require('supertest');
const assert = require('assert');
const app = require('../server/index');

describe('GET /qa', () => {
  it('responds with json', async () => {
    const res = await request(app)
      .get('/qa')
      .query({ product_id: 1 });
    expect(res.statusCode).toEqual(200);
  });
});
