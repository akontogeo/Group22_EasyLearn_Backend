import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, COMMON_THRESHOLDS, SPIKE_TEST_CONFIG, THINK_TIME } from './config.js';

/**
 * Spike Test for /users/:userId (valid IDs fetched in setup)
 *
 * Purpose: Sudden traffic surge (spike) and recovery
 * NFRs (enforced via thresholds in config.js):
 * - Error rate < 1%
 * - P95 response time under configured threshold
 */

export const options = {
  thresholds: COMMON_THRESHOLDS,
  scenarios: {
    users_spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: SPIKE_TEST_CONFIG.stages,
      gracefulRampDown: '10s',
    },
  },
};

// Runs once per test (allowed to make HTTP requests)
export function setup() {
  const res = http.get(`${BASE_URL}/users`);
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

export default function (data) {
  const ids = data?.ids || [];
  if (ids.length === 0) return;

  const id = ids[Math.floor(Math.random() * ids.length)];
  const url = `${BASE_URL}/users/${encodeURIComponent(id)}`;

  const response = http.get(url);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has body': (r) => r.body && r.body.length > 0,
  });

  sleep(THINK_TIME);
}

export function handleSummary(data) {
  const failedRate = data.metrics.http_req_failed?.values?.rate ?? 0;
  const p95 = data.metrics.http_req_duration?.values['p(95)'];

  const passed = failedRate < 0.01;

  console.log('\n========================================');
  console.log('⚡ SPIKE TEST - /users/:userId (setup IDs)');
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`Error Rate: ${(failedRate * 100).toFixed(2)}%`);
  console.log('========================================\n');

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
