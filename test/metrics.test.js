'use strict';

var assert = require('proclaim');
var metrics = require('../lib').constructor.metrics;
var sinon = require('sinon');
var send = require('@segment/send-json');

describe('metrics', function() {
  var xhr;
  var spy;

  beforeEach(function() {
    xhr = sinon.useFakeXMLHttpRequest();

    spy = sinon.spy();
    xhr.onCreate = spy;
  });

  afterEach(function() {
    metrics.options({});

    if (xhr.restore) xhr.restore();
  });

  describe('#increment', function() {
    it('should not enqueue items by default', function() {
      metrics.increment('test', []);

      assert.deepEqual(metrics.queue, []);
    });

    it('should enqueue items when sampleRate is set', function() {
      metrics.options({ sampleRate : 1 });

      metrics.increment('test', []);

      assert.deepEqual(metrics.queue, [ { type: 'Counter', metric: 'test', value: 1, tags: [] } ]);
    });
  });

  describe('#_flush', function() {
    beforeEach(function() {
      metrics.options({ sampleRate: 1 });
    });

    it('should not make a request if queue is empty', function() {
      metrics._flush();

      sinon.assert.notCalled(spy);
    });

    it('should make a request if queue has an item and supports xhr', function() {
      if (send.type !== 'xhr') return;

      metrics.increment('foo', {});

      metrics._flush();

      sinon.assert.calledOnce(spy);
      var req = spy.getCall(0).args[0];
      assert.strictEqual(req.url, 'https://api.segment.io/v1/m');
      assert.strictEqual(req.requestBody, '{"series":[{"type":"Counter","metric":"foo","value":1,"tags":{}}]}');
    });

    it('should make a request if queue has multiple items and supports xhr', function() {
      if (send.type !== 'xhr') return;

      metrics.increment('test1', { foo: 'bar' });
      metrics.increment('test2', {});

      metrics._flush();

      sinon.assert.calledOnce(spy);
      var req = spy.getCall(0).args[0];
      assert.strictEqual(req.url, 'https://api.segment.io/v1/m');
      assert.strictEqual(req.requestBody, '{"series":[{"type":"Counter","metric":"test1","value":1,"tags":{"foo":"bar"}},{"type":"Counter","metric":"test2","value":1,"tags":{}}]}');
    });

    it('should not make a request if queue has an item and does not support xhr', function() {
      if (send.type === 'xhr') return;

      metrics.increment('foo', {});

      metrics._flush();

      sinon.assert.notCalled(spy);
    });

    it('should not make a request if queue has multiple items and does not support xhr', function() {
      if (send.type === 'xhr') return;

      metrics.increment('test1', { foo: 'bar' });
      metrics.increment('test2', {});

      metrics._flush();

      sinon.assert.notCalled(spy);
    });

    it('should empty the queue', function() {
      metrics.increment('test1', { foo: 'bar' });

      metrics._flush();

      assert.deepEqual(metrics.queue, []);
    });

    it('should respect the default maxQueueSize', function() {
      for (var i = 0; i < 30; i++) {
        metrics.increment('test');
      }

      assert.deepEqual(metrics.queue.length, 20);
    });

    it('should respect a custom maxQueueSize', function() {
      metrics.options({ sampleRate: 1, maxQueueSize: 1000 });

      for (var i = 0; i < 2000; i++) {
        metrics.increment('test');
      }

      assert.deepEqual(metrics.queue.length, 1000);
    });
  });

  describe('flush timer', function() {
    beforeEach(function() {
      metrics.options({
        sampleRate: 1,
        flushTimer: 1
      });
    });

    it('should flush', function(done) {
      if (send.type !== 'xhr') return done();

      metrics.increment('test1', { foo: 'bar' });

      setTimeout(function() {
        sinon.assert.calledOnce(spy);
        var req = spy.getCall(0).args[0];
        assert.strictEqual(req.url, 'https://api.segment.io/v1/m');
        assert.strictEqual(req.requestBody, '{"series":[{"type":"Counter","metric":"test1","value":1,"tags":{"foo":"bar"}}]}');

        assert.deepEqual(metrics.queue, []);

        done();
      }, 10);
    });
  });

  describe('#options', function() {
    it('should handle empty options correctly', function() {
      metrics.options({});

      assert.equal(metrics.host, 'api.segment.io/v1');
      assert.equal(metrics.sampleRate, 0);
      assert.equal(metrics.flushTimer, 30000);
      assert.equal(metrics.maxQueueSize, 20);

      assert.deepEqual(metrics.queue, []);
    });

    it('should respect host option', function() {
      metrics.options({ host: 'api.segment.com/v1' });

      assert.equal(metrics.host, 'api.segment.com/v1');
    });

    it('should respect sampleRate option', function() {
      metrics.options({ sampleRate: 0.1 });

      assert.equal(metrics.sampleRate, 0.1);
    });

    it('should respect flushTimer option', function() {
      metrics.options({ flushTimer: 10 * 1000 });

      assert.equal(metrics.flushTimer, 10000);
    });

    it('should respect maxQueueSize option', function() {
      metrics.options({ maxQueueSize: 30 });

      assert.equal(metrics.maxQueueSize, 30);
    });
  });
});
