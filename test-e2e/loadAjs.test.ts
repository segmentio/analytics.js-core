Feature('My First Test');

xScenario('test something', I => {
  I.amOnPage('https://github.com');
  I.see('GitHub');
  I.startMocking();
  I.stopMocking();
});

Scenario('record something', I => {
  I.startMocking();
  I.recordMocking();
  I.mockServer(server => {
    server.any('https://github.com/*').recordingName('somename');
  });
  I.amOnPage('https://github.com');
  I.see('GitHub');
  I.click('Team');
  I.see('Build like the best');
  I.stopMocking();
});

Scenario(
  'click around and check user id is stored in cookie and local storage',
  async (I, testID) => {
    // Load analytics.js
    I.amOnPage('http://www.library-test-site.com/');
    I.loadAJS('TEWEu8XrcMVejk8GOulbEx7rHGyuuijV');

    I.startRecording(testID);
    I.click('#page-home');
    I.click('#track-checkout-started');
    I.click('#identify-fathy');
    await I.stopRecording(testID);
  }
).injectDependencies({ testID: 'smoke-test-01' });
