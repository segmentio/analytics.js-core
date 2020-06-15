Feature('AJS Bundle');

const assert = require('assert');
const testSite = 'https://www.library-test-site.com';
const testWriteKey = 'WJq9vAlUO5l2255jMg7eEthbkDtq1svu';

Scenario(
  'User id is stored in cookies and local storage',
  async (I, testID) => {
    I.loadAJS({local: true});

    I.startRecording(testID);
    I.click('#page-home');
    I.click('#track-checkout-started');
    I.click('#identify-fathy');

    await I.stopRecording(testID);

    const userId = await I.grabCookie('ajs_user_id');
    assert.equal(userId.value, '%22fathy%22');

    const lsUserId = await I.executeScript(() => {
      return localStorage.getItem('ajs_user_id');
    });
    assert.equal(lsUserId, `"fathy"`);
  }
).injectDependencies({ testID: 'cookies-and-local-storage' });
