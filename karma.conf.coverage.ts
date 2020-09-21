const baseConfig = require('./karma.conf');

module.exports = function(config) {
  baseConfig(config);

  config.set({
    singleRun: true,

    reporters: ['progress', 'summary', 'junit', 'karma-typescript'],

    junitReporter: {
      outputDir: 'junit-reports',
      suite: require('./package.json').name
    },

    karmaTypescriptConfig: {
      reports: {
        "lcovonly": {
          directory: "coverage",
          subdirectory: "."
        },
        "json": {
          directory: "coverage",
          subdirectory: "."
        },
      }
    },
  });
};
