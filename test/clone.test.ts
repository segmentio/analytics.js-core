'use strict';

var assert = require('proclaim');
var clone = require('../build/utils/clone');

describe('clone', function() {
  it('should be a function', function() {
    assert.equal(typeof clone, 'function');
  });

  it('should have an arity of 1', function() {
    assert.equal(clone.length, 1);
  });

  describe('object', function() {
    it('should return an object with the same contents as the input', function() {
      var input = { a: 1, b: 2, c: 3 };
      var cloned = clone(input);

      assert.deepEqual(cloned, input);
    });

    it('should deeply clone nested objects', function() {
      var date = new Date();
      var input = {
        a: {
          b: [1, 2, date, { hello: 'world' }]
        }
      };
      var cloned = clone(input);

      assert.deepEqual(cloned, input);

      assert.deepEqual(cloned, input);
      assert.notStrictEqual(cloned.a, input.a);
      assert.notStrictEqual(cloned.a.b, input.a.b);
      assert.notStrictEqual(cloned.a.b[2], input.a.b[2]);
      assert.strictEqual(cloned.a.b[2].getTime(), (input.a.b[2] as Date).getTime());
      assert.deepEqual(cloned.a.b[3], input.a.b[3]);
      assert.notStrictEqual(cloned.a.b[3], input.a.b[3]);
    });

    it('object with functions', function() {
      var func = function() {
        return 'original';
      };
      var input = { func: func };
      var cloned = clone(input);

      assert.strictEqual(cloned.func, func);
    });
  });

  describe('array', function() {
    it('should return an array with the same contents as the input', function() {
      var input = [1, 2, 3, '4'];
      var cloned = clone(input);

      assert.deepEqual(cloned, input);
    });

    it('should deeply clone nested complex data structures', function() {
      var input = [{}];
      var cloned = clone(input);

      assert.notStrictEqual(cloned[0], input[0]);
      assert.deepEqual(cloned[0], input[0]);
    });

    it('should return a new array object', function() {
      var input = [1, 2, 3, '4'];
      var cloned = clone(input);

      assert.notStrictEqual(cloned, input);
    });
  });

  describe('regexp', function() {
    it('regexp', function() {
      var input = /hello/i;
      var cloned = clone(input);

      assert.strictEqual(cloned.toString(), input.toString());
    });

    it('should return a new regexp object', function() {
      var input = /hello/i;
      var cloned = clone(input);

      assert.notStrictEqual(cloned, input);
    });
  });

  describe('date', function() {
    it('should return a date with the same time as the input date', function() {
      var input = new Date();
      var cloned = clone(input);

      assert.strictEqual(cloned.getTime(), input.getTime());
    });

    it('should return a new date object', function() {
      var input = new Date();
      var cloned = clone(input);

      assert.notStrictEqual(cloned, input);
    });
  });

  describe('other data types', function() {
    it('should pass other data types through untouched', function() {
      assert.strictEqual(clone('a'), 'a');
      assert.strictEqual(clone({ a: 1 }).a, 1);
    });
  });
});
