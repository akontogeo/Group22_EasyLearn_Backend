// Import dependencies for AVA testing framework and HTTP requests
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// Test 1: Get reviews/ratings for a specific course
test('GET /courses/:courseId/reviews returns ratings list', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request reviews for course with courseId=1
    const response = await got(`${baseUrl}/courses/1/reviews`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Check successful response
    t.is(response.statusCode, 200);
    t.is(response.body.success, true);
    t.true(Array.isArray(response.body.data));
  } finally {
    server.close();
  }
});

// Test 2: Get reviews for non-existent course
test('GET /courses/:courseId/reviews returns 404 for non-existent course', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request for courseId that doesn't exist
    const response = await got(`${baseUrl}/courses/99999/reviews`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Expect 404
    t.is(response.statusCode, 404);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 3: Submit new review (POST) with valid data
test('POST /courses/:courseId/reviews creates new rating', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST with userId, stars, and comment
    const response = await got.post(`${baseUrl}/courses/1/reviews`, {
      json: {
        userId: 1,
        stars: 5,
        comment: 'Excellent course!'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Expect 201 Created
    t.is(response.statusCode, 201);
    t.is(response.body.success, true);
    t.truthy(response.body.data);
  } finally {
    server.close();
  }
});

// Test 4: POST review without userId (validation error)
test('POST /courses/:courseId/reviews without userId returns 400', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST without userId
    const response = await got.post(`${baseUrl}/courses/1/reviews`, {
      json: {
        stars: 4,
        comment: 'Good course'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Expect 400 Bad Request
    t.is(response.statusCode, 400);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 5: POST review without stars (validation error)
test('POST /courses/:courseId/reviews without stars returns 400', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST without stars
    const response = await got.post(`${baseUrl}/courses/1/reviews`, {
      json: {
        userId: 2,
        comment: 'Nice'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Expect 400
    t.is(response.statusCode, 400);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 6: POST review with invalid stars (outside 1-5 range)
test('POST /courses/:courseId/reviews with invalid stars returns 400', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST with stars=0 (out of range)
    const response = await got.post(`${baseUrl}/courses/1/reviews`, {
      json: {
        userId: 3,
        stars: 0,
        comment: 'Bad'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Expect 400 - confirm status and success flag only
    t.is(response.statusCode, 400);
    t.is(response.body.success, false);
    t.truthy(response.body.error);
  } finally {
    server.close();
  }
});
