import http from 'k6/http';
import { check, sleep } from 'k6';
import { getBaseUrl, getCommonThresholds, getLoadTestConfig, getThinkTime } from './config.js';

/**
 * @fileoverview
 * k6 Load Test Script for the `/users/:userId` endpoint.
 * - Fetches all users in setup, extracts their IDs, and randomly selects one per iteration.
 * - Simulates concurrent user requests to test API performance and reliability.
 * - Uses ramping VUs scenario with thresholds for error rate and response time.
 */

/**
 * k6 test options and scenario configuration.
 * - thresholds: Performance and error rate requirements.
 * - scenarios: Defines the ramping VUs pattern for the load test.
 *   - executor: 'ramping-vus' gradually increases and decreases VUs.
 *   - stages: Imported from LOAD_TEST_CONFIG for ramp-up, sustain, and ramp-down.
 */
export const options = {
  thresholds: getCommonThresholds(),
  scenarios: {
    users_load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: getLoadTestConfig().stages,
      gracefulRampDown: '10s',
    },
  },
};

/**
 * Setup function runs once before the load test.
 * - Fetches the list of users from the API.
 * - Extracts user IDs from the response for use in the main test function.
 * - Throws errors if the API is unavailable or no users are found.
 * @returns {Object} Object containing an array of user IDs.
 */
export function setup() {
  // Fetch all users from the API
  const res = http.get(`${getBaseUrl()}/users`);
  check(res, { 'setup: /users is 200': (r) => r.status === 200 });

  if (res.status !== 200) {
    throw new Error(`setup() failed to fetch /users. Status=${res.status}`);
  }

  // Parse response and extract user array
  const data = res.json();
  // Support various response shapes: array, {data: [...]}, {users: [...]}
  const arr =
    Array.isArray(data) ? data :
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.users) ? data.users :
    null;

  if (!arr || arr.length === 0) {
    throw new Error('setup() found no users in /users response.');
  }

  // Extract user IDs, supporting different field names
  const ids = arr
    .map((u) => u.userId ?? u.id ?? u._id)
    .filter(Boolean)
    .map(String);

  if (ids.length === 0) {
    throw new Error('setup() could not extract any IDs from /users response.');
  }

  // Return IDs for use in the main test function
  return { ids };
}

/**
 * Main test function executed by each virtual user (VU) in each iteration.
 * - Randomly selects a user ID from the setup data.
 * - Sends a GET request to `/users/:userId`.
 * - Checks for successful response and non-empty body.
 * - Sleeps for THINK_TIME seconds to simulate user think time.
 * @param {Object} data - Data returned from setup(), containing user IDs.
 */
export default function (data) {
  const ids = data?.ids || [];
  if (ids.length === 0) {
    // If setup failed silently (shouldn't), stop cleanly
    return;
  }

  // Select a random user ID for this iteration
  const id = ids[Math.floor(Math.random() * ids.length)];
  const url = `${getBaseUrl()}/users/${encodeURIComponent(id)}`;

  // Send GET request to fetch user details
  const res = http.get(url);

  // Validate response: status 200 and non-empty body
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has body': (r) => r.body && r.body.length > 0,
  });

  // Simulate user think time between requests
  sleep(getThinkTime());
}

/**
 * Custom summary handler for k6.
 * - Prints a summary of the test results to the console.
 * - Includes pass/fail status, P95 response time, and error rate.
 * - Returns the full test data as formatted JSON for stdout.
 * @param {Object} data - k6 summary data object.
 * @returns {Object} Object with stdout property for k6 output.
 */
export function handleSummary(data) {
  const failedRate = data.metrics.http_req_failed?.values?.rate ?? 0;
  const p95 = data.metrics.http_req_duration?.values['p(95)'];

  const passed = failedRate < 0.01;

  // Print a human-readable summary to the console
  console.log('\n========================================');
  console.log('📊 LOAD TEST - /users/:userId (setup IDs)');
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`Error Rate: ${(failedRate * 100).toFixed(2)}%`);
  console.log('========================================\n');

  // Return the full summary as JSON for k6 output
  return {
    stdout: JSON.stringify(data, null, 2),
  };
}