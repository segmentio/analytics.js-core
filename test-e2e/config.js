// These config are used by tests and devServer.

// Port that local dev server binds to
const devServerPort = 8000;

// Settings used by the tests when running with test option {local: false}
const remote = {
  // Test website loaded by the tests
  testSite: 'https://www.library-test-site.com',
  // Test write key used when loading analytics.js
  testWriteKey: 'WJq9vAlUO5l2255jMg7eEthbkDtq1svu',
  // The test website has a "cdnHost" field that tells it where
  // to load analytics.js from.
  cdn: 'cdn.segment.com'
};

// Settings used by the tests when running with test option {local: true}
const local = {
  testSite: `http://localhost:${devServerPort}`,
  testWriteKey: 'WJq9vAlUO5l2255jMg7eEthbkDtq1svu',
  cdn: `localhost:${devServerPort}`,
  // Local dev server will download analytics.js from
  // ${cdn}/analytics.js/v1/${testWriteKey}/analytics.js
  // and places it in the test-e2e/static directory
  originCDN: 'cdn.segment.com',
  // Port that local dev server binds to
  devServerPort
};

module.exports = {
  local,
  remote
};
