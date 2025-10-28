const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Audio = require('../src/models/Audio');
const fs = require('fs');
const path = require('path');

const TEST_DB = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/kaiapo_audio_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB, { useNewUrlParser: true, useUnifiedTopology: true });
  await Audio.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Audio API (local uploads)', () => {
  test('should upload an audio and store metadata', async () => {
    const res = await request(app)
      .post('/api/audios')
      .field('name', 'Test User')
      .field('email', 'test@example.com')
      .field('agreePrivacy', 'true')
      .field('community', 'kaiapo')
      .field('service', 'Tutorial X')
      .attach('audio', path.join(__dirname, 'dummy.mp3'));

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('audio');
    expect(res.body.audio).toHaveProperty('filename');
    expect(res.body.audio.name).toBe('Test User');

    // check DB saved
    const dbEntry = await Audio.findOne({ email: 'test@example.com' });
    expect(dbEntry).not.toBeNull();
    expect(dbEntry.community).toBe('kaiapo');
  });

  test('should list audios', async () => {
    const res = await request(app).get('/api/audios');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
