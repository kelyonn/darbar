import request from 'supertest';
import app from '../src/index';
import { User } from '../src/models/User';

describe('Auth Endpoints', () => {
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: 'Password123'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/account created/i);
    
    const userInDb = await User.findOne({ email: testUser.email });
    expect(userInDb).toBeTruthy();
    expect(userInDb?.firstName).toBe(testUser.firstName);
  });

  it('should not register user with existing email', async () => {
    // Register first time
    await request(app).post('/api/auth/register').send(testUser);
    
    // Register second time
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/An account with this email already exists/i);
  });
});
