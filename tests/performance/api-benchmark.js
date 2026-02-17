/**
 * API Benchmark Script for Genesis Interactive Map
 *
 * Alternative to k6 using Node.js - for quick performance checks
 *
 * Usage:
 *   node tests/performance/api-benchmark.js
 *
 * Or with npx:
 *   npx tsx tests/performance/api-benchmark.ts
 */

const http = require('http');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const WARMUP_REQUESTS = 3;
const TEST_REQUESTS = 20;
const CONCURRENT = 5; // Concurrent requests per test

// Metrics collection
const metrics = {
  '/api/worlds': { latencies: [], errors: 0 },
  '/api/presence/test-world': { latencies: [], errors: 0 },
  '/worlds': { latencies: [], errors: 0 },
  '/': { latencies: [], errors: 0 },
};

/**
 * Make an HTTP request and measure latency
 */
function makeRequest(url, path) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const urlObj = new URL(path, url);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Genesis-Benchmark/1.0',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const latency = Date.now() - startTime;
        resolve({ latency, status: res.statusCode, success: res.statusCode >= 200 && res.statusCode < 400 });
      });
    });

    req.on('error', (error) => {
      resolve({ latency: Date.now() - startTime, status: 0, success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ latency: 10000, status: 0, success: false, error: 'timeout' });
    });

    req.end();
  });
}

/**
 * Calculate statistics
 */
function calculateStats(latencies) {
  if (latencies.length === 0) return { p50: 0, p95: 0, p99: 0, avg: 0 };

  const sorted = [...latencies].sort((a, b) => a - b);
  const len = sorted.length;

  return {
    min: sorted[0],
    max: sorted[len - 1],
    avg: sorted.reduce((a, b) => a + b, 0) / len,
    p50: sorted[Math.floor(len * 0.5)],
    p95: sorted[Math.floor(len * 0.95)],
    p99: sorted[Math.floor(len * 0.99)],
  };
}

/**
 * Print results table
 */
function printResults() {
  console.log('\n' + '='.repeat(80));
  console.log('API BENCHMARK RESULTS');
  console.log('='.repeat(80));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Requests per endpoint: ${TEST_REQUESTS}`);
  console.log('='.repeat(80));

  for (const [endpoint, data] of Object.entries(metrics)) {
    if (data.latencies.length === 0) continue;

    const stats = calculateStats(data.latencies);
    const errorRate = (data.errors / (data.latencies.length + data.errors) * 100).toFixed(2);

    console.log(`\n${endpoint}`);
    console.log('-'.repeat(80));
    console.log(`  Requests:  ${data.latencies.length + data.errors} (${data.errors} errors)`);
    console.log(`  Error Rate: ${errorRate}%`);
    console.log(`  Min:       ${stats.min} ms`);
    console.log(`  Avg:       ${stats.avg.toFixed(2)} ms`);
    console.log(`  P50:       ${stats.p50} ms`);
    console.log(`  P95:       ${stats.p95} ms`);
    console.log(`  P99:       ${stats.p99} ms`);
    console.log(`  Max:       ${stats.max} ms`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('Performance Thresholds:');
  console.log('  P95 < 300ms:  Excellent');
  console.log('  P95 < 500ms:  Good');
  console.log('  P95 < 1000ms: Acceptable');
  console.log('  P95 > 1000ms: Needs optimization');
  console.log('='.repeat(80) + '\n');
}

/**
 * Run benchmark for a single endpoint
 */
async function benchmarkEndpoint(path) {
  // Warmup
  for (let i = 0; i < WARMUP_REQUESTS; i++) {
    await makeRequest(BASE_URL, path);
  }

  // Actual benchmark
  const promises = [];
  for (let i = 0; i < TEST_REQUESTS; i++) {
    promises.push(makeRequest(BASE_URL, path));
  }

  const results = await Promise.all(promises);

  for (const result of results) {
    if (result.success) {
      metrics[path].latencies.push(result.latency);
    } else {
      metrics[path].errors++;
    }
  }
}

/**
 * Main benchmark runner
 */
async function runBenchmarks() {
  console.log('Starting API benchmark...');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Endpoints: ${Object.keys(metrics).length}`);

  const endpoints = Object.keys(metrics);

  for (const endpoint of endpoints) {
    process.stdout.write(`\rBenchmarking: ${endpoint.padEnd(30)} `);
    await benchmarkEndpoint(endpoint);
    process.stdout.write(`Done`);
  }

  printResults();
}

// Run if called directly
if (require.main === module) {
  runBenchmarks().catch(console.error);
}

module.exports = { makeRequest, calculateStats, runBenchmarks };
