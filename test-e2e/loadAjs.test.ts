Feature('My First Test');

Scenario('test something', I => {
  I.amOnPage('https://github.com');
  I.see('GitHub');
});
