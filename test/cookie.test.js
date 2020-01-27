'use strict';

var assert = require('proclaim');
var cookie = require('../lib').constructor.cookie;

describe('cookie', function() {
  beforeEach(function() {
    // Just to make sure that
    // URIError is never thrown here.
    document.cookie = 'bad=%';
  });

  afterEach(function() {
    // reset to defaults
    cookie.options({});
    // remove all cookies
    document.cookie.split(';').forEach(function(entry) {
      cookie.remove(entry.split('=')[0]);
    });
  });

  describe('#get', function() {
    it('should not not get an empty cookie', function() {
      assert(cookie.get('abc') === null);
    });

    it('should get an existing cookie', function() {
      cookie.set('cookie-get', { a: 'b' });
      assert.deepEqual(cookie.get('cookie-get'), { a: 'b' });
    });

    it('should not throw an error on a malformed cookie', function() {
      document.cookie = 'cookie-bad=y';
      assert(cookie.get('cookie-bad') === null);
    });
  });

  describe('#set', function() {
    it('should set a cookie', function() {
      cookie.set('cookie-set', { a: 'b' });
      assert.deepEqual(cookie.get('cookie-set'), { a: 'b' });
    });
  });

  describe('#remove', function() {
    it('should remove a cookie', function() {
      cookie.set('cookie-remove', { a: 'b' });
      assert.deepEqual(cookie.get('cookie-remove'), { a: 'b' });
      cookie.remove('cookie-remove');
      assert(cookie.get('cookie-remove') === null);
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

    it('should set SameSite=Lax by default', function() {
      assert(cookie.options().sameSite === 'Lax');
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
