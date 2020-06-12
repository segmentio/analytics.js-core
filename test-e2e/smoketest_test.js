Feature('smoketest');
const assert = require('assert');

// TODO: Rather than actually loading analytics.js from the CDN, spin up a local server to
// load it locally.
const testSite = 'https://www.library-test-site.com';
// This one has braze middle ware turned on
const testWriteKey = 'TEWEu8XrcMVejk8GOulbEx7rHGyuuijV';
// This one uses default config
// const testWriteKey = 'WJq9vAlUO5l2255jMg7eEthbkDtq1svu';

Scenario(
  'click around and check user id is stored in cookie and local storage',
  async (I, testID) => {
    // Load analytics.js
    I.amOnPage(testSite);
    I.loadAJS(testWriteKey);
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

    // compare cookie values
    const userId = await I.grabCookie('ajs_user_id');
    // REVISIT: Why is there %22 around the user_id?
    assert.strictEqual(userId.value, '%22fathy%22');

    // compare local storage values
    const lsUserId = await I.executeScript(() => {
      return localStorage.getItem('ajs_user_id');
    });
    assert.strictEqual(lsUserId, `"fathy"`);
  }
).injectDependencies({ testID: 'smoke-test-01' });

Scenario('click around #2', async (I, testID) => {
  // Load analytics.js
  I.amOnPage(testSite);
  I.loadAJS(testWriteKey);
  I.startRecording(testID);
  I.click('#track-checkout-started');
  const harFilePath = await I.stopRecording(testID);
  assert(
    I.compareNetworkRequests(harFilePath, `./test-e2e/reference/${testID}.har`),
    "network requests don't match"
  );

  // compare cookie values
  const userId = await I.grabCookie('ajs_user_id');
  // REVISIT: Why is there %22 around the user_id?
  assert.strictEqual(userId, undefined);

  // compare local storage values
  const lsUserId = await I.executeScript(() => {
    return localStorage.getItem('ajs_user_id');
  });
  assert.strictEqual(lsUserId, null);
}).injectDependencies({ testID: 'smoke-test-02' });
