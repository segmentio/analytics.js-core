/* eslint-env node */
'use strict';

module.exports = function(config) {
  config.set({
    files: [
      { pattern: 'test/support/*.html', included: false },
      // NOTE: This must run before all tests
      'test/support/global.js',
      'test/**/*.test.js'
    ],

    browsers: ['PhantomJS'],

    frameworks: ['browserify', 'mocha'],

    reporters: ['spec'/* , 'coverage' */],

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
      // Edge and Safari 9 still panic with coverage. Keeping disabled.
      // transform: [
      //   [
      //     'browserify-istanbul',
      //     {
      //       instrumenterConfig: {
      //         embedSource: true
      //       }
      //     }
      //   ]
      // ]
    }

    // Edge and Safari 9 still panic with coverage. Keeping disabled.
    // coverageReporter: {
    //   reporters: [
    //     { type: 'text' },
    //     { type: 'html' },
    //     { type: 'json' }
    //   ]
    // }
  });
};
