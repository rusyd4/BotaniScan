const request = require('supertest');
const express = require('express');
const historyRoutes = require('../routes/history');
const User = require('../models/User');
const Plant = require('../models/Plant');
const authenticate = require('../middleware/authenticate');

// Mock models and middleware
jest.mock('../models/User');
jest.mock('../models/Plant');
jest.mock('../middleware/authenticate', () => jest.fn((req, res, next) => {
  req.userId = 'mockUserId';
  next();
}));

// Set up express app
const app = express();
app.use(express.json());
app.use('/history', historyRoutes);

// Silence console errors during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe('POST /history', () => {
  it('should add a plant to the user\'s history and collection successfully', async () => {
    // Mock user
    const mockUser = {
      _id: 'mockUserId',
      history: [],
      collection: [],
      save: jest.fn(),
    };

    User.findById = jest.fn().mockResolvedValue(mockUser);

    // Mock plant creation
    Plant.prototype.save = jest.fn().mockResolvedValue({
      _id: 'mockPlantId',
      species: 'Mock Species',
      confidence: 0.95,
      rarity: 'Rare',
    });

    // Send request
    const response = await request(app).post('/history').send({
      species: 'Mock Species',
      confidence: 0.95,
      rarity: 'Rare',
    });

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Plant added to history');
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('should return an error if required fields are missing', async () => {
    const response = await request(app).post('/history').send({
      species: '',
      confidence: null,
      rarity: 'Rare',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Species, confidence, and rarity are required');
  });

  it('should return an error if the user is not found', async () => {
    User.findById = jest.fn().mockResolvedValue(null);

    const response = await request(app).post('/history').send({
      species: 'Mock Species',
      confidence: 0.95,
      rarity: 'Rare',
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  it('should return a server error if saving the plant fails', async () => {
    User.findById = jest.fn().mockResolvedValue({
      _id: 'mockUserId',
      history: [],
      collection: [],
      save: jest.fn(),
    });

    Plant.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app).post('/history').send({
      species: 'Mock Species',
      confidence: 0.95,
      rarity: 'Rare',
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to add plant to history');
  });
});
