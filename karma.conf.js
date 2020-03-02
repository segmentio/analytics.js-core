/* eslint-env node */
'use strict';

// 10 minutes
var TEST_TIMEOUT = 10 * 60 * 1000;

module.exports = function(config) {
  config.set({
    files: [
      { pattern: 'test/support/*.html', included: false },
      'test/support/global.js', // NOTE: This must run before all tests
      'test/**/*.test.js'
    ],
    browsers: ['PhantomJS'],

    singleRun: true,

    frameworks: ['browserify', 'mocha'],

    reporters: ['spec'],

    preprocessors: {
      'test/**/*.js': 'browserify'
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
    }
  });
};
