/* eslint-env node */
'use strict';

var baseConfig = require('./karma.conf');

module.exports = function(config) {
  baseConfig(config);

  config.set({
    singleRun: true,

    reporters: ['spec', 'summary', 'junit', 'coverage'],

    specReporter: {
      suppressPassed: true
    },

    junitReporter: {
      outputDir: 'junit-reports',
      suite: require('./package.json').name
    },

    coverageReporter: {
      reporters: [
        { type: 'lcovonly', subdir: '.' },
        { type: 'json', subdir: '.' }
      ]
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
