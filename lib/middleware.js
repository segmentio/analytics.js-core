'use strict';

// Chain is essentially a linked list of middlewares to run in order.
function Chain() {
  var self = this;
  var middlewares = [];

  this.getMiddlewares = function() {
    return middlewares;
  };

  this.add = function(middleware) {
    if (typeof middleware !== 'function')
      throw new Error('attempted to add non-function middleware');
    if (self.contains(middleware))
      throw new Error('middleware is already registered');
    middlewares.push(middleware);
  };

  // Check for identical object references - bug check.
  this.contains = function(middleware) {
    for (var i = 0; i < middlewares.length; i++) {
      if (middleware === middlewares[i]) return true;
    }

    return false;
  };

  // fn is the callback to be run once all middlewares have been applied.
  this.applyMiddlewares = function(payload, fn) {
    if (typeof payload !== 'object' || payload === null)
      throw new Error('applyMiddlewares requires a payload object');
    if (typeof fn !== 'function')
      throw new Error('applyMiddlewares requires a function callback');

    // Attach callback to the end of the chain.
    var middlewaresToApply = middlewares.slice();
    middlewaresToApply.push(fn);
    executeChain(payload, middlewaresToApply, 0);
  };
}

// Go over all middlewares until all have been applied.
function executeChain(payload, middlewares, index) {
  var mw = middlewares[index];
  if (mw) {
    // If there's another middleware, continue down the chain. Otherwise, call the final function.
    if (middlewares[index + 1]) {
      mw(payload, function(newPayload) {
        executeChain(newPayload, middlewares, ++index);
      });
    } else {
      mw(payload);
    }
  }
}

module.exports.Chain = Chain;
