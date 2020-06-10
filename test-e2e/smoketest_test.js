Feature('smoketest');
const assert = require('assert');

// TODO: Rather than actually loading analytics.js from the CDN, spin up a local server to
// load it locally.
const testSite = 'https://www.library-test-site.com';
const testWriteKey = 'TEWEu8XrcMVejk8GOulbEx7rHGyuuijV';

Scenario('check user id is stored in cookie and local storage', async I => {
  // Load analytics.js
  I.amOnPage(testSite);
  I.fillField('writeKey', testWriteKey);
  I.click('Load');
  const msg = await I.grabTextFrom('#status-msg');
  assert.ok(msg.includes(`write key: ${testWriteKey}`));

  I.startMocking();
  I.mockServer(server => {
    server
      .any('https://api.segment.io/*')
      .passthrough(false)
      .recordingName('tapi');
  });
  I.click('#page-home');
  I.click('#track-checkout-started');
  I.click('#identify-fathy');
  I.stopMocking();
  const userId = await I.grabCookie('ajs_user_id');
  // REVISIT: Why is there %22 around the user_id?
  assert.strictEqual(userId.value, '%22fathy%22');
  // console.log(localStorage.getItem('ajs_user_id'))
  const lsUserId = await I.executeScript(() => {
    return localStorage.getItem('ajs_user_id');
  });

  assert.strictEqual(lsUserId, `"fathy"`);
});
