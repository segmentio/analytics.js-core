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

Scenario('Set anonymous ID explicitly', async (I, testID) => {
  async function assertAnonymousIDInStorage(expected) {
    // Checks if the value in cookie and local storage are expected
    let cookie = await I.grabCookie('ajs_anonymous_id');
    assert.strictEqual(
      cookie.value,
      `%22${expected}%22`,
      'unexpected cookie value'
    );
    assert.strictEqual(
      await I.executeScript(() => localStorage.getItem('ajs_anonymous_id')),
      `"${expected}"`,
      'unexpected LS value'
    );
  }
  I.loadAJS({ local: true });

  I.startRecording(testID);
  const [anonymousId1, anonymousId2] = await I.executeScript(() => {
    return [analytics.user().anonymousId(), analytics.user().anonymousId()];
  });
  assert(anonymousId1 != null, 'AnonymousID should not be null');
  assert.strictEqual(
    anonymousId1,
    anonymousId2,
    'Calling anonymousId twice should return the same ID'
  );
  await assertAnonymousIDInStorage(anonymousId1);

  // Use different methods to set anonymousId; network request should reflect each of the IDs

  // via anonymousId()
  await I.executeScript(() => {
    analytics.user().anonymousId('first-id');
  });
  I.click('#track-checkout-started');
  await assertAnonymousIDInStorage('first-id');

  // via options
  await I.executeScript(() => {
    analytics.page({}, { anonymousId: 'second-id' });
  });
  I.click('#track-checkout-started');
  await assertAnonymousIDInStorage('second-id');

  // via setAnonymousId()
  await I.executeScript(() => {
    analytics.setAnonymousId('third-id');
  });
  I.click('#track-checkout-started');
  await assertAnonymousIDInStorage('third-id');
  await I.stopRecording(testID);
}).injectDependencies({ testID: 'set-anonymous-id' });
