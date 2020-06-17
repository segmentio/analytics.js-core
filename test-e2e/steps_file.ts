const fs = require('fs');
const config = require('./config');
const { parseHttpArchiveText, compareEntries } = require('./har')

module.exports = function() {
  return actor({
    loadAJS: async function(options /* : {local: boolean}*/) {
      let testSite = config.remote.testSite;
      let testWriteKey = config.remote.testWriteKey;
      let cdn = config.remote.cdn;
      if (options.local) {
        testSite = config.local.testSite;
        testWriteKey = config.local.testWriteKey;
        cdn = config.local.cdn;
      }
      this.amOnPage(testSite);
      this.fillField('cdnHost', cdn);
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
    },

    compareNetworkRequests: function(a, b) {
      console.log("!!!comparing network requests!!!!")
      return compareEntries(
        parseHttpArchiveText(
          fs.readFileSync(a, { encoding: 'utf8', flag: 'r' })
        ),
        parseHttpArchiveText(
          fs.readFileSync(b, { encoding: 'utf8', flag: 'r' })
        )
      )
    }
  });
};
