Feature('AJS Bundle');
const assert = require('assert');

Scenario(
  'User id is stored in cookies and local storage',
  async (I, testID) => {
    I.loadAJS({ local: true });

    I.startRecording(testID);
    I.click('#page-home');
    I.click('#track-checkout-started');
    I.click('#identify-fathy');

    const harFilePath = await I.stopRecording(testID);
    assert(
      I.compareNetworkRequests(
        harFilePath,
        `./test-e2e/reference/${testID}.har`
      ),
      "network requests don't match"
    );

    const userId = await I.grabCookie('ajs_user_id');
    assert.equal(userId.value, '%22fathy%22');

    const lsUserId = await I.executeScript(() => {
      return localStorage.getItem('ajs_user_id');
    });
    assert.equal(lsUserId, `"fathy"`);
  }
).injectDependencies({ testID: 'cookies-and-local-storage' });
