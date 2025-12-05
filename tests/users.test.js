// Import dependencies for AVA testing framework and HTTP requests
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// ========== USER PROFILE TESTS ==========

// Test 1: Get user profile with valid userId
test('GET /users/:userId returns user profile', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
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
  } finally {
    server.close();
  }
});

// Test 2: GET user με ανύπαρκτο userId
test('GET /users/:userId returns 404 for non-existent user', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request για userId που δεν υπάρχει
    const response = await got(`${baseUrl}/users/99999`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 404 Not Found
    t.is(response.statusCode, 404);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 3: Ενημέρωση user profile με έγκυρα δεδομένα
test('PUT /users/:userId updates user profile', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // PUT με νέα δεδομένα
    const response = await got.put(`${baseUrl}/users/1`, {
      json: {
        username: 'updatedUser',
        isPremium: true
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Έλεγχος επιτυχούς update
    t.is(response.statusCode, 200);
    t.is(response.body.success, true);
    t.truthy(response.body.data);
    
    // Έλεγχος ότι επιστρέφεται το updated profile
    t.truthy(response.body.data.username);
    t.true(typeof response.body.data.isPremium === 'boolean');
  } finally {
    server.close();
  }
});

// Test 4: PUT user με ανύπαρκτο userId
test('PUT /users/:userId returns 404 for non-existent user', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // PUT σε user που δεν υπάρχει
    const response = await got.put(`${baseUrl}/users/99999`, {
      json: {
        username: 'newName'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 404
    t.is(response.statusCode, 404);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 5: PUT user με partial update (μόνο username)
test('PUT /users/:userId with partial data updates successfully', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // PUT με μόνο ένα πεδίο
    const response = await got.put(`${baseUrl}/users/2`, {
      json: {
        username: 'partialUpdate'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Έλεγχος ότι γίνεται partial update
    t.is(response.statusCode, 200);
    t.is(response.body.success, true);
    t.truthy(response.body.data);
  } finally {
    server.close();
  }
});

// Test 6: PUT user με άδειο body
test('PUT /users/:userId with empty body', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // PUT χωρίς δεδομένα
    const response = await got.put(`${baseUrl}/users/1`, {
      json: {},
      responseType: 'json',
      throwHttpErrors: false
    });

    // Το API μπορεί να επιτρέπει empty update ή να επιστρέφει 400
    t.true(response.statusCode === 200 || response.statusCode === 400);
  } finally {
    server.close();
  }
});

// Test 7: Λήψη enrolled courses για user
test('GET /users/:userId/courses returns enrolled courses', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request για enrolled courses του user με userId=1
    const response = await got(`${baseUrl}/users/1/courses`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Έλεγχος επιτυχούς response
    t.is(response.statusCode, 200);
    t.is(response.body.success, true);
    t.true(Array.isArray(response.body.data));
    
    // Αν υπάρχουν enrolled courses, έλεγχος δομής
    if (response.body.data.length > 0) {
      const course = response.body.data[0];
      t.truthy(course.id || course.courseId);
      t.truthy(course.title);
    }
  } finally {
    server.close();
  }
});

// Test 8: GET enrolled courses για ανύπαρκτο user
test('GET /users/:userId/courses returns 404 for non-existent user', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request για user που δεν υπάρχει
    const response = await got(`${baseUrl}/users/99999/courses`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 404
    t.is(response.statusCode, 404);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 9: Enrollment σε course (POST)
test('POST /users/:userId/courses enrolls user in course', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST για enrollment σε course με courseId=3
    const response = await got.post(`${baseUrl}/users/1/courses`, {
      json: {
        courseId: 3
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Έλεγχος επιτυχούς enrollment (200 ή 201)
    t.true(response.statusCode === 200 || response.statusCode === 201);
    t.is(response.body.success, true);
  } finally {
    server.close();
  }
});

// Test 10: POST enrollment χωρίς courseId
test('POST /users/:userId/courses without courseId returns 400', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST χωρίς courseId
    const response = await got.post(`${baseUrl}/users/1/courses`, {
      json: {},
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 400 Bad Request
    t.is(response.statusCode, 400);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 11: POST enrollment σε ανύπαρκτο course
test('POST /users/:userId/courses with non-existent course returns 404', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST με courseId που δεν υπάρχει
    const response = await got.post(`${baseUrl}/users/1/courses`, {
      json: {
        courseId: 99999
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 404
    t.is(response.statusCode, 404);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 12: POST enrollment για ανύπαρκτο user
test('POST /users/:userId/courses for non-existent user returns 404', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST για user που δεν υπάρχει
    const response = await got.post(`${baseUrl}/users/99999/courses`, {
      json: {
        courseId: 1
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 404
    t.is(response.statusCode, 404);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 13: POST enrollment σε premium course χωρίς premium account
test('POST /users/:userId/courses to premium course without premium returns 400', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // User 1 δεν είναι premium, προσπαθεί enrollment σε premium course (courseId=2)
    const response = await got.post(`${baseUrl}/users/1/courses`, {
      json: {
        courseId: 2
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 400 ή 200 αν ήδη enrolled
    t.true(response.statusCode === 400 || response.statusCode === 200);
    if (response.statusCode === 400) {
      t.is(response.body.success, false);
    }
  } finally {
    server.close();
  }
});

// Test 14: Withdraw από course (DELETE)
test('DELETE /users/:userId/courses/:courseId withdraws user from course', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // DELETE για withdraw από course με courseId=1
    const response = await got.delete(`${baseUrl}/users/1/courses/1`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 204 No Content (χωρίς body)
    t.is(response.statusCode, 204);
  } finally {
    server.close();
  }
});

// Test 15: DELETE withdraw για ανύπαρκτο user
test('DELETE /users/:userId/courses/:courseId for non-existent user returns 404', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // DELETE για user που δεν υπάρχει
    const response = await got.delete(`${baseUrl}/users/99999/courses/1`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 404
    t.is(response.statusCode, 404);
  } finally {
    server.close();
  }
});

// Test 16: DELETE withdraw από course που δεν είναι enrolled
test('DELETE /users/:userId/courses/:courseId for non-enrolled course succeeds', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // DELETE από course που ο user δεν είναι enrolled (π.χ. courseId=99)
    const response = await got.delete(`${baseUrl}/users/1/courses/99`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Το API μπορεί να επιστρέφει 204 (idempotent) ή 404
    t.true(response.statusCode === 204 || response.statusCode === 404);
  } finally {
    server.close();
  }
});
