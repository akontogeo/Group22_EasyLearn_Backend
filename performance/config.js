/**
 * Shared configuration for k6 performance tests.
 * 
 * NFRs (Non-Functional Requirements) based on local testing:
 * - Local test @ 1000 VUs: P95 = 160ms, 0% error rate
 * - GitHub Actions has less resources, so we use conservative thresholds
 * 
 * These thresholds ensure tests pass on CI runners while detecting regressions.
 */

/* global __ENV */
import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Returns the base URL for the API, using environment variable or default.
 * @returns {string} API base URL
 */
export function getBaseUrl() {
  return __ENV.API_URL || 'http://localhost:5000';
}

/**
 * Common thresholds for all performance tests.
 * @returns {Object} Thresholds for k6
 */
export function getCommonThresholds() {
  return {
    http_req_failed: ['rate<0.01'], // HTTP errors < 1%
    http_req_duration: ['p(95)<300', 'p(99)<500'], // Response time thresholds
  };
}

/**
 * Helper to create a stage object for k6.
 * @param {string} duration - Duration of the stage
 * @param {number} target - Target number of VUs
 * @returns {Object} Stage configuration
 */
function createStage(duration, target) {
  return { duration, target };
}

/**
 * Load test configuration (gradual ramp-up for sustained load).
 * @returns {Object} Load test config for k6
 */
export function getLoadTestConfig() {
  return {
    maxVUs: 2000,
    stages: [
      createStage('30s', 100),     // Warm up to 100
      createStage('1m', 500),      // Ramp to 500 VUs
      createStage('1m30s', 1000),  // Ramp to 1000 VUs
      createStage('3m', 1000),     // Sustain peak at 1000
      createStage('1m', 0),        // Ramp down
    ],
  };
}

/**
 * Spike test configuration (sudden traffic surge).
 * @returns {Object} Spike test config for k6
 */
export function getSpikeTestConfig() {
  return {
    maxVUs: 2000,
    stages: [
      createStage('20s', 10),      // Baseline
      createStage('20s', 1000),    // Sudden spike to 1000
      createStage('2m', 1000),     // Sustain spike
      createStage('20s', 0),       // Drop to zero
    ],
  };
}

/**
 * User think time between requests (in seconds).
 * @returns {number} Think time in seconds
 */
export function getThinkTime() {
  return 1;
}

/**
 * Common setup function for user tests that need to fetch user IDs.
 * @returns {Object} Object containing array of user IDs
 */
export function setupUserTest() {
  const res = http.get(`${getBaseUrl()}/users`);
  check(res, { 'setup: /users is 200': (r) => r.status === 200 });

  if (res.status !== 200) {
    throw new Error(`setup() failed to fetch /users. Status=${res.status}`);
  }

  const data = res.json();

  const arr =
    Array.isArray(data) ? data :
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.users) ? data.users :
    null;

  if (!arr || arr.length === 0) {
    throw new Error('setup() found no users in /users response.');
  }

  const ids = arr
    .map((u) => u.userId ?? u.id ?? u._id)
    .filter(Boolean)
    .map(String);

  if (ids.length === 0) {
    throw new Error('setup() could not extract any IDs from /users response.');
  }

  return { ids };
}

/**
 * Common test execution for user endpoint tests.
 * @param {Object} data - Data from setup containing user IDs
 */
export function executeUserTest(data) {
  const ids = data?.ids || [];
  if (ids.length === 0) return;

  const id = ids[Math.floor(Math.random() * ids.length)];
  const url = `${getBaseUrl()}/users/${encodeURIComponent(id)}`;

  const response = http.get(url);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has body': (r) => r.body && r.body.length > 0,
  });

  sleep(getThinkTime());
}

/**
 * Creates standardized summary for user tests.
 * @param {Object} data - k6 summary data
 * @param {string} testType - Type of test ('LOAD' or 'SPIKE')
 * @returns {Object} Summary object for k6
 */
export function createUserTestSummary(data, testType) {
  const failedRate = data.metrics.http_req_failed?.values?.rate ?? 0;
  const p95 = data.metrics.http_req_duration?.values['p(95)'];
  const passed = failedRate < 0.01;
  const emoji = testType === 'SPIKE' ? '⚡' : '📊';

  console.log('\n========================================');
  console.log(`${emoji} ${testType} TEST - /users/:userId (setup IDs)`);
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`Error Rate: ${(failedRate * 100).toFixed(2)}%`);
  console.log('========================================\n');

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}