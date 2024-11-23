// auth.test.js
jest.mock('../db/index'); // Prevents actual DB connections
process.env.JWT_SECRET = 'secret'; // Mocked JWT secret

const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const authRoutes = require('../routes/auth');
const User = require('../models/User');

// Mock User Model
jest.mock('../models/User');

// Set up app with auth route
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      User.prototype.save = jest.fn().mockResolvedValue({});
      const response = await request(app).post('/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
  
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });
  
    it('should return an error if fields are missing', async () => {
      const response = await request(app).post('/auth/register').send({
        username: 'testuser',
        email: '',
        password: 'password123',
      });
  
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user successfully', async () => {
      User.findOne = jest.fn().mockResolvedValue({
        _id: 'userId123',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      });
  
      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
    });
  
    it('should return an error for invalid email', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
  
      const response = await request(app).post('/auth/login').send({
        email: 'wrong@example.com',
        password: 'password123',
      });
  
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });
  
    it('should return an error for invalid password', async () => {
      User.findOne = jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: await bcrypt.hash('correctpassword', 10),
      });
  
      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
  
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });
  });
  