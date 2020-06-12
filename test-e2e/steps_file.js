const assert = require('assert');
const fs = require('fs');
const { parseHttpArchiveText, compareEntries } = require('./har');

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

module.exports = function() {
  return actor({
    // Waits for AJS to load
    loadAJS: async function(testWriteKey) {
      this.fillField('writeKey', testWriteKey);
      this.click('Load');

      // Wait for AJS to load
      this.waitForText(`loaded`, 5, '#status-msg');
      const msg = await this.grabTextFrom('#status-msg');
      assert.ok(msg.includes(`write key: ${testWriteKey}`));
    },
    startRecording: function(testID) {
      this.startMocking();
      this.mockServer(server => {
        server.any('https://api.segment.io/*').recordingName(testID);
      });
    },
    stopRecording: async function(testID) {
      await this.stopMocking();
      // TODO: Read path from config
      const dirs = fs.readdirSync('./test-e2e/data', { encoding: 'utf8' });
      // TODO: overwrite golden copy if mode is UPDATE
      let filePath = '';
      // Doing this because the directory name is `${testID}_<random-postfix>`
      for (dir of dirs) {
        if (dir.includes(testID)) {
          filePath = `./test-e2e/data/${dir}/recording.har`;
          break;
        }
      }
      if (filePath.length == 0) throw `cannot find directory for ${testID}`;
      if (fs.existsSync(filePath)) {
        return filePath;
      } else {
        throw `cannot find HAR file for ${testID}`;
      }
      // TODO: delete files after comparison succeeds
    },
    compareNetworkRequests: function(a, b) {
      return compareEntries(
        parseHttpArchiveText(
          fs.readFileSync(a, { encoding: 'utf8', flag: 'r' })
        ),
        parseHttpArchiveText(
          fs.readFileSync(b, { encoding: 'utf8', flag: 'r' })
        )
      );
    }
  });
};
