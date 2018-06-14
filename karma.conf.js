/* eslint-env node */
'use strict';

module.exports = function(config) {
  config.set({
    files: [
      { pattern: 'test/support/*.html', included: false },
      'test/support/global.js', // NOTE: This must run before all tests
      'test/**/*.test.js'
    ],

    browsers: ['PhantomJS'],

    frameworks: ['browserify', 'mocha'],

    reporters: ['spec'],

    preprocessors: {
      'test/**/*.js': 'browserify'
    },

    client: {
      mocha: {
        grep: process.env.GREP
      }
    },

    browserify: {
      debug: true
    }
  });
};
