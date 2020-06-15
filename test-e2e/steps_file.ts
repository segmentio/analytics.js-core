const fs = require('fs');
// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({
    loadAJS: async function(options /*: {local: boolean}*/) {
      let testSite = 'https://www.library-test-site.com'
      let testWriteKey = 'WJq9vAlUO5l2255jMg7eEthbkDtq1svu'
      if (options.local) {
        testSite = 'http://localhost:8000'
      }
      this.amOnPage(testSite);
      this.fillField('writeKey', testWriteKey);
      this.click('Load');

      // Wait for AJS to load
      this.waitForText(`loaded`, 5, '#status-msg');
    },

    startRecording: function(testID) {
      this.startMocking();
      this.mockServer(server => {
        server.any('https://api.segment.io/*').recordingName(testID);
      });
    },

    stopRecording: async function(testID) {
      await this.stopMocking();
      const dirs = fs.readdirSync('./test-e2e/output', { encoding: 'utf8' });
      let outputFilePath = '';
      dirs.forEach(dir => {
        if (dir.includes(testID)) {
          outputFilePath = `./test-e2e/output/${dir}/recording.har`;
        }
      });

      if (outputFilePath.length == 0)
        throw new Error(`cannot find directory for ${testID}`);
      if (!fs.existsSync(outputFilePath)) {
        throw new Error(`cannot find HAR file for ${testID}`);
      }

      const stagingFilePath = `./test-e2e/staging/${testID}.har`;

      fs.renameSync(outputFilePath, stagingFilePath);

      return stagingFilePath;
    }
  });
};
