'use strict';

var Facade = require('segmentio-facade');

// Chain is essentially a linked list of middlewares to run in order.
function Chain() {
  var middlewares = [];

  // Return a copy to prevent external mutations.
  this.getMiddlewares = function() {
    return middlewares.slice();
  };

  this.add = function(middleware) {
    if (typeof middleware !== 'function')
      throw new Error('attempted to add non-function middleware');

    // Check for identical object references - bug check.
    if (middlewares.indexOf(middleware) !== -1)
      throw new Error('middleware is already registered');
    middlewares.push(middleware);
  };

  // fn is the callback to be run once all middlewares have been applied.
  this.applyMiddlewares = function(facade, integration, fn) {
    if (typeof facade !== 'object')
      throw new Error('applyMiddlewares requires a payload object');
    if (typeof fn !== 'function')
      throw new Error('applyMiddlewares requires a function callback');

    // Attach callback to the end of the chain.
    var middlewaresToApply = middlewares.slice();
    middlewaresToApply.push(fn);
    executeChain(facade, integration, middlewaresToApply, 0);
  };
}

// Go over all middlewares until all have been applied.
function executeChain(payload, integration, middlewares, index) {
  // If the facade has been nullified, immediately skip to the final middleware.
  if (payload === null) {
    middlewares[middlewares.length - 1](null);
    return;
  }

  // Check if the payload is still a Facade. If not, convert it to one.
  if (!(payload instanceof Facade)) {
    payload = new Facade(payload);
  }

  var mw = middlewares[index];
  if (mw) {
    // If there's another middleware, continue down the chain. Otherwise, call the final function.
    if (middlewares[index + 1]) {
      mw(payload, integration, function(result) {
        executeChain(result, integration, middlewares, ++index);
      });
    } else {
      mw(payload);
    }
  }
}

module.exports.Chain = Chain;
