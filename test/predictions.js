var assert = require('assert');
var analytics = window.analytics;

describe('predictions', function() {
  // good customer
  it('case 1: should return very good for this one ', function(done) {
    var traits = {
      employees: 200,
      alexaGlobalRank: 3000,
      raised: 0,
      industry: 'Software'
    };
    analytics.identify('case1', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  // customer too small
  it('case 2: should be low', function(done) {
    var traits = {
      employees: 30,
      alexaGlobalRank: 3000,
      raised: 0,
      industry: 'Software'
    };
    analytics.identify('case2', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'low' });
      done();
    });
  });

  // industry value is not one of the allowed value
  it('case 3: should be undefined', function(done) {
    var traits = {
      employees: 3000,
      alexaGlobalRank: 3000,
      raised: 0,
      industry: 'Something Strange'
    };
    analytics.identify('case3', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: undefined });
      done();
    });
  });

  // good customer, has raised LOTS of $
  it('case 4: should be very good', function(done) {
    var traits = {
      employees: 60,
      alexaGlobalRank: 3000,
      raised: 30000000000,
      industry: 'Commercial Services & Supplies'
    };
    analytics.identify('case4', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  // small and not a great industry
  it('case 5: should be low', function(done) {
    var traits = {
      employees: 50,
      alexaGlobalRank: 3000,
      raised: 300,
      industry: 'Commercial Services & Supplies'
    };
    analytics.identify('case5', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'low' });
      done();
    });
  });

  // User with an unexpected trait
  it('case 6: should return very good', function(done) {
    var traits = {
      employees: 200,
      alexaGlobalRank: 3000,
      raised: 0,
      industry: 'Software',
      number_of_arms: 7
    };
    analytics.identify('case6', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  // User with a trait in a different format
  it('case 7: should be undefined', function(done) {
    var traits = {
      employees_spectial: '200',
      alexaGlobalRank: 3000,
      raised: 0,
      industry: 'Software'
    };
    analytics.identify('case7', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: undefined });
      done();
    });
  });

  // User with a missing trait
  it('case 8: should be undefined', function(done) {
    var traits = {
      employees: '200',
      alexaGlobalRank: 3000,
      raised: 0
    };
    analytics.identify('case8', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: undefined });
      done();
    });
  });

  // User with traits as undefined
  it('case 9: should be undefined', function(done) {
    analytics.identify('case9');
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: undefined });
      done();
    });
  });

  // User with junk traits undefined
  it('case 10: should be undefined', function(done) {
    var junk = [{
      thisIsJunk: '200',
      alexaGlobalRank: 3000,
      raised: 0,
      junk: junk
    }];
    analytics.identify('case10', junk);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: undefined });
      done();
    });
  });
});
