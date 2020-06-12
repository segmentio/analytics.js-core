const { setHeadlessWhen } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: './test-e2e/*.test.ts',
  output: './test-e2e/output',
  helpers: {
    Puppeteer: {
      url: 'http://www.library-test-site.com/',
      show: true,
      windowSize: '1200x900'
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
          recordingsDir: './test-e2e/output'
        }
      }
    }
  },
  include: {
    I: './steps_file.ts'
  },
  bootstrap: null,
  mocha: {},
  name: 'analytics.js-core',
  plugins: {
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
};
