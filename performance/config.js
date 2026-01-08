/**
 * Shared configuration for k6 performance tests
 * 
 * NFRs (Non-Functional Requirements) based on local testing:
 * - Local test @ 1000 VUs: P95 = 160ms, 0% error rate
 * - GitHub Actions has less resources, so we use conservative thresholds
 * 
 * These thresholds ensure tests pass on CI runners while detecting regressions
 */

/* global __ENV */

// Base URL for the API (CI environment)
export const BASE_URL = __ENV.API_URL || 'http://localhost:5000';

// Common thresholds for all performance tests
export const COMMON_THRESHOLDS = {
  // HTTP errors should be less than 1%
  http_req_failed: ['rate<0.01'],
  // 95th percentile response time should be under 300ms (conservative for CI)
  'http_req_duration': ['p(95)<300', 'p(99)<500'],
};

// Load test configuration (gradual ramp-up for sustained load)
export const LOAD_TEST_CONFIG = {
  maxVUs: 2000,
  stages: [
    { duration: '30s', target: 100 },    // Warm up to 100
    { duration: '1m', target: 500 },     // Ramp to 500 VUs
    { duration: '1m30s', target: 1000 }, // Ramp to 1000 VUs
    { duration: '3m', target: 1000 },    // Sustain peak at 1000
    { duration: '1m', target: 0 },       // Ramp down
  ],
};

// Spike test configuration (sudden traffic surge)
export const SPIKE_TEST_CONFIG = {
  maxVUs: 2000,
  stages: [
    { duration: '20s', target: 10 },    // Baseline
    { duration: '20s', target: 1000 },  // Sudden spike to 1000
    { duration: '2m', target: 1000 },   // Sustain spike to observe behavior
    { duration: '20s', target: 0 },     // Drop to zero
  ],
};

// User think time between requests (in seconds)
export const THINK_TIME = 1;
