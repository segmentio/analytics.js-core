'use strict';

var assert = require('proclaim');
var Facade = require('segmentio-facade');
var SourceMiddlewareChain = require('../lib/middleware').SourceMiddlewareChain;
var IntegrationMiddlewareChain = require('../lib/middleware')
  .IntegrationMiddlewareChain;
var middlewareChain = require('../lib/middleware').middlewareChain;

describe('middlewareChain', function() {
  var chain;
  beforeEach(function() {
    middlewareChain((chain = {}));
  });

  describe('#getMiddlewares', function() {
    it('should start empty', function() {
      assert.deepEqual(chain.getMiddlewares(), []);
    });

    it('should get existing middlewares', function() {
      chain.add(function() {
        return 'Valid! :)';
      });

      var middlewares = chain.getMiddlewares();
      assert(middlewares.length === 1, 'wrong middleware count');
      assert(middlewares[0]() === 'Valid! :)', 'wrong middleware return');
    });
  });

  describe('#add', function() {
    it('should not allow non-functions to be added', function() {
      try {
        chain.add({ 'this is': 'not a function' });

        // This assert should not run.
        assert(false, 'error was not thrown!');
      } catch (e) {
        assert(
          e.message === 'attempted to add non-function middleware',
          'wrong error return'
        );
      }
    });

    it('should not allow the same middleware instance to be added multiple times', function() {
      var middleware = function() {};

      chain.add(middleware);
      assert(chain.getMiddlewares().length === 1, 'wrong middleware count');

      try {
        chain.add(middleware);

        // This assert should not run.
        assert(false, 'error was not thrown!');
      } catch (e) {
        assert(
          e.message === 'middleware is already registered',
          'wrong error return'
        );
      }
    });

    it('should be able to add multiple different middlewares', function() {
      // Same literal values, but different instances.
      chain.add(function() {});
      chain.add(function() {});
      chain.add(function() {});
      assert(chain.getMiddlewares().length === 3, 'wrong middleware count');
    });
  });
});

describe('IntegrationMiddlewareChain', function() {
  var chain;
  beforeEach(function() {
    chain = new IntegrationMiddlewareChain();
  });

  describe('#applyMiddlewares', function() {
    it('should require a function callback', function() {
      try {
        chain.applyMiddlewares({});
      } catch (e) {
        assert(
          e.message === 'applyMiddlewares requires a function callback',
          'wrong error return'
        );
      }

      try {
        chain.applyMiddlewares({}, 'Test', ['this is not a function =(']);
      } catch (e) {
        assert(
          e.message === 'applyMiddlewares requires a function callback',
          'wrong error return'
        );
      }
    });
  });

  it('should require a payload object', function() {
    try {
      chain.applyMiddlewares(7, 'Test', function() {
        // This assert should not run.
        assert(false, 'error was not thrown!');
      });
    } catch (e) {
      assert(
        e.message === 'applyMiddlewares requires a payload object',
        'wrong error return'
      );
    }

    chain.applyMiddlewares(null, 'Test', function(payload) {
      // This assert SHOULD run.
      assert(payload === null, 'payload should have been null');
    });
  });

  it('should apply no middleware', function() {
    var payload = new Facade({
      testVal: 'success'
    });

    chain.applyMiddlewares(payload, 'Test', function(payload) {
      assert(
        payload.obj.testVal === 'success',
        'payload value incorrectly set'
      );
    });
  });

  it('should apply a middleware', function() {
    chain.add(function(payload, integration, next) {
      payload.obj.testVal = 'success';
      next(payload);
    });

    chain.applyMiddlewares({}, 'Test', function(payload) {
      assert(
        payload.obj.testVal === 'success',
        'payload value incorrectly set'
      );
    });
  });

  it('should apply multiple middlewares in order', function() {
    chain.add(function(payload, integration, next) {
      payload.obj.test.push(1);
      next(payload);
    });
    chain.add(function(payload, integration, next) {
      payload.obj.test.push(2);
      next(payload);
    });
    chain.add(function(payload, integration, next) {
      payload.obj.test.push(3);
      next(payload);
    });

    chain.applyMiddlewares({ test: [] }, 'Test', function(payload) {
      assert.deepEqual(payload.obj.test, [1, 2, 3]);
    });
  });

  it('should stop running middlewares if payload becomes null', function() {
    chain.add(function(payload, integration, next) {
      payload.obj.test.push(1);
      next(payload);
    });
    chain.add(function(payload, integration, next) {
      next(null);
    });
    chain.add(function() {
      throw new Error('Middleware chain was not interrupted by null!');
    });

    chain.applyMiddlewares({ test: [] }, 'Test', function(payload) {
      assert(payload === null, 'payload was not nullified');
    });
  });

  it('should convert non-facade objects to facades', function() {
    chain.add(function(payload, integration, next) {
      next(payload);
    });

    var payload = {};
    assert(!(payload instanceof Facade), 'Payload should not be a facade yet.');

    chain.applyMiddlewares(payload, 'Test', function(payload) {
      assert(payload instanceof Facade, 'Payload should be a facade.');
    });
  });

  it('should be able to handle facade objects as input', function() {
    chain.add(function(payload, integration, next) {
      next(payload);
    });

    var payload = new Facade({});
    assert(payload instanceof Facade, 'Payload should be a facade.');

    chain.applyMiddlewares(payload, 'Test', function(payload) {
      assert(payload instanceof Facade, 'Payload should still be a facade.');
    });
  });
});

describe('SourceMiddlewareChain', function() {
  var chain;
  beforeEach(function() {
    chain = new SourceMiddlewareChain();
  });

  describe('#applyMiddlewares', function() {
    it('should require a function callback', function() {
      try {
        chain.applyMiddlewares({});
      } catch (e) {
        assert(
          e.message === 'applyMiddlewares requires a function callback',
          'wrong error return'
        );
      }

      try {
        chain.applyMiddlewares({}, 'Test', ['this is not a function =(']);
      } catch (e) {
        assert(
          e.message === 'applyMiddlewares requires a function callback',
          'wrong error return'
        );
      }
    });
  });

  it('should require a payload object', function() {
    try {
      chain.applyMiddlewares(7, 'Test', function() {
        // This assert should not run.
        assert(false, 'error was not thrown!');
      });
    } catch (e) {
      assert(
        e.message === 'applyMiddlewares requires a payload object',
        'wrong error return'
      );
    }

    chain.applyMiddlewares(null, 'Test', function(payload) {
      // This assert SHOULD run.
      assert(payload === null, 'payload should have been null');
    });
  });

  it('should apply no middleware', function() {
    var payload = new Facade({
      testVal: 'success'
    });

    chain.applyMiddlewares(payload, 'Test', function(payload) {
      assert(
        payload.obj.testVal === 'success',
        'payload value incorrectly set'
      );
    });
  });

  it('should apply a middleware', function() {
    chain.add(function(chain) {
      chain.payload.obj.testVal = 'success';
      chain.next(chain.payload);
    });

    chain.applyMiddlewares({}, 'Test', function(payload) {
      assert(
        payload.obj.testVal === 'success',
        'payload value incorrectly set'
      );
    });
  });

  it('should apply multiple middlewares in order', function() {
    chain.add(function(chain) {
      chain.payload.obj.test.push(1);
      chain.next(chain.payload);
    });
    chain.add(function(chain) {
      chain.payload.obj.test.push(2);
      chain.next(chain.payload);
    });
    chain.add(function(chain) {
      chain.payload.obj.test.push(3);
      chain.next(chain.payload);
    });

    chain.applyMiddlewares({ test: [] }, 'Test', function(payload) {
      assert.deepEqual(payload.obj.test, [1, 2, 3]);
    });
  });

  it('should stop running middlewares if payload becomes null', function() {
    chain.add(function(chain) {
      chain.payload.obj.test.push(1);
      chain.next(chain.payload);
    });
    chain.add(function(chain) {
      chain.next(null);
    });
    chain.add(function() {
      throw new Error('Middleware chain was not interrupted by null!');
    });

    chain.applyMiddlewares({ test: [] }, 'Test', function(payload) {
      assert(payload === null, 'payload was not nullified');
    });
  });

  it('should convert non-facade objects to facades', function() {
    chain.add(function(chain) {
      chain.next(chain.payload);
    });

    var payload = {};
    assert(!(payload instanceof Facade), 'Payload should not be a facade yet.');

    chain.applyMiddlewares(payload, 'Test', function(payload) {
      assert(payload instanceof Facade, 'Payload should be a facade.');
    });
  });

  it('should be able to handle facade objects as input', function() {
    chain.add(function(chain) {
      chain.next(chain.payload);
    });

    var payload = new Facade({});
    assert(payload instanceof Facade, 'Payload should be a facade.');

    chain.applyMiddlewares(payload, 'Test', function(payload) {
      assert(payload instanceof Facade, 'Payload should still be a facade.');
    });
  });
});
