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
    I.click('#group');
    I.click('#alias');

    await I.stopRecording(testID);

    const userId = await I.grabCookie('ajs_user_id');
    assert.equal(userId.value, '%22fathy%22');

    const lsUserId = await I.executeScript(() => {
      return localStorage.getItem('ajs_user_id');
    });
    assert.equal(lsUserId, `"fathy"`);
  }
).injectDependencies({ testID: 'cookies-and-local-storage' });

Scenario('Login as a different user', async (I, testID) => {
  I.loadAJS({ local: true });

  I.startRecording(testID);

  I.click('#identify-spongebob');
  let userId = await I.grabCookie('ajs_user_id');
  assert.equal(userId.value, '%22spongebob%22');
  let lsUserId = await I.executeScript(() => {
    return localStorage.getItem('ajs_user_id');
  });
  assert.equal(lsUserId, `"spongebob"`);
  I.click('#track-product-viewed');

  I.click('#identify-fathy');
  userId = await I.grabCookie('ajs_user_id');
  assert.equal(userId.value, '%22fathy%22');
  lsUserId = await I.executeScript(() => {
    return localStorage.getItem('ajs_user_id');
  });
  assert.equal(lsUserId, `"fathy"`);
  I.click('#track-product-viewed');

  I.click('#reset');
  userId = await I.grabCookie('ajs_user_id');
  assert.strictEqual(userId, undefined);
  lsUserId = await I.executeScript(() => {
    return localStorage.getItem('ajs_user_id');
  });
  assert.strictEqual(lsUserId, null);
  await I.stopRecording(testID);
}).injectDependencies({ testID: 'login-as-different-user' });
