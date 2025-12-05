// Εισαγωγή dependencies για AVA testing framework και HTTP requests
import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

// Test 1: Βασικό GET request - Επιστρέφει όλα τα courses
test('GET /courses returns success response', async (t) => {
  // Δημιουργία προσωρινού server για testing
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Αποστολή GET request στο endpoint
    const response = await got(`${baseUrl}/courses`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Έλεγχος status code και δομής response
    t.is(response.statusCode, 200);
    t.truthy(response.body);
    t.is(response.body.success, true);
    t.true(Array.isArray(response.body.data));
  } finally {
    server.close();
  }
});

// Test 2: Έλεγχος δομής των course objects
test('GET /courses returns array with course objects', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    const response = await got(`${baseUrl}/courses`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Επιβεβαίωση ότι επιστρέφεται array
    t.is(response.statusCode, 200);
    t.true(Array.isArray(response.body.data));
    
    // Έλεγχος ότι τα courses έχουν τα απαραίτητα πεδία
    if (response.body.data.length > 0) {
      const course = response.body.data[0];
      t.truthy(course.courseId);
      t.truthy(course.title);
    }
  } finally {
    server.close();
  }
});

// Test 3: Φιλτράρισμα με category query parameter
test('GET /courses with category filter', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request με category filter
    const response = await got(`${baseUrl}/courses?category=Programming`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Έλεγχος ότι τα αποτελέσματα ανήκουν στο σωστό category
    t.is(response.statusCode, 200);
    t.true(Array.isArray(response.body.data));
    if (response.body.data.length > 0) {
      t.is(response.body.data[0].category, 'Programming');
    }
  } finally {
    server.close();
  }
});

// Test 4: Φιλτράρισμα με difficulty level
test('GET /courses with difficulty filter', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request για beginner courses
    const response = await got(`${baseUrl}/courses?difficulty=beginner`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(response.statusCode, 200);
    t.true(Array.isArray(response.body.data));
  } finally {
    server.close();
  }
});

// Test 5: Φιλτράρισμα premium courses
test('GET /courses with premium filter', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request μόνο για premium μαθήματα
    const response = await got(`${baseUrl}/courses?premium=true`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(response.statusCode, 200);
    t.true(Array.isArray(response.body.data));
  } finally {
    server.close();
  }
});

// Test 6: Search functionality με keyword
test('GET /courses with search query', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Αναζήτηση με λέξη-κλειδί
    const response = await got(`${baseUrl}/courses?search=javascript`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(response.statusCode, 200);
    t.true(Array.isArray(response.body.data));
  } finally {
    server.close();
  }
});

// Test 7: Λήψη συγκεκριμένου course με valid courseId
test('GET /courses/:courseId returns specific course', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request για course με courseId=1
    const response = await got(`${baseUrl}/courses/1`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Έλεγχος επιτυχούς response
    t.is(response.statusCode, 200);
    t.is(response.body.success, true);
    t.truthy(response.body.data);
    
    // Έλεγχος ότι επιστράφηκε το σωστό course
    t.is(response.body.data.courseId, 1);
    t.truthy(response.body.data.title);
  } finally {
    server.close();
  }
});

// Test 8: Έλεγχος με ανύπαρκτο courseId
test('GET /courses/:courseId returns 404 for non-existent course', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request για courseId που δεν υπάρχει
    const response = await got(`${baseUrl}/courses/99999`, {
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

// Test 9: Έλεγχος με μη-έγκυρο courseId format
test('GET /courses/:courseId with invalid ID format', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request με string αντί για number
    const response = await got(`${baseUrl}/courses/invalid`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 400 ή 404 ανάλογα με το API design
    t.true(response.statusCode === 400 || response.statusCode === 404);
  } finally {
    server.close();
  }
});

// Test 10: Λήψη reviews για συγκεκριμένο course
test('GET /courses/:courseId/reviews returns ratings list', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request για reviews του course με courseId=1
    const response = await got(`${baseUrl}/courses/1/reviews`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    // Έλεγχος επιτυχούς response
    t.is(response.statusCode, 200);
    t.is(response.body.success, true);
    t.true(Array.isArray(response.body.data));
  } finally {
    server.close();
  }
});

// Test 11: Reviews για ανύπαρκτο course
test('GET /courses/:courseId/reviews returns 404 for non-existent course', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // Request για courseId που δεν υπάρχει
    const response = await got(`${baseUrl}/courses/99999/reviews`, {
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

// Test 12: Υποβολή νέου review (POST) με έγκυρα δεδομένα
test('POST /courses/:courseId/reviews creates new rating', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST με userId, stars, και comment
    const response = await got.post(`${baseUrl}/courses/1/reviews`, {
      json: {
        userId: 1,
        stars: 5,
        comment: 'Excellent course!'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 201 Created
    t.is(response.statusCode, 201);
    t.is(response.body.success, true);
    t.truthy(response.body.data);
  } finally {
    server.close();
  }
});

// Test 13: POST review χωρίς userId (validation error)
test('POST /courses/:courseId/reviews without userId returns 400', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST χωρίς userId
    const response = await got.post(`${baseUrl}/courses/1/reviews`, {
      json: {
        stars: 4,
        comment: 'Good course'
      },
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

// Test 14: POST review χωρίς stars (validation error)
test('POST /courses/:courseId/reviews without stars returns 400', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST χωρίς stars
    const response = await got.post(`${baseUrl}/courses/1/reviews`, {
      json: {
        userId: 2,
        comment: 'Nice'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 400
    t.is(response.statusCode, 400);
    t.is(response.body.success, false);
  } finally {
    server.close();
  }
});

// Test 15: POST review με μη έγκυρο stars (εκτός 1-5)
test('POST /courses/:courseId/reviews with invalid stars returns 400', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    // POST με stars=0 (εκτός εύρους)
    const response = await got.post(`${baseUrl}/courses/1/reviews`, {
      json: {
        userId: 3,
        stars: 0,
        comment: 'Bad'
      },
      responseType: 'json',
      throwHttpErrors: false
    });

    // Αναμένεται 400 - επιβεβαίωση μόνο status και success flag
    t.is(response.statusCode, 400);
    t.is(response.body.success, false);
    t.truthy(response.body.error);
  } finally {
    server.close();
  }
});
