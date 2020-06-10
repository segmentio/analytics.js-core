const { setHeadlessWhen } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: './test-e2e/*_test.js',
  output: './test-e2e/output',
  helpers: {
    Puppeteer: {
      url: 'https://library-test-site.com',
      show: true,
      windowSize: '1200x900',
      // waits for all network connections to be finished rather than default of DOMContentLoaded
      waitForNavigation: 'networkidle0'
    },
    MockRequestHelper: {
      require: '@codeceptjs/mock-request',
      mode: 'record',
      recordIfMissing: true,
      recordFailedRequests: false,
      expiresIn: null,
      persisterOptions: {
        keepUnusedRequests: false,
        fs: {
          recordingsDir: './data/requests'
        }
      }
    }
  },
  include: {
    I: './test-e2e/steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'test-e2e',
  plugins: {
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
};
