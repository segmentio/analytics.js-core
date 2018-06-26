'use strict';

var assert = require('proclaim');
var cookie = require('../lib').constructor.cookie;

describe('cookie', function() {
  // Use a random key for cookies
  // Workaround for flaky concurrent tests on Edge
  var testKey;

  beforeEach(function() {
    // Just to make sure that
    // URIError is never thrown here.
    document.cookie = 'bad=%';
    testKey =
      '_' +
      Math.random()
        .toString(36)
        .slice(2);
  });

  afterEach(function() {
    // reset to defaults
    cookie.options({});
    cookie.remove(testKey);
  });

  describe('#get', function() {
    it('should not not get an empty cookie', function() {
      assert(cookie.get('abc') === null);
    });

    it('should get an existing cookie', function() {
      cookie.set(testKey, { a: 'b' });
      assert.deepEqual(cookie.get(testKey), { a: 'b' });
    });

    it('should not throw an error on a malformed cookie', function() {
      document.cookie = testKey + '=y';
      assert(cookie.get(testKey) === null);
    });
  });

  describe('#set', function() {
    it('should set a cookie', function() {
      cookie.set(testKey, { a: 'b' });
      assert.deepEqual(cookie.get(testKey), { a: 'b' });
    });
  });

  describe('#remove', function() {
    it('should remove a cookie', function() {
      cookie.set(testKey, { a: 'b' });
      assert.deepEqual(cookie.get(testKey), { a: 'b' });
      cookie.remove(testKey);
      assert(cookie.get(testKey) === null);
    });
  });

  describe('#options', function() {
    it('should save options', function() {
      cookie.options({ path: '/xyz' });
      assert(cookie.options().path === '/xyz');
      assert(cookie.options().maxage === 31536000000);
    });

    it('should set the domain correctly', function() {
      cookie.options({ domain: '' });
      assert(cookie.options().domain === '');
    });

    it('should fallback to `domain=null` when it cant set the test cookie', function() {
      cookie.options({ domain: 'baz.com' });
      assert(cookie.options().domain === null);
      assert(cookie.get('ajs:test') === null);
    });

    // TODO: unskip once we don't use `window`, instead mock it :/
    it.skip('should set domain localhost to `""`', function() {
      cookie.options({});
      assert(cookie.options().domain === '');
    });
  });
});
