var assert = require('assert');
var analytics = window.analytics;

describe('predictions', function() {
  beforeEach(function() {
    analytics.timeout(0);
  });

  afterEach(function() {
    analytics.reset();
  });
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
      assert.deepEqual(score, { mk_customer_fit: 'low' });
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
      assert.deepEqual(score, { mk_customer_fit: 'not enough information' });
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
      assert.deepEqual(score, { mk_customer_fit: 'low' });
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

  it('case 11: sdr logic 1', function(done) {
    var traits = {
      employees: 270,
      alexaGlobalRank: 174584,// j
      raised: 245750000,
      industry: 'Internet Software & Services',
      country: 'United States'
    };
    analytics.identify('case00', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  it('case 12: sdr logic 2', function(done) {
    var traits = {
      employees: 10,
      country: 'United States'
    };
    analytics.identify('case12', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'low' });
      done();
    });
  });

  it('case 13: sdr logic 3', function(done) {
    var traits = {
      employees: 400,
      country: 'United States',
      industry: 'Professional Services',
      raised: 4E6
    };
    analytics.identify('case13', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'low' });
      done();
    });
  });

  it('case 14: leaf 1', function(done) {
    var traits = {
      employees: 3250,
      country: 'United States',
      industry: 'Media',
      raised: 1E9, // 5900000000,
      tech: [
        'google_analytics',
        'double_click',
        'mixpanel',
        'optimizely',
        'typekit_by_adobe',
        'nginx',
        'google_apps'
      ],
      googleRank: 7,
      alexaGlobalRank: 1071,
      marketCap: 5900000000
    };
    analytics.identify('case14', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  it('case 15: leaf 2', function(done) {
    var traits = {
      employees: 3250,
      country: 'United States',
      industry: 'Media',
      raised: 5900000000,
      tech: ['google_analytics', 'double_click', 'mixpanel', 'optimizely', 'typekit_by_adobe', 'nginx', 'google_apps'],
      googleRank: 7,
      alexaGlobalRank: 1071,
      marketCap: null
    };
    analytics.identify('case15', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  it('case 16: low size, low rank, biz tech', function(done) {
    var traits = {
      employees: 180,
      country: 'United States',
      industry: 'Media',
      raised: 1E6,
      googleRank: 2,
      tech: ['totango'],
      alexaGlobalRank: 10,
      marketCap: null
    };
    analytics.identify('case16', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'good' });
      done();
    });
  });

  it('case 17: low size, low rank, biz tech', function(done) {
    var traits = {
      employees: 50,
      country: 'United States',
      industry: 'Media',
      raised: 1E6,
      googleRank: 2,
      alexaGlobalRank: 1E7,
      marketCap: null
    };
    analytics.identify('case17', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  it('case 18: low size, low grank, no biz tech, top9 ind', function(done) {
    var traits = {
      employees: 100,
      country: 'Should Not Matter',
      industry: 'Media',
      raised: 1E6,
      googleRank: 10,
      tech: ['double_click'],
      alexaGlobalRank: 10,
      marketCap: null
    };
    analytics.identify('case18', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  it('case 19: low size, low grank, no biz tech, top10_11 ind', function(done) {
    var traits = {
      employees: 100,
      country: 'Should Not Matter',
      industry: 'Health Care Providers & Services',
      raised: 1E4,
      googleRank: 10,
      tech: ['double_click'],
      alexaGlobalRank: 10000,
      marketCap: null
    };
    analytics.identify('case18', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'good' });
      done();
    });
  });

  it('case 20: top13 cntry, marketCap > null, low grank', function(done) {
    var traits = {
      employees: 100,
      country: 'Denmark',
      industry: 'Any Industry',
      raised: 30000000,
      googleRank: 5,
      tech: ['double_click'],
      alexaGlobalRank: 10000,
      marketCap: 400
    };
    analytics.identify('case20', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  it('case 21: ctry, raised money', function(done) {
    var traits = {
      employees: 100,
      country: 'United States',
      industry: 'Any Industry',
      raised: 25000000
    };
    analytics.identify('case21', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'good' });
      done();
    });
  });


  it('case 22: high employee count', function(done) {
    var traits = {
      employees: 500,
      country: 'United States',
      industry: 'Internet Software & Services',
      alexaGlobalRank: 400,
      marketCap: 10

    };
    analytics.reset();
    analytics.identify('case32', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  it('case 23: high employee count, low ind idx', function(done) {
    var traits = {
      employees: 300,
      country: 'Canada',
      industry: 'Something',
      alexaGlobalRank: 400,
      marketCap: 10

    };
    analytics.identify('case23', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'low' });
      done();
    });
  });

  it('case 24: high employee count, low ind idx, with tech', function(done) {
    var traits = {
      employees: 300,
      country: 'Canada',
      industry: 'Something',
      alexaGlobalRank: 400,
      marketCap: 10,
      tech: ['salesforce', 'eloqua', 'marketo', 'optimizely']

    };
    analytics.identify('case24', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'good' });
      done();
    });
  });

  it('case 25: high employee count, no raised', function(done) {
    var traits = {
      employees: 1000,
      country: 'Canada',
      industry: 'Something',
      alexaGlobalRank: 400,
      marketCap: 10
    };
    analytics.identify('case25', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'low' });
      done();
    });
  });

  it('case 26: high employee count, no raised', function(done) {
    var traits = {
      employees: 1000,
      country: 'United States',
      industry: 'Internet Software & Services',
      alexaGlobalRank: 400,
      marketCap: 10,
      raised: 3E6
    };
    analytics.identify('case26', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'very good' });
      done();
    });
  });

  it('case 27: medium count, no raised', function(done) {
    var traits = {
      employees: 100,
      country: 'United States',
      industry: 'Internet Software & Services',
      alexaGlobalRank: 400,
      marketCap: 10,
      raised: 3E6
    };
    analytics.identify('case27', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'good' });
      done();
    });
  });

  it('case 28: small empl', function(done) {
    var traits = {
      employees: 20,
      country: 'United States',
      industry: 'Internet Software & Services',
      alexaGlobalRank: 400,
      marketCap: 10,
      raised: null
    };
    analytics.identify('case28', traits);
    analytics.user().predictions(function(err, score) {
      if (err) {
        done(err);
      }
      assert.deepEqual(score, { mk_customer_fit: 'low' });
      done();
    });
  });
});
