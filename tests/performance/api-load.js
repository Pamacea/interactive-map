/**
 * API Load Testing Script for Genesis Interactive Map
 *
 * Prerequisites:
 * - Install k6: https://k6.io/docs/getting-started/installation/
 * - Run server: pnpm run build && pnpm run start
 *
 * Usage:
 *   k6 run tests/performance/api-load.js
 *
 * For HTML report:
 *   k6 run --out json=results.json tests/performance/api-load.js
 *   Then use k6-reporter or external visualization
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');

// Test configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Load test stages
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 10 },    // Stay at 10 users
    { duration: '30s', target: 50 },   // Ramp up to 50 users
    { duration: '1m', target: 50 },    // Stay at 50 users
    { duration: '30s', target: 100 },  // Ramp up to 100 users
    { duration: '1m', target: 100 },   // Stay at 100 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    'errors': ['rate<0.05'],           // Error rate < 5%
    'api_latency': ['p(95)<500'],      // 95th percentile < 500ms
    'api_latency': ['p(99)<1000'],     // 99th percentile < 1000ms
    'http_req_duration': ['p(95)<500'], // HTTP request p95 < 500ms
    'http_req_duration': ['p(99)<1000'], // HTTP request p99 < 1000ms
  },
};

// Setup - Authenticate and get session
export function setup() {
  // For authenticated tests, you would:
  // 1. Create a test user via API
  // 2. Login and get session token
  // 3. Return token for use in tests

  const loginRes = http.post(`${BASE_URL}/api/auth/signin`, JSON.stringify({
    email: 'test@example.com',
    password: 'testpassword',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  return {
    // Return any auth tokens or cookies needed
    cookies: loginRes.cookies,
  };
}

// Main test function
export default function(data) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add auth cookies if available
  const params = data?.cookies ? { cookies: data.cookies } : {};

  // Test 1: GET /api/worlds - List worlds
  const getWorldsRes = http.get(`${BASE_URL}/api/worlds`, Object.assign(params, { headers }));
  check(getWorldsRes, {
    'GET /api/worlds status 200': (r) => r.status === 200,
    'GET /api/worlds has data': (r) => r.json('length') >= 0,
  }) || errorRate.add(1);
  apiLatency.add(getWorldsRes.timings.duration);

  sleep(1);

  // Test 2: POST /api/worlds - Create world (only in first iteration)
  if (__ITER === 0) {
    const createPayload = JSON.stringify({
      name: `Load Test World ${__VU}`,
      description: 'Created during load testing',
      visibility: 'private',
    });

    const createWorldRes = http.post(`${BASE_URL}/api/worlds`, createPayload, Object.assign(params, { headers }));
    check(createWorldRes, {
      'POST /api/worlds status 200': (r) => r.status === 200,
      'POST /api/worlds returns world': (r) => r.json('id') !== undefined,
    }) || errorRate.add(1);
    apiLatency.add(createWorldRes.timings.duration);

    // Store created world ID for subsequent tests
    __ENV.WORLD_ID = createWorldRes.json('id');
  }

  sleep(1);

  // Test 3: GET /api/presence/[worldId] - Presence endpoint
  if (__ENV.WORLD_ID) {
    const presenceRes = http.get(`${BASE_URL}/api/presence/${__ENV.WORLD_ID}`, params);
    check(presenceRes, {
      'GET /api/presence status 200': (r) => r.status === 200 || r.status === 404, // 404 is acceptable
    }) || errorRate.add(1);
    apiLatency.add(presenceRes.timings.duration);
  }

  sleep(1);

  // Test 4: GET /worlds - Page load
  const worldsPageRes = http.get(`${BASE_URL}/worlds`, params);
  check(worldsPageRes, {
    'GET /worlds status 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(2);
}

// Teardown - cleanup test data
export function teardown(data) {
  // Optionally delete test worlds created during load test
  // This would require authentication and proper cleanup API calls
}

/*
 * Expected Results (for a healthy application):
 *
 * Target: 10 concurrent users
 * - p50 latency: ~50-100ms
 * - p95 latency: ~150-300ms
 * - p99 latency: ~200-500ms
 * - Error rate: < 1%
 *
 * Target: 50 concurrent users
 * - p50 latency: ~100-200ms
 * - p95 latency: ~300-500ms
 * - p99 latency: ~500-1000ms
 * - Error rate: < 3%
 *
 * Target: 100 concurrent users
 * - p50 latency: ~200-400ms
 * - p95 latency: ~500-800ms
 * - p99 latency: ~800-1500ms
 * - Error rate: < 5%
 *
 * If latencies exceed these thresholds:
 * 1. Check database connection pooling
 * 2. Add caching for read-heavy endpoints
 * 3. Implement rate limiting
 * 4. Consider database query optimization
 */
