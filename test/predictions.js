var assert = require('assert');
var analytics = window.analytics;

describe('predictions', function() {
  it('case 1: should return very good for this one ', function() {
    var traits = {
      employees: 200,
      alexaGlobalRank: 3000,
      raised: 0,
      industry: 'Software'
    };
    analytics.identify(traits);
    var score = analytics.user().predictions();
    assert.deepEqual(score, { mk_customer_fit: 'very good' });
  });

  it('case 2: should be undefined', function() {
    var traits = {
      employees: 30,
      alexaGlobalRank: 3000,
      raised: 0,
      industry: 'Software'
    };
    analytics.identify(traits);
    var score = analytics.user().predictions();
    assert.deepEqual(score, { mk_customer_fit: undefined });
  });

  it('case 3: should be undefined', function() {
    var traits = {
      employees: 3000,
      alexaGlobalRank: 3000,
      raised: 0,
      industry: 'Something Strange'
    };
    analytics.identify(traits);
    var score = analytics.user().predictions();
    assert.deepEqual(score, { mk_customer_fit: undefined });
  });

  it('case 4: should be very good', function() {
    var traits = {
      employees: 60,
      alexaGlobalRank: 3000,
      raised: 30000000000,
      industry: 'Commercial Services & Supplies'
    };
    analytics.identify(traits);
    var score = analytics.user().predictions();
    assert.deepEqual(score, { mk_customer_fit: 'very good' });
  });

  it('case 5: should be undefined', function() {
    var traits = {
      employees: 60,
      alexaGlobalRank: 3000,
      raised: 300,
      industry: 'Commercial Services & Supplies'
    };
    analytics.identify(traits);
    var score = analytics.user().predictions();
    assert.deepEqual(score, { mk_customer_fit: undefined });
  });
});
