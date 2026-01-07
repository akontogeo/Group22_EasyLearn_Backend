import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { BASE_URL, COMMON_THRESHOLDS, LOAD_TEST_CONFIG, THINK_TIME } from './config.js';

const IDS = new SharedArray('userIds', () => {
  // Τραβάμε users μια φορά (init stage)
  const res = http.get(`${BASE_URL}/users`);

  if (res.status !== 200) {
    throw new Error(`Failed to fetch /users for IDs. Status=${res.status}`);
  }

  const data = res.json(); // περιμένουμε JSON array ή object που περιέχει array

  // Προσπάθεια να πιάσουμε και τις 2 συνήθεις μορφές:
  // 1) [ { id: 1 }, ... ]
  // 2) { data: [ { id: 1 }, ... ] } ή { users: [...] }
  const arr =
    Array.isArray(data) ? data :
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.users) ? data.users :
    null;

  if (!arr || arr.length === 0) {
    throw new Error('No users returned from /users to build ID list.');
  }

  // Πιάνουμε id fields με διάφορα ονόματα
  const ids = arr
    .map(u => u.userId ?? u.id ?? u._id)
    .filter(Boolean)
    .map(String);

  if (ids.length === 0) {
    throw new Error('Could not extract any IDs from /users response.');
  }

  return ids;
});

export const options = {
  thresholds: COMMON_THRESHOLDS,
  scenarios: {
    users_load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: LOAD_TEST_CONFIG.stages,
      gracefulRampDown: '10s',
    },
  },
};

export default function () {
  const id = IDS[Math.floor(Math.random() * IDS.length)];
  const url = `${BASE_URL}/users/${encodeURIComponent(id)}`;

  const res = http.get(url);

  check(res, {
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
  console.log('📊 LOAD TEST - /users/:userId (valid IDs)');
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`Error Rate: ${(failedRate * 100).toFixed(2)}%`);
  console.log('========================================\n');

  return { stdout: JSON.stringify(data, null, 2) };
}
