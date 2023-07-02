const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Test API endpoints', () => {
  beforeEach(async () => {
    // Connect to the MongoDB database before each test
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it('should return "DB CONNECTED" message when the database is connected', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'DB CONNECTED' });
  });

  it('should return an array of users when GET /api/users is called', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new user when POST /api/users is called', async () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    const response = await request(app).post('/api/users').send(user);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
  });

  // Add more test cases as needed for other API endpoints and functionality

  afterEach(async () => {
    // Close the database connection after each test
    await mongoose.connection.close();
  });
});
