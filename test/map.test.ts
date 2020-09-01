/* global describe, it, beforeEach */

'use strict';

/**
 * Module dependencies.
 */

var assert = require('proclaim');
var keys = require('@ndhoule/keys');
var sinon = require('sinon');
var map = require('../build/utils/map');

describe('map', function() {
  var identity;
  var square;

  beforeEach(function() {
    identity = sinon.spy(function(val) {
      return val;
    });
    square = function(a) {
      return a * a;
    };
  });

  it('should be a function', function() {
    assert.equal(typeof map, 'function', 'should be equal');
  });

  it('should have an arity of 2', function() {
    assert.equal(map.length, 2, 'should be equal');
  });

  it('should return a new array', function() {
    var numbers = [1, 2, 3];
    var newNumbers = map(identity, numbers);

    assert.deepEqual(newNumbers, numbers, 'should be equal');
    assert.notEqual(newNumbers, numbers, 'should not be equal');
  });

  it('should call the input function once for each item in the collection', function() {
    map(identity, [1, 2, 3]);

    assert.isTrue(identity.calledThrice, 'should have been called three times');
  });

  it('should return an array containing the results of calling the input function', function() {
    assert.deepEqual(map(square, [1, 2, 3]), [1, 4, 9], 'should be equal');
  });

  it('should pass the input function three arguments: value, index, and array', function() {
    var array = ['a', 'b', 'c'];
    map(identity, array);

    assert.isTrue(identity.calledWith('a', 0, array), 'should be true');
    assert.isTrue(identity.calledWith('b', 1, array), 'should be true');
    assert.isTrue(identity.calledWith('c', 2, array), 'should be true');
  });

  it('should iterate over arrays in indexed order', function() {
    var array = ['a', 'b', 'c'];
    var result = map(identity, array);

    assert.deepEqual(result, ['a', 'b', 'c'], 'should be equal');
  });

  it('should ignore enumerable properties on arrays', function() {
    var array = ['a', 'b', 'c'];
    // @ts-ignore
    array.a = 'spam';
    map(identity, array);

    assert.isTrue(identity.calledWith('a', 0, array), 'should be true');
    assert.isTrue(identity.calledWith('b', 1, array), 'should be true');
    assert.isTrue(identity.calledWith('c', 2, array), 'should be true');
    assert.isTrue(
      identity.neverCalledWith('spam', 'a', array),
      'should be true'
    );
  });

  it('should map over objects (without any guarantee of order)', function() {
    var obj = { a: 1, b: 2, c: 3 };
    var ks = keys(obj);
    map(identity, obj);

    assert.isTrue(
      identity.firstCall.calledWith(obj[ks[0]], ks[0], obj),
      'should be true'
    );
    assert.isTrue(
      identity.secondCall.calledWith(obj[ks[1]], ks[1], obj),
      'should be true'
    );
    assert.isTrue(
      identity.thirdCall.calledWith(obj[ks[2]], ks[2], obj),
      'should be true'
    );
  });

  it('should ignore inherited properties', function() {
    var parent = { z: 4 };
    var child = Object.create(parent);
    child.a = 1;
    child.b = 2;
    child.c = 3;
    map(identity, child);

    assert.isTrue(identity.neverCalledWith(4, 'z', child), 'should be true');
  });

  it('should ignore non-enumerable properties', function() {
    var obj = Object.create(null, {
      a: { value: 1, enumerable: false },
      b: { value: 2, enumerable: false },
      c: { value: 3, enumerable: true }
    });
    map(identity, obj);

    assert.isTrue(identity.calledOnce, 'should be true');
    assert.isTrue(identity.calledWith(3, 'c', obj), 'should be true');
  });

  it('should handle strings', function() {
    var str = 'spam';
    map(identity, str);

    assert.isTrue(identity.calledWith('s', 0, str), 'should be true');
    assert.isTrue(identity.calledWith('p', 1, str), 'should be true');
    assert.isTrue(identity.calledWith('a', 2, str), 'should be true');
    assert.isTrue(identity.calledWith('m', 3, str), 'should be true');
  });

  it('should throw an error when passed a non-function as its `fn` argument', function() {
    assert['throws'](
      function() {
        map('omg', []);
      },
      'Expected a function but received a string',
      'should have thrown an exception'
    );

    assert['throws'](
      function() {
        map('omg', [1, 2, 3]);
      },
      'Expected a function but received a string',
      'should have thrown an exception'
    );
  });
});
