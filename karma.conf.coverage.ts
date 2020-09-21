/* eslint-env node */
'use strict';

var baseConfig = require('./karma.conf');

module.exports = function(config) {
  baseConfig(config);

  config.set({
    singleRun: true,

    reporters: ['spec', 'summary', 'junit', 'karma-typescript'],

    specReporter: {
      suppressPassed: true
    },

    junitReporter: {
      outputDir: 'junit-reports',
      suite: require('./package.json').name
    },

    karmaTypescriptConfig: {
      coverageOptions: {
        sourceMap: true
      },
      reports: {
        "lcovonly": {
          directory: "coverage"
        },
        "json": {
          directory: "coverage"
        },
      }
    },

    browserify: {
      debug: true,
      transform: [
        [
          'browserify-istanbul',
          {
            instrumenterConfig: {
              embedSource: true
            }
          }
        ]
      ]
    }
  });
};
