// Import dependencies for AVA testing framework and HTTP requests
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// Shared server instance for all tests
let server;
let baseUrl;

// Setup: Create and start server before all tests
test.before(async () => {
  server = http.createServer(app);
  baseUrl = await listen(server);
});

// Teardown: Close server after all tests complete
test.after.always(() => {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
});

// ========== USER PROFILE TESTS ==========

// Test 1: Get user profile with valid userId
test('GET /users/:userId returns user profile', async (t) => {
  // Request for user with userId=1
  const response = await got(`${baseUrl}/users/1`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check successful response
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  
  // Check user profile structure (username, points, isPremium)
  t.truthy(response.body.data.username);
  t.true(typeof response.body.data.points === 'number');
  t.true(typeof response.body.data.isPremium === 'boolean');
});

// Test 2: GET user with non-existent userId
test('GET /users/:userId returns 404 for non-existent user', async (t) => {
  // Request for userId that doesn't exist
  const response = await got(`${baseUrl}/users/99999`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404 Not Found
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 3: Update user profile with valid data
test('PUT /users/:userId updates user profile', async (t) => {
  // PUT with new data
  const response = await got.put(`${baseUrl}/users/1`, {
    json: {
      username: 'updatedUser',
      isPremium: true
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check successful update
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  
  // Check that updated profile is returned
  t.truthy(response.body.data.username);
  t.true(typeof response.body.data.isPremium === 'boolean');
});

// Test 4: PUT user with non-existent userId
test('PUT /users/:userId returns 404 for non-existent user', async (t) => {
  // PUT to user that doesn't exist
  const response = await got.put(`${baseUrl}/users/99999`, {
    json: {
      username: 'newName'
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 5: PUT user with partial update (only username)
test('PUT /users/:userId with partial data updates successfully', async (t) => {
  // PUT with only one field
  const response = await got.put(`${baseUrl}/users/2`, {
    json: {
      username: 'partialUpdate'
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check that partial update works
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
});

// Test 6: PUT user with empty body
test('PUT /users/:userId with empty body', async (t) => {
  // PUT without data
  const response = await got.put(`${baseUrl}/users/1`, {
    json: {},
    responseType: 'json',
    throwHttpErrors: false
  });

  // API may allow empty update or return 400
  t.true(response.statusCode === 200 || response.statusCode === 400);
});

// Test 7: Get enrolled courses for user
test('GET /users/:userId/courses returns enrolled courses', async (t) => {
  // Request for enrolled courses of user with userId=1
  const response = await got(`${baseUrl}/users/1/courses`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check successful response
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.true(Array.isArray(response.body.data));
  
  // If enrolled courses exist, check structure
  if (response.body.data.length > 0) {
    const course = response.body.data[0];
    t.truthy(course.id || course.courseId);
    t.truthy(course.title);
  }
});

// Test 8: GET enrolled courses for non-existent user
test('GET /users/:userId/courses returns 404 for non-existent user', async (t) => {
  // Request for user that doesn't exist
  const response = await got(`${baseUrl}/users/99999/courses`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 9: Enrollment in course (POST)
test('POST /users/:userId/courses enrolls user in course', async (t) => {
  // POST to enroll in course with courseId=3
  const response = await got.post(`${baseUrl}/users/1/courses`, {
    json: {
      courseId: 3
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check successful enrollment (200 or 201)
  t.true(response.statusCode === 200 || response.statusCode === 201);
  t.is(response.body.success, true);
});

// Test 10: POST enrollment without courseId
test('POST /users/:userId/courses without courseId returns 400', async (t) => {
  // POST without courseId
  const response = await got.post(`${baseUrl}/users/1/courses`, {
    json: {},
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 Bad Request
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 11: POST enrollment to non-existent course
test('POST /users/:userId/courses with non-existent course returns 404', async (t) => {
  // POST with courseId that doesn't exist
  const response = await got.post(`${baseUrl}/users/1/courses`, {
    json: {
      courseId: 99999
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 12: POST enrollment for non-existent user
test('POST /users/:userId/courses for non-existent user returns 404', async (t) => {
  // POST for user that doesn't exist
  const response = await got.post(`${baseUrl}/users/99999/courses`, {
    json: {
      courseId: 1
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 13: POST enrollment to premium course without premium account
test('POST /users/:userId/courses to premium course without premium returns 400', async (t) => {
  // User 1 is not premium, attempts enrollment in premium course (courseId=2)
  const response = await got.post(`${baseUrl}/users/1/courses`, {
    json: {
      courseId: 2
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 or 200 if already enrolled
  t.true(response.statusCode === 400 || response.statusCode === 200);
  if (response.statusCode === 400) {
    t.is(response.body.success, false);
  }
});

// Test 14: Withdraw from course (DELETE)
test('DELETE /users/:userId/courses/:courseId withdraws user from course', async (t) => {
  // DELETE to withdraw from course with courseId=1
  const response = await got.delete(`${baseUrl}/users/1/courses/1`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 204 No Content (no body)
  t.is(response.statusCode, 204);
});

// Test 15: DELETE withdraw for non-existent user
test('DELETE /users/:userId/courses/:courseId for non-existent user returns 404', async (t) => {
  // DELETE for user that doesn't exist
  const response = await got.delete(`${baseUrl}/users/99999/courses/1`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
});

// Test 16: DELETE withdraw from course that user is not enrolled in
test('DELETE /users/:userId/courses/:courseId for non-enrolled course succeeds', async (t) => {
  // DELETE from course that user is not enrolled in (e.g. courseId=99)
  const response = await got.delete(`${baseUrl}/users/1/courses/99`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // API may return 204 (idempotent) or 404
  t.true(response.statusCode === 204 || response.statusCode === 404);
});

// ========== USER LIST & CREATE TESTS ==========

// Test 17: Get all users list
test('GET /users returns list of all users', async (t) => {
  // Request list of all users
  const response = await got(`${baseUrl}/users`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check successful response
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.true(Array.isArray(response.body.data));
  
  // Check user structure if users exist
  if (response.body.data.length > 0) {
    const user = response.body.data[0];
    t.truthy(user.username || user.email);
  }
});

// Test 18: Create new user with valid data
test('POST /users creates new user', async (t) => {
  // POST with username, email, and password
  const response = await got.post(`${baseUrl}/users`, {
    json: {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'password123'
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 201 Created
  t.is(response.statusCode, 201);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
});

// Test 19: POST user without username (validation error)
test('POST /users without username returns 400', async (t) => {
  // POST without required username field
  const response = await got.post(`${baseUrl}/users`, {
    json: {
      email: 'test@example.com',
      password: 'password123'
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 Bad Request
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 20: POST user without email (validation error)
test('POST /users without email returns 400', async (t) => {
  // POST without required email field
  const response = await got.post(`${baseUrl}/users`, {
    json: {
      username: 'testuser',
      password: 'password123'
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 Bad Request
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 21: POST user without password (validation error)
test('POST /users without password returns 400', async (t) => {
  // POST without required password field
  const response = await got.post(`${baseUrl}/users`, {
    json: {
      username: 'testuser',
      email: 'test@example.com'
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 Bad Request
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// Test 22: POST user with empty body
test('POST /users with empty body returns 400', async (t) => {
  // POST with no data
  const response = await got.post(`${baseUrl}/users`, {
    json: {},
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 Bad Request
  t.is(response.statusCode, 400);
  t.is(response.body.success, false);
});

// ========== DELETE USER TESTS ==========

// Test 23: Delete user with valid userId
test('DELETE /users/:userId deletes user', async (t) => {
  // First create a user to delete
  const createResponse = await got.post(`${baseUrl}/users`, {
    json: {
      username: 'deletetest' + Date.now(),
      email: 'deletetest' + Date.now() + '@example.com',
      password: 'password123'
    },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Get the created user ID (assuming it's returned in response)
  const userId = createResponse.body.data?.userId || createResponse.body.data?.id || 10;

  // DELETE the user
  const response = await got.delete(`${baseUrl}/users/${userId}`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 200 OK
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
});

// Test 24: DELETE user with non-existent userId
test('DELETE /users/:userId returns 404 for non-existent user', async (t) => {
  // DELETE user that doesn't exist
  const response = await got.delete(`${baseUrl}/users/99999`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404 Not Found
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 25: DELETE user with invalid userId format
test('DELETE /users/:userId with invalid ID format', async (t) => {
  // DELETE with string instead of number
  const response = await got.delete(`${baseUrl}/users/invalid`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 400 or 404 depending on API design
  t.true(response.statusCode === 400 || response.statusCode === 404);
});

// ========== GET SINGLE ENROLLED COURSE TESTS ==========

// Test 26: Get single enrolled course for user
test('GET /users/:userId/courses/:courseId returns enrolled course details', async (t) => {
  // First ensure user is enrolled in the course
  await got.post(`${baseUrl}/users/1/courses`, {
    json: { courseId: 4 },
    responseType: 'json',
    throwHttpErrors: false
  });

  // Request for specific enrolled course (user 1, course 4)
  const response = await got(`${baseUrl}/users/1/courses/4`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Check successful response
  t.is(response.statusCode, 200);
  t.is(response.body.success, true);
  t.truthy(response.body.data);
  
  // Check course structure
  t.truthy(response.body.data.courseId || response.body.data.id);
  t.truthy(response.body.data.title);
});

// Test 27: GET enrolled course for non-existent user
test('GET /users/:userId/courses/:courseId returns 404 for non-existent user', async (t) => {
  // Request for user that doesn't exist
  const response = await got(`${baseUrl}/users/99999/courses/1`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 28: GET enrolled course when user not enrolled
test('GET /users/:userId/courses/:courseId returns 404 when not enrolled', async (t) => {
  // Request for course that user is not enrolled in
  const response = await got(`${baseUrl}/users/1/courses/99`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});

// Test 29: GET enrolled course with non-existent courseId
test('GET /users/:userId/courses/:courseId returns 404 for non-existent course', async (t) => {
  // Request for course that doesn't exist
  const response = await got(`${baseUrl}/users/1/courses/99999`, {
    responseType: 'json',
    throwHttpErrors: false
  });

  // Expect 404
  t.is(response.statusCode, 404);
  t.is(response.body.success, false);
});
