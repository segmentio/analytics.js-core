/* eslint-env node */
'use strict';

// 10 minutes
var TEST_TIMEOUT = 10 * 60 * 1000;

module.exports = function(config) {
  config.set({
    files: [
      { pattern: 'test/support/*.html', included: false },
      'test/support/global.ts', // NOTE: This must run before all tests
      'test/**/*.test.ts'
    ],
    browsers: ['ChromeHeadless'],

    singleRun: true,

    frameworks: ['mocha', 'karma-typescript'],

    reporters: ['spec'],

    preprocessors: {
      'test/**/*.ts': 'karma-typescript'
    },

    browserNoActivityTimeout: TEST_TIMEOUT,

    client: {
      mocha: {
        grep: process.env.GREP,
        timeout: TEST_TIMEOUT
      }
    },

    browserify: {
      debug: true
    },

    karmaTypescriptConfig: {
      bundlerOptions: {
        sourceMap: true,
      },
      compilerOptions: {
        module: "commonjs",
        target: "ES5",
        allowJs: false,
        esModuleInterop: true
      },
      include: ['test'],
      exclude: ['node_modules', 'lib', 'test-e2e/*.ts']
    }
  });
};
