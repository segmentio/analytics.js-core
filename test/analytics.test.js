'use strict';

var Analytics = require('../build').constructor;
var Facade = require('segmentio-facade');
var analytics = require('../build');
var assert = require('proclaim');
var bind = require('component-event').bind;
var createIntegration = require('@segment/analytics.js-integration');
var extend = require('@ndhoule/extend');
var type = require('component-type');
var jQuery = require('jquery');
var pageDefaults = require('../build/pageDefaults');
var sinon = require('sinon');
var tick = require('next-tick');
var trigger = require('compat-trigger-event');

var Identify = Facade.Identify;
var cookie = Analytics.cookie;
var group = analytics.group();
var store = Analytics.store;
var user = analytics.user();
var metrics = Analytics.metrics;

describe('Analytics', function() {
  var analytics;
  var contextPage;
  var Test;
  var settings;

  beforeEach(function() {
    settings = {
      Test: {
        key: 'key',
        initialPageview: false
      }
    };

    contextPage = pageDefaults();
  });

  beforeEach(function() {
    analytics = new Analytics();
    analytics.timeout(0);
    Test = createIntegration('Test');
  });

  afterEach(function() {
    user.reset();
    group.reset();
    user.anonymousId(null);
    // clear the hash
    // FIXME(ndhoule): Uhhh... causes Safari 9 to freak out. Maybe Karma issue?
    // if (window.history && window.history.pushState) {
    //   window.history.pushState('', '', window.location.pathname);
    // }
  });

  it('should setup an Integrations object', function() {
    assert(type(analytics.Integrations) === 'object');
  });

  it('should setup an _integrations object', function() {
    assert(type(analytics._integrations) === 'object');
  });

  it('should set a _readied state', function() {
    assert(analytics._readied === false);
  });

  it('should set a default timeout', function() {
    analytics = new Analytics();
    assert(analytics._timeout === 300);
  });

  it('should set the _user for backwards compatibility', function() {
    assert(analytics._user === user);
  });

  describe('#use', function() {
    it('should work', function(done) {
      analytics.use(function(singleton) {
        assert(analytics === singleton);
        done();
      });
    });
  });

  describe('#addIntegration', function() {
    it('should add an integration', function() {
      analytics.addIntegration(Test);
      assert(analytics.Integrations.Test === Test);
    });
  });

  describe('#setAnonymousId', function() {
    it("should set the user's anonymous id", function() {
      var prev = analytics.user().anonymousId();
      assert(prev.length === 36);
      analytics.setAnonymousId('new-id');
      var curr = analytics.user().anonymousId();
      assert(curr === 'new-id');
    });
  });

  describe('#initialize', function() {
    beforeEach(function() {
      sinon.spy(user, 'load');
      sinon.spy(group, 'load');
      sinon.spy(metrics, 'increment');
    });

    afterEach(function() {
      user.load.restore();
      group.load.restore();
      metrics.increment.restore();
    });

    it('should gracefully handle integrations that fail to initialize', function() {
      Test.prototype.initialize = function() {
        throw new Error('Uh oh!');
      };
      var test = new Test();
      analytics.use(Test);
      analytics.add(test);
      analytics.initialize();
      assert(analytics.initialized);
    });

    it('should store the names of integrations that did not initialize', function() {
      Test.prototype.initialize = function() {
        throw new Error('Uh oh!');
      };
      var test = new Test();
      analytics.use(Test);
      analytics.add(test);
      analytics.initialize();
      assert(analytics.failedInitializations.length === 1);
      assert(analytics.failedInitializations[0] === Test.prototype.name);
    });

    it('should not process events for any integrations that failed to initialize', function() {
      Test.prototype.initialize = function() {
        throw new Error('Uh oh!');
      };
      Test.prototype.page = sinon.spy();
      var test = new Test();
      test.invoke = sinon.spy();
      analytics.use(Test);
      analytics.add(test);
      analytics.initialize();
      analytics.page('Test Page Event');
      assert(test.invoke.notCalled);
    });

    it('should still invoke the integrations .ready method', function(done) {
      Test.prototype.initialize = function() {
        throw new Error('Uh oh!');
      };
      var spy = sinon.spy(Test.prototype, 'ready');
      var test = new Test();
      analytics.use(Test);
      analytics.add(test);
      analytics.ready(function() {
        assert(spy.called);
        done();
      });
      analytics.initialize();
    });

    it('should record a metric for integration errors', function() {
      Test.prototype.initialize = function() {
        throw new Error('Uh oh!');
      };
      var test = new Test();
      analytics.use(Test);
      analytics.add(test);
      analytics.initialize();
      assert(analytics.initialized);

      sinon.assert.calledTwice(metrics.increment);
      sinon.assert.calledWith(
        metrics.increment,
        'analytics_js.integration.invoke',
        {
          method: 'initialize',
          integration_name: 'Test'
        }
      );
      sinon.assert.calledWith(
        metrics.increment,
        'analytics_js.integration.invoke.error',
        {
          method: 'initialize',
          integration_name: 'Test'
        }
      );
    });

    it('should not error without settings', function() {
      analytics.initialize();
    });

    it('should set options', function() {
      analytics._options = sinon.spy();
      analytics.initialize({}, { option: true });
      assert(analytics._options.calledWith({ option: true }));
    });

    it('should reset analytics._readied to false', function() {
      analytics.addIntegration(Test);
      analytics._readied = true;
      analytics.initialize(settings);
      assert(!analytics._readied);
    });

    it('should add integration instance', function(done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(done);
      var test = new Test(settings.Test);
      analytics.add(test);
      analytics.initialize();
    });

    it('should set `.analytics` to self on integration', function(done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(done);
      var test = new Test(settings.Test);
      analytics.add(test);
      analytics.initialize();
      assert(test.analytics === analytics);
    });

    it('should listen on integration ready events', function(done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(done);
      analytics.initialize(settings);
    });

    it('should listen on integration ready events', function(done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(done);
      analytics.initialize(settings);

      sinon.assert.calledOnce(metrics.increment);
      sinon.assert.calledWith(
        metrics.increment,
        'analytics_js.integration.invoke',
        {
          method: 'initialize',
          integration_name: 'Test'
        }
      );
    });

    it('should still call ready with unknown integrations', function(done) {
      analytics.ready(done);
      analytics.initialize({ Unknown: { key: 'key' } });
    });

    it('should set analytics._readied to true', function(done) {
      analytics.ready(function() {
        assert(analytics._readied);
        done();
      });
      analytics.initialize();
    });

    it('should call #load on the user', function() {
      analytics.initialize();
      assert(user.load.called);
    });

    it('should call #load on the group', function() {
      analytics.initialize();
      assert(group.load.called);
    });

    it('should store enabled integrations', function(done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(function() {
        assert(analytics._integrations.Test instanceof Test);
        done();
      });
      analytics.initialize(settings);
    });

    it('should not load disabled integrations', function(done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(function() {
        assert(!analytics._integrations.Test);
        done();
      });
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
    });

    it('should not load any integrations when integrations.All === false', function(done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(function() {
        assert(!analytics._integrations.Test);
        done();
      });
      analytics.initialize(settings, {
        integrations: {
          All: false
        }
      });
    });

    it('should load explicitly enabled integrations when integrations.All === false', function(done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(function() {
        assert(analytics._integrations.Test);
        done();
      });
      analytics.initialize(settings, {
        integrations: {
          All: false,
          Test: {}
        }
      });
    });

    it('should send settings to an integration', function(done) {
      Test = function(options) {
        assert.deepEqual(settings.Test, options);
        done();
      };
      Test.prototype.name = 'Test';
      Test.prototype.once = Test.prototype.initialize = function() {};
      analytics.addIntegration(Test);
      analytics.initialize(settings);
    });

    it('should parse the query string', function() {
      sinon.stub(analytics, '_parseQuery');
      analytics.initialize();
      assert(analytics._parseQuery.called);
    });

    it('should set initialized state', function() {
      analytics.initialize();
      assert(analytics.initialized);
    });

    it('should emit initialize', function(done) {
      analytics.once('initialize', function() {
        done();
      });
      analytics.initialize();
    });

    it('should skip page call if assumepageview', function() {
      Test.prototype.page = sinon.spy();
      var options = { initialPageview: true };
      analytics.addIntegration(Test);
      analytics.initialize(settings, options);
      assert(Test.prototype.page.notCalled);
    });
  });

  describe('#ready', function() {
    it('should push a handler on to the queue', function(done) {
      analytics.ready(done);
      analytics.emit('ready');
    });

    it('should callback on next tick when already ready', function(done) {
      analytics.ready(function() {
        var spy = sinon.spy();
        analytics.ready(spy);
        assert(!spy.called);
        tick(function() {
          assert(spy.called);
          done();
        });
      });
      analytics.initialize();
    });

    it('should emit ready', function(done) {
      analytics.once('ready', done);
      analytics.initialize();
    });

    it('should not error when passed a non-function', function() {
      analytics.ready('callback');
    });
  });

  describe('#_invoke', function() {
    beforeEach(function(done) {
      Test.readyOnInitialize();
      Test.prototype.invoke = sinon.spy();
      analytics.addIntegration(Test);
      analytics.ready(done);
      analytics.initialize(settings);

      sinon.spy(metrics, 'increment');
    });

    afterEach(function() {
      metrics.increment.restore();
    });

    it('should invoke a method on integration with facade', function() {
      var a = new Identify({ userId: 'id', traits: { trait: true } });
      analytics._invoke('identify', a);
      var b = Test.prototype.invoke.args[0][1];
      assert(b.userId() === 'id');
      assert(b.traits().trait === true);
    });

    it('shouldnt call a method when the `all` option is false', function() {
      var opts = { providers: { all: false } };
      var facade = new Facade({ options: opts });
      analytics._invoke('identify', facade);
      assert(!Test.prototype.invoke.called);
    });

    it('shouldnt call a method when the integration option is false', function() {
      var opts = { providers: { Test: false } };
      var facade = new Facade({ options: opts });
      analytics._invoke('identify', facade);
      assert(!Test.prototype.invoke.called);
    });

    it('should not crash when invoking integration fails', function() {
      Test.prototype.invoke = function() {
        throw new Error('Uh oh!');
      };
      analytics.track('Test Event');
    });

    it('should record a metric when invoking an integration', function() {
      analytics.track('Test Event');

      sinon.assert.calledTwice(metrics.increment);
      sinon.assert.calledWith(metrics.increment, 'analytics_js.invoke', {
        method: 'track'
      });
      sinon.assert.calledWith(
        metrics.increment,
        'analytics_js.integration.invoke',
        {
          method: 'track',
          integration_name: 'Test'
        }
      );
    });

    it('should record a metric when invoking an integration and getting an error', function() {
      Test.prototype.invoke = function() {
        throw new Error('Uh oh!');
      };
      analytics.identify('prateek');

      sinon.assert.calledThrice(metrics.increment);
      sinon.assert.calledWith(metrics.increment, 'analytics_js.invoke', {
        method: 'identify'
      });
      sinon.assert.calledWith(
        metrics.increment,
        'analytics_js.integration.invoke',
        {
          method: 'identify',
          integration_name: 'Test'
        }
      );
      sinon.assert.calledWith(
        metrics.increment,
        'analytics_js.integration.invoke.error',
        {
          method: 'identify',
          integration_name: 'Test'
        }
      );
    });

    it('should support .integrations to disable / select integrations', function() {
      var opts = { integrations: { Test: false } };
      analytics.identify('123', {}, opts);
      assert(!Test.prototype.invoke.called);
    });

    it('should emit "invoke" with facade', function(done) {
      var opts = { All: false };
      var identify = new Identify({ testVal: 'success', options: opts });
      analytics.on('invoke', function(msg) {
        assert(msg instanceof Facade);
        assert(msg.obj.testVal === 'success');
        assert(msg.action() === 'identify');
        done();
      });
      analytics._invoke('identify', identify);
    });
  });

  describe('#_options', function() {
    beforeEach(function() {
      sinon.stub(cookie, 'options');
      sinon.stub(store, 'options');
      sinon.stub(user, 'options');
      sinon.stub(group, 'options');
      sinon.stub(metrics, 'options');
    });

    afterEach(function() {
      cookie.options.restore();
      store.options.restore();
      user.options.restore();
      group.options.restore();
      metrics.options.restore();
    });

    it('should set cookie options', function() {
      analytics._options({ cookie: { option: true } });
      assert(cookie.options.calledWith({ option: true }));
    });

    it('should set metrics options', function() {
      analytics._options({ metrics: { option: true } });
      assert(metrics.options.calledWith({ option: true }));
    });

    it('should set store options', function() {
      analytics._options({ localStorage: { option: true } });
      assert(store.options.calledWith({ option: true }));
    });

    it('should set user options', function() {
      analytics._options({ user: { option: true } });
      assert(user.options.calledWith({ option: true }));
    });

    it('should set group options', function() {
      analytics._options({ group: { option: true } });
      assert(group.options.calledWith({ option: true }));
    });
  });

  describe('#_parseQuery', function() {
    describe('user settings', function() {
      beforeEach(function() {
        sinon.spy(analytics, 'identify');
      });

      it('should parse `ajs_aid` and set anonymousId', function() {
        sinon.spy(user, 'anonymousId');
        analytics._parseQuery('?ajs_aid=123');
        assert(user.anonymousId.calledWith('123'));
      });

      it('should parse `ajs_uid` and call identify', function() {
        analytics._parseQuery('?ajs_uid=123');
        assert(analytics.identify.calledWith('123', {}));
      });

      it('should include traits in identify', function() {
        analytics._parseQuery('?ajs_uid=123&ajs_trait_name=chris');
        assert(analytics.identify.calledWith('123', { name: 'chris' }));
      });
    });

    describe('events', function() {
      beforeEach(function() {
        sinon.spy(analytics, 'track');
      });

      it('should parse `ajs_event` and call track', function() {
        analytics._parseQuery('?ajs_event=test');
        assert(analytics.track.calledWith('test', {}));
      });

      it('should include properties in track', function() {
        analytics._parseQuery('?ajs_event=Started+Trial&ajs_prop_plan=Silver');
        assert(analytics.track.calledWith('Started Trial', { plan: 'Silver' }));
      });
    });
  });

  describe('#_timeout', function() {
    it('should set the timeout for callbacks', function() {
      analytics.timeout(500);
      assert(analytics._timeout === 500);
    });
  });

  describe('#_callback', function() {
    it('should callback after a timeout', function(done) {
      var spy = sinon.spy();
      analytics._callback(spy);
      assert(!spy.called);
      tick(function() {
        assert(spy.called);
        done();
      });
    });
  });

  describe('#page', function() {
    var head = document.getElementsByTagName('head')[0];
    var defaults;

    beforeEach(function() {
      defaults = {
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
        url: window.location.href,
        search: window.location.search
      };
      sinon.spy(analytics, '_invoke');
    });

    it('should call #_invoke', function() {
      analytics.page();
      assert(analytics._invoke.calledWith('page'));
    });

    it('should default .anonymousId', function() {
      analytics.page();
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId().length === 36);
    });

    it('should override .anonymousId', function() {
      analytics.page('category', 'name', {}, { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId() === 'anon-id');
    });

    it('should call #_invoke with Page instance', function() {
      analytics.page();
      var page = analytics._invoke.args[0][1];
      assert(page.action() === 'page');
    });

    it('should default .url to .location.href', function() {
      analytics.page();
      var page = analytics._invoke.args[0][1];
      assert(page.properties().url === window.location.href);
    });

    it('should respect canonical', function() {
      var el = document.createElement('link');
      el.rel = 'canonical';
      el.href = 'baz.com';
      head.appendChild(el);
      analytics.page();
      var page = analytics._invoke.args[0][1];
      assert(page.properties().url === 'baz.com' + window.location.search);
      el.parentNode.removeChild(el);
    });

    it('should accept (category, name, properties, options, callback)', function(done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', {}, {}, function() {
        var page = analytics._invoke.args[0][1];
        assert(page.category() === 'category');
        assert(page.name() === 'name');
        assert(typeof page.properties() === 'object');
        assert(typeof page.options() === 'object');
        done();
      });
    });

    it('should accept (category, name, properties, callback)', function(done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', {}, function() {
        var page = analytics._invoke.args[0][1];
        assert(page.category() === 'category');
        assert(page.name() === 'name');
        assert(typeof page.properties() === 'object');
        done();
      });
    });

    it('should accept (category, name, callback)', function(done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', function() {
        var page = analytics._invoke.args[0][1];
        assert(page.category() === 'category');
        assert(page.name() === 'name');
        done();
      });
    });

    it('should accept (name, properties, options, callback)', function(done) {
      defaults.name = 'name';
      analytics.page('name', {}, {}, function() {
        var page = analytics._invoke.args[0][1];
        assert(page.name() === 'name');
        assert(typeof page.properties() === 'object');
        assert(typeof page.options() === 'object');
        done();
      });
    });

    it('should accept (name, properties, callback)', function(done) {
      defaults.name = 'name';
      analytics.page('name', {}, function() {
        var page = analytics._invoke.args[0][1];
        assert(page.name() === 'name');
        assert(typeof page.properties() === 'object');
        done();
      });
    });

    it('should accept (name, callback)', function(done) {
      defaults.name = 'name';
      analytics.page('name', function() {
        var page = analytics._invoke.args[0][1];
        assert(page.name() === 'name');
        done();
      });
    });

    it('should accept (properties, options, callback)', function(done) {
      analytics.page({}, {}, function() {
        var page = analytics._invoke.args[0][1];
        assert(page.category() === null);
        assert(page.name() === null);
        assert(typeof page.properties() === 'object');
        assert(typeof page.options() === 'object');
        done();
      });
    });

    it('should accept (properties, callback)', function(done) {
      analytics.page({}, function() {
        var page = analytics._invoke.args[0][1];
        assert(page.category() === null);
        assert(page.name() === null);
        assert(typeof page.options() === 'object');
        done();
      });
    });

    it('should back properties with defaults', function() {
      defaults.property = true;
      analytics.page({ property: true });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(page.properties(), defaults);
    });

    it('should accept top level option .timestamp', function() {
      var date = new Date();
      analytics.page({ prop: true }, { timestamp: date });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(page.timestamp(), date);
    });

    it('should accept top level option .integrations', function() {
      analytics.page(
        { prop: true },
        { integrations: { AdRoll: { opt: true } } }
      );
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(page.options('AdRoll'), { opt: true });
    });

    it('should use the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.page({ prop: true });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(page.obj.integrations, { Test: false });
    });

    it('should be able to override the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.page(
        { prop: true },
        {
          integrations: {
            Test: true
          }
        }
      );
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(page.obj.integrations, { Test: true });
    });

    it('should accept top level option .context', function() {
      var app = { name: 'segment' };
      analytics.page({ prop: true }, { context: { app: app } });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(app, page.obj.context.app);
    });

    it('should accept top level option .anonymousId', function() {
      analytics.page({ prop: true }, { anonymousId: 'id' });
      var page = analytics._invoke.args[0][1];
      assert(page.obj.anonymousId === 'id');
    });

    it('should include context.page', function() {
      analytics.page();
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(page.context(), { page: defaults });
    });

    it('should accept context.traits', function() {
      analytics.page({ prop: true }, { traits: { trait: true } });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(page.context(), {
        page: defaults,
        traits: { trait: true }
      });
    });

    it('should emit page', function(done) {
      analytics.once('page', function(category, name, props, opts) {
        assert(category === 'category');
        assert(name === 'name');
        assert.deepEqual(opts, { context: { page: defaults } });
        assert.deepEqual(
          props,
          extend(defaults, { category: 'category', name: 'name' })
        );
        done();
      });
      analytics.page('category', 'name', {}, {});
    });
  });

  describe('#pageview', function() {
    beforeEach(function() {
      analytics.initialize();
      sinon.spy(analytics, 'page');
    });

    it('should call #page with a path', function() {
      analytics.pageview('/path');
      assert(analytics.page.calledWith({ path: '/path' }));
    });
  });

  describe('#identify', function() {
    beforeEach(function() {
      sinon.spy(analytics, '_invoke');
      sinon.spy(user, 'identify');
    });

    afterEach(function() {
      user.identify.restore();
    });

    it('should call #_invoke', function() {
      analytics.identify();
      assert(analytics._invoke.calledWith('identify'));
    });

    it('should default .anonymousId', function() {
      analytics.identify('user-id');
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId().length === 36);
    });

    it('should override .anonymousId', function() {
      analytics.identify('user-id', {}, { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId() === 'anon-id');
    });

    it('should call #_invoke with Identify', function() {
      analytics.identify();
      var identify = analytics._invoke.getCall(0).args[1];
      assert(identify.action() === 'identify');
    });

    it('should accept (id, traits, options, callback)', function(done) {
      analytics.identify('id', {}, {}, function() {
        var identify = analytics._invoke.getCall(0).args[1];
        assert(identify.userId() === 'id');
        assert(typeof identify.traits() === 'object');
        assert(typeof identify.options() === 'object');
        done();
      });
    });

    it('should accept (id, traits, callback)', function(done) {
      analytics.identify('id', { trait: true }, function() {
        var identify = analytics._invoke.getCall(0).args[1];
        assert(identify.userId() === 'id');
        assert(typeof identify.traits() === 'object');
        done();
      });
    });

    it('should accept (id, callback)', function(done) {
      analytics.identify('id', function() {
        var identify = analytics._invoke.getCall(0).args[1];
        assert(identify.action() === 'identify');
        assert(identify.userId() === 'id');
        done();
      });
    });

    it('should accept (traits, options, callback)', function(done) {
      analytics.identify({}, {}, function() {
        var identify = analytics._invoke.getCall(0).args[1];
        assert(typeof identify.traits() === 'object');
        assert(typeof identify.options() === 'object');
        done();
      });
    });

    it('should accept (traits, callback)', function(done) {
      analytics.identify({}, function() {
        var identify = analytics._invoke.getCall(0).args[1];
        assert(typeof identify.traits() === 'object');
        done();
      });
    });

    it('should identify the user', function() {
      analytics.identify('id', { trait: true });
      assert(user.identify.calledWith('id', { trait: true }));
    });

    it('should back traits with stored traits', function() {
      user.traits({ one: 1 });
      user.save();
      analytics.identify('id', { two: 2 });
      var call = analytics._invoke.getCall(0);
      var identify = call.args[1];
      assert(call.args[0] === 'identify');
      assert(identify.userId() === 'id');
      assert(identify.traits().one === 1);
      assert(identify.traits().two === 2);
    });

    it('should emit identify', function(done) {
      analytics.once('identify', function(id, traits, options) {
        assert(id === 'id');
        assert.deepEqual(traits, { a: 1 });
        assert.deepEqual(options, { b: 2 });
        done();
      });
      analytics.identify('id', { a: 1 }, { b: 2 });
    });

    it('should parse a created string into a date', function() {
      var date = new Date();
      var string = date.getTime().toString();
      analytics.identify({ created: string });
      var created = analytics._invoke.args[0][1].created();
      assert(type(created) === 'date');
      assert(created.getTime() === date.getTime());
    });

    it('should parse created milliseconds into a date', function() {
      var date = new Date();
      var milliseconds = date.getTime();
      analytics.identify({ created: milliseconds });
      var created = analytics._invoke.args[0][1].created();
      assert(type(created) === 'date');
      assert(created.getTime() === milliseconds);
    });

    it('should parse created seconds into a date', function() {
      var date = new Date();
      var seconds = Math.floor(date.getTime() / 1000);
      analytics.identify({ created: seconds });
      var identify = analytics._invoke.args[0][1];
      var created = identify.created();
      assert(type(created) === 'date');
      assert(created.getTime() === seconds * 1000);
    });

    it('should parse a company created string into a date', function() {
      var date = new Date();
      var string = date.getTime() + '';
      analytics.identify({ company: { created: string } });
      var identify = analytics._invoke.args[0][1];
      var created = identify.companyCreated();
      assert(type(created) === 'date');
      assert(created.getTime() === date.getTime());
    });

    it('should parse company created milliseconds into a date', function() {
      var date = new Date();
      var milliseconds = date.getTime();
      analytics.identify({ company: { created: milliseconds } });
      var identify = analytics._invoke.args[0][1];
      var created = identify.companyCreated();
      assert(type(created) === 'date');
      assert(created.getTime() === milliseconds);
    });

    it('should parse company created seconds into a date', function() {
      var date = new Date();
      var seconds = Math.floor(date.getTime() / 1000);
      analytics.identify({ company: { created: seconds } });
      var identify = analytics._invoke.args[0][1];
      var created = identify.companyCreated();
      assert(type(created) === 'date');
      assert(created.getTime() === seconds * 1000);
    });

    it('should accept top level option .timestamp', function() {
      var date = new Date();
      analytics.identify(1, { trait: true }, { timestamp: date });
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(identify.timestamp(), date);
    });

    it('should accept top level option .integrations', function() {
      analytics.identify(
        1,
        { trait: true },
        { integrations: { AdRoll: { opt: true } } }
      );
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual({ opt: true }, identify.options('AdRoll'));
    });

    it('should use the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.identify(1, { trait: true });
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(identify.obj.integrations, { Test: false });
    });

    it('should be able to override the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.identify(
        1,
        { trait: true },
        {
          integrations: {
            Test: true
          }
        }
      );
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(identify.obj.integrations, { Test: true });
    });

    it('should accept top level option .context', function() {
      analytics.identify(
        1,
        { trait: true },
        { context: { app: { name: 'segment' } } }
      );
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(identify.obj.context.app, { name: 'segment' });
    });

    it('should include context.page', function() {
      analytics.identify(1);
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(identify.context(), { page: contextPage });
    });

    it('should accept context.traits', function() {
      analytics.identify(1, { trait: 1 }, { traits: { trait: true } });
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(identify.traits(), { trait: 1, id: 1 });
      assert.deepEqual(identify.context(), {
        page: contextPage,
        traits: { trait: true }
      });
    });
  });

  describe('#user', function() {
    it('should return the user singleton', function() {
      assert(analytics.user() === user);
    });
  });

  describe('#group', function() {
    beforeEach(function() {
      sinon.spy(analytics, '_invoke');
      sinon.spy(group, 'identify');
    });

    afterEach(function() {
      group.identify.restore();
    });

    it('should return the group singleton', function() {
      assert(analytics.group() === group);
    });

    it('should call #_invoke', function() {
      analytics.group('id');
      assert(analytics._invoke.calledWith('group'));
    });

    it('should default .anonymousId', function() {
      analytics.group('group-id');
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId().length === 36);
    });

    it('should override .anonymousId', function() {
      analytics.group('group-id', {}, { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId() === 'anon-id');
    });

    it('should call #_invoke with group facade instance', function() {
      analytics.group('id');
      var group = analytics._invoke.args[0][1];
      assert(group.action() === 'group');
    });

    it('should accept (id, properties, options, callback)', function(done) {
      analytics.group('id', {}, {}, function() {
        var group = analytics._invoke.args[0][1];
        assert(group.groupId() === 'id');
        assert(typeof group.properties() === 'object');
        assert(typeof group.options() === 'object');
        done();
      });
    });

    it('should accept (id, properties, callback)', function(done) {
      analytics.group('id', {}, function() {
        var group = analytics._invoke.args[0][1];
        assert(group.groupId() === 'id');
        assert(typeof group.properties() === 'object');
        done();
      });
    });

    it('should accept (id, callback)', function(done) {
      analytics.group('id', function() {
        var group = analytics._invoke.args[0][1];
        assert(group.groupId() === 'id');
        done();
      });
    });

    it('should accept (properties, options, callback)', function(done) {
      analytics.group({}, {}, function() {
        var group = analytics._invoke.args[0][1];
        assert(typeof group.properties() === 'object');
        assert(typeof group.options() === 'object');
        done();
      });
    });

    it('should accept (properties, callback)', function(done) {
      analytics.group({}, function() {
        var group = analytics._invoke.args[0][1];
        assert(typeof group.properties() === 'object');
        done();
      });
    });

    it('should call #identify on the group', function() {
      analytics.group('id', { property: true });
      assert(group.identify.calledWith('id', { property: true }));
    });

    it('should back properties with stored properties', function() {
      group.properties({ one: 1 });
      group.save();
      analytics.group('id', { two: 2 });
      var g = analytics._invoke.args[0][1];
      assert(g.groupId() === 'id');
      assert(typeof g.properties() === 'object');
      assert(g.properties().one === 1);
      assert(g.properties().two === 2);
    });

    it('should emit group', function(done) {
      analytics.once('group', function(groupId, traits, options) {
        assert(groupId === 'id');
        assert.deepEqual(traits, { a: 1 });
        assert.deepEqual(options, { b: 2 });
        done();
      });
      analytics.group('id', { a: 1 }, { b: 2 });
    });

    it('should parse a created string into a date', function() {
      var date = new Date();
      var string = date.getTime().toString();
      analytics.group({ created: string });
      var g = analytics._invoke.args[0][1];
      var created = g.created();
      assert(type(created) === 'date');
      assert(created.getTime() === date.getTime());
    });

    it('should parse created milliseconds into a date', function() {
      var date = new Date();
      var milliseconds = date.getTime();
      analytics.group({ created: milliseconds });
      var g = analytics._invoke.args[0][1];
      var created = g.created();
      assert(type(created) === 'date');
      assert(created.getTime() === milliseconds);
    });

    it('should parse created seconds into a date', function() {
      var date = new Date();
      var seconds = Math.floor(date.getTime() / 1000);
      analytics.group({ created: seconds });
      var g = analytics._invoke.args[0][1];
      var created = g.created();
      assert(type(created) === 'date');
      assert(created.getTime() === seconds * 1000);
    });

    it('should accept top level option .timestamp', function() {
      var date = new Date();
      analytics.group(1, { trait: true }, { timestamp: date });
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(group.timestamp(), date);
    });

    it('should accept top level option .integrations', function() {
      analytics.group(
        1,
        { trait: true },
        { integrations: { AdRoll: { opt: true } } }
      );
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(group.options('AdRoll'), { opt: true });
    });

    it('should use the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.group(1, { trait: true });
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(group.obj.integrations, { Test: false });
    });

    it('should be able to override the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.group(
        1,
        { trait: true },
        {
          integrations: {
            Test: true
          }
        }
      );
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(group.obj.integrations, { Test: true });
    });

    it('should accept top level option .context', function() {
      var app = { name: 'segment' };
      analytics.group(1, { trait: true }, { context: { app: app } });
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(group.obj.context.app, app);
    });

    it('should include context.page', function() {
      analytics.group(1);
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(group.context(), { page: contextPage });
    });

    it('should accept context.traits', function() {
      analytics.group(1, { trait: 1 }, { traits: { trait: true } });
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(group.traits(), { trait: 1, id: 1 });
      assert.deepEqual(group.context(), {
        page: contextPage,
        traits: { trait: true }
      });
    });
  });

  describe('#track', function() {
    beforeEach(function() {
      sinon.spy(analytics, '_invoke');
    });

    it('should call #_invoke', function() {
      analytics.track();
      assert(analytics._invoke.calledWith('track'));
    });

    it('should default .anonymousId', function() {
      analytics.track();
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId().length === 36);
    });

    it('should override .anonymousId', function() {
      analytics.track('event', {}, { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId() === 'anon-id');
    });

    it('should transform arguments into Track', function() {
      analytics.track();
      var track = analytics._invoke.getCall(0).args[1];
      assert(track.action() === 'track');
    });

    it('should accept (event, properties, options, callback)', function(done) {
      analytics.track('event', {}, {}, function() {
        var track = analytics._invoke.args[0][1];
        assert(track.event() === 'event');
        assert(typeof track.properties() === 'object');
        assert(typeof track.options() === 'object');
        done();
      });
    });

    it('should accept (event, properties, callback)', function(done) {
      analytics.track('event', {}, function() {
        var track = analytics._invoke.args[0][1];
        assert(track.event() === 'event');
        assert(typeof track.properties() === 'object');
        done();
      });
    });

    it('should accept (event, callback)', function(done) {
      analytics.track('event', function() {
        var track = analytics._invoke.args[0][1];
        assert(track.event() === 'event');
        done();
      });
    });

    it('should emit track', function(done) {
      analytics.once('track', function(event, properties, options) {
        assert(event === 'event');
        assert.deepEqual(properties, { a: 1 });
        assert.deepEqual(options, { b: 2 });
        done();
      });
      analytics.track('event', { a: 1 }, { b: 2 });
    });

    it('should safely convert ISO dates to date objects', function() {
      var date = new Date(Date.UTC(2013, 9, 5));
      analytics.track('event', {
        date: '2013-10-05T00:00:00.000Z',
        nonDate: '2013'
      });
      var track = analytics._invoke.args[0][1];
      assert(track.properties().date.getTime() === date.getTime());
      assert(track.properties().nonDate === '2013');
    });

    it('should accept top level option .timestamp', function() {
      var date = new Date();
      analytics.track('event', { prop: true }, { timestamp: date });
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(date, track.timestamp());
    });

    it('should accept top level option .integrations', function() {
      analytics.track(
        'event',
        { prop: true },
        { integrations: { AdRoll: { opt: true } } }
      );
      var track = analytics._invoke.args[0][1];
      assert.deepEqual({ opt: true }, track.options('AdRoll'));
    });

    it('should use the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.track('event', { prop: true });
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(track.obj.integrations, { Test: false });
    });

    it('should be able to override the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.track(
        'event',
        { prop: true },
        {
          integrations: {
            Test: true
          }
        }
      );
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(track.obj.integrations, { Test: true });
    });

    it('should allow tracking plan to disable integrations explicitly enabled via initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          All: false,
          Test: true
        },
        plan: {
          track: {
            event1: { enabled: false },
            event2: {
              enabled: true,
              integrations: { Test: false }
            }
          }
        }
      });

      analytics.track('event1', { prop: true });
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(track.obj.integrations, {
        All: false,
        'Segment.io': true
      });

      analytics.track('event2', { prop: true });
      var track2 = analytics._invoke.args[1][1];
      assert.deepEqual(track2.obj.integrations, { All: false, Test: false });
    });

    it('should prevent tracking plan from enabling integrations disabled via initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        },
        plan: {
          track: {
            event1: { enabled: true },
            event2: {
              enabled: true,
              integrations: { Test: true }
            }
          }
        }
      });

      analytics.track('event1', { prop: true });
      var track1 = analytics._invoke.args[0][1];
      assert.deepEqual(track1.obj.integrations, { Test: false });

      analytics.track('event2', { prop: true });
      var track2 = analytics._invoke.args[1][1];
      assert.deepEqual(track2.obj.integrations, { Test: false });
    });

    it('should accept top level option .context', function() {
      var app = { name: 'segment' };
      analytics.track('event', { prop: true }, { context: { app: app } });
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(app, track.obj.context.app);
    });

    it('should call #_invoke for Segment if the event is disabled', function() {
      analytics.options.plan = {
        track: {
          event: { enabled: false }
        }
      };
      analytics.track('event');
      assert(analytics._invoke.called);
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(
        { All: false, 'Segment.io': true },
        track.obj.integrations
      );
    });

    it('should call #_invoke if the event is enabled', function() {
      analytics.options.plan = {
        track: {
          event: { enabled: true }
        }
      };
      analytics.track('event');
      assert(analytics._invoke.called);
    });

    it('should call the callback even if the event is disabled', function(done) {
      analytics.options.plan = {
        track: {
          event: { enabled: false }
        }
      };
      assert(!analytics._invoke.called);
      analytics.track('event', {}, {}, function() {
        done();
      });
    });

    it('should default .integrations to plan.integrations', function() {
      analytics.options.plan = {
        track: {
          event: {
            integrations: { All: true }
          }
        }
      };

      analytics.track('event', {}, { integrations: { Segment: true } });
      var msg = analytics._invoke.args[0][1];
      assert(msg.event() === 'event');
      assert.deepEqual(msg.integrations(), { All: true, Segment: true });
    });

    it('should call #_invoke if new events are enabled', function() {
      analytics.options.plan = {
        track: {
          __default: { enabled: true }
        }
      };
      analytics.track('event');
      assert(analytics._invoke.called);
      var track = analytics._invoke.args[0][1];
      assert.deepEqual({}, track.obj.integrations);
    });

    it('should call #_invoke for Segment if new events are disabled', function() {
      analytics.options.plan = {
        track: {
          __default: { enabled: false }
        }
      };
      analytics.track('even');
      assert(analytics._invoke.called);
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(
        { All: false, 'Segment.io': true },
        track.obj.integrations
      );
    });

    it('should use the event plan if it exists and ignore defaults', function() {
      analytics.options.plan = {
        track: {
          event: { enabled: true },
          __default: { enabled: false }
        }
      };
      analytics.track('event');
      assert(analytics._invoke.called);
      var track = analytics._invoke.args[0][1];
      assert.deepEqual({}, track.obj.integrations);
    });

    it('should merge the event plan if it exists and ignore defaults', function() {
      analytics.options.plan = {
        track: {
          event: { enabled: true, integrations: { Mixpanel: false } },
          __default: { enabled: false }
        }
      };
      analytics.track('event');
      assert(analytics._invoke.called);
      var track = analytics._invoke.args[0][1];
      assert.deepEqual({ Mixpanel: false }, track.obj.integrations);
    });

    it('should not set ctx.integrations if plan.integrations is empty', function() {
      analytics.options.plan = { track: { event: {} } };
      analytics.track('event', {}, { campaign: {} });
      var msg = analytics._invoke.args[0][1];
      assert.deepEqual({}, msg.proxy('context.campaign'));
    });

    it('should include context.page', function() {
      analytics.track('event');
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(track.context(), { page: contextPage });
    });

    it('should accept context.traits', function() {
      analytics.track('event', { prop: 1 }, { traits: { trait: true } });
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(track.properties(), { prop: 1 });
      assert.deepEqual(track.context(), {
        page: contextPage,
        traits: { trait: true }
      });
    });
  });

  describe('#trackLink', function() {
    var link;
    var wrap;
    var svg;

    beforeEach(function() {
      // FIXME: IE8 doesn't have createElementNS.
      if (!document.createElementNS) return;
      wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'a');
      wrap.appendChild(svg);
      document.body.appendChild(wrap);
    });

    beforeEach(function() {
      sinon.spy(analytics, 'track');
      link = document.createElement('a');
      link.href = '#';
      document.body.appendChild(link);
    });

    afterEach(function() {
      window.location.hash = '';
      if (wrap) document.body.removeChild(wrap);
      document.body.removeChild(link);
    });

    it('should trigger a track on an element click', function() {
      analytics.trackLink(link);
      trigger(link, 'click');
      assert(analytics.track.called);
    });

    it('should accept a jquery object for an element', function() {
      var $link = jQuery(link);
      analytics.trackLink($link);
      trigger(link, 'click');
      assert(analytics.track.called);
    });

    it('should not accept a string for an element', function() {
      assert['throws'](
        function() {
          analytics.trackLink('a');
        },
        TypeError,
        'Must pass HTMLElement to `analytics.trackLink`.'
      );
      trigger(link, 'click');
      assert(!analytics.track.called);
    });

    it('should send an event and properties', function() {
      analytics.trackLink(link, 'event', { property: true });
      trigger(link, 'click');
      assert(analytics.track.calledWith('event', { property: true }));
    });

    it('should accept an event function', function() {
      function event(el) {
        return el.nodeName;
      }
      analytics.trackLink(link, event);
      trigger(link, 'click');
      assert(analytics.track.calledWith('A'));
    });

    it('should accept a properties function', function() {
      function properties(el) {
        return { type: el.nodeName };
      }
      analytics.trackLink(link, 'event', properties);
      trigger(link, 'click');
      assert(analytics.track.calledWith('event', { type: 'A' }));
    });

    it('should load an href on click', function(done) {
      link.href = '#test';
      analytics.trackLink(link);
      trigger(link, 'click');
      tick(function() {
        assert(window.location.hash === '#test');
        done();
      });
    });

    it('should support svg .href attribute', function(done) {
      if (!svg) return done();
      // not correct svg, but should work.
      svg.setAttribute('href', '#svg');
      analytics.trackLink(svg);
      trigger(svg, 'click');
      tick(function() {
        assert.equal(window.location.hash, '#svg');
        done();
      });
    });

    it('should fallback to getAttributeNS', function(done) {
      if (!wrap) return done();
      svg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#svg');
      analytics.trackLink(svg);
      trigger(svg, 'click');
      tick(function() {
        assert.equal(window.location.hash, '#svg');
        done();
      });
    });

    it('should support xlink:href', function(done) {
      if (!wrap) return done();
      svg.setAttribute('xlink:href', '#svg');
      analytics.trackLink(svg);
      trigger(svg, 'click');
      tick(function() {
        assert.equal(window.location.hash, '#svg');
        done();
      });
    });

    it('should not load an href for a link with a blank target', function(done) {
      link.href = '/base/test/support/mock.html';
      link.target = '_blank';
      analytics.trackLink(link);
      trigger(link, 'click');
      tick(function() {
        assert(window.location.hash !== '#test');
        done();
      });
    });
  });

  describe('#trackForm', function() {
    var form;
    var submit;

    before(function() {
      window.jQuery = jQuery;
    });

    after(function() {
      window.jQuery = null;
    });

    beforeEach(function() {
      sinon.spy(analytics, 'track');
      form = document.createElement('form');
      form.action = '/base/test/support/mock.html';
      form.target = '_blank';
      submit = document.createElement('input');
      submit.type = 'submit';
      form.appendChild(submit);
      document.body.appendChild(form);
    });

    afterEach(function() {
      window.location.hash = '';
      document.body.removeChild(form);
    });

    it('should trigger a track on a form submit', function() {
      analytics.trackForm(form);
      submit.click();
      assert(analytics.track.called);
    });

    it('should accept a jquery object for an element', function() {
      analytics.trackForm(form);
      submit.click();
      assert(analytics.track.called);
    });

    it('should not accept a string for an element', function() {
      var str = 'form';
      assert['throws'](
        function() {
          analytics.trackForm(str);
        },
        TypeError,
        'Must pass HTMLElement to `analytics.trackForm`.'
      );
      submit.click();
      assert(!analytics.track.called);
    });

    it('should send an event and properties', function() {
      analytics.trackForm(form, 'event', { property: true });
      submit.click();
      assert(analytics.track.calledWith('event', { property: true }));
    });

    it('should accept an event function', function() {
      function event() {
        return 'event';
      }
      analytics.trackForm(form, event);
      submit.click();
      assert(analytics.track.calledWith('event'));
    });

    it('should accept a properties function', function() {
      function properties() {
        return { property: true };
      }
      analytics.trackForm(form, 'event', properties);
      submit.click();
      assert(analytics.track.calledWith('event', { property: true }));
    });

    it('should call submit after a timeout', function(done) {
      var spy = (form.submit = sinon.spy());
      analytics.trackForm(form);
      submit.click();
      setTimeout(function() {
        assert(spy.called);
        done();
      }, 50);
    });

    it('should trigger an existing submit handler', function(done) {
      bind(form, 'submit', function() {
        done();
      });
      analytics.trackForm(form);
      submit.click();
    });

    it('should trigger an existing jquery submit handler', function(done) {
      var $form = jQuery(form);
      $form.submit(function() {
        done();
      });
      analytics.trackForm(form);
      submit.click();
    });

    it('should track on a form submitted via jquery', function() {
      var $form = jQuery(form);
      analytics.trackForm(form);
      $form.submit();
      assert(analytics.track.called);
    });

    it('should trigger an existing jquery submit handler on a form submitted via jquery', function(done) {
      var $form = jQuery(form);
      $form.submit(function() {
        done();
      });
      analytics.trackForm(form);
      $form.submit();
    });
  });

  describe('#alias', function() {
    beforeEach(function() {
      sinon.spy(analytics, '_invoke');
    });

    it('should call #_invoke', function() {
      analytics.alias();
      assert(analytics._invoke.calledWith('alias'));
    });

    it('should call #_invoke with instanceof Alias', function() {
      analytics.alias();
      var alias = analytics._invoke.args[0][1];
      assert(alias.action() === 'alias');
    });

    it('should default .anonymousId', function() {
      analytics.alias('previous-id', 'user-id');
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId().length === 36);
    });

    it('should override .anonymousId', function() {
      analytics.alias('previous-id', 'user-id', { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert(msg.anonymousId() === 'anon-id');
    });

    it('should accept (new, old, options, callback)', function(done) {
      analytics.alias('new', 'old', {}, function() {
        var alias = analytics._invoke.args[0][1];
        assert(alias.from() === 'old');
        assert(alias.to() === 'new');
        assert(typeof alias.options() === 'object');
        done();
      });
    });

    it('should accept (new, old, callback)', function(done) {
      analytics.alias('new', 'old', function() {
        var alias = analytics._invoke.args[0][1];
        assert(alias.from() === 'old');
        assert(alias.to() === 'new');
        assert(typeof alias.options() === 'object');
        done();
      });
    });

    it('should accept (new, callback)', function(done) {
      analytics.alias('new', function() {
        var alias = analytics._invoke.args[0][1];
        assert(alias.to() === 'new');
        assert(typeof alias.options() === 'object');
        done();
      });
    });

    it('should include context.page', function() {
      analytics.alias();
      var alias = analytics._invoke.args[0][1];
      assert.deepEqual(alias.context(), { page: contextPage });
    });

    it('should emit alias', function(done) {
      analytics.once('alias', function(newId, oldId, options) {
        assert(newId === 'new');
        assert(oldId === 'old');
        assert.deepEqual(options, { opt: true });
        done();
      });
      analytics.alias('new', 'old', { opt: true });
    });

    it('should accept top level option .integrations', function() {
      analytics.alias('new', 'old', {
        integrations: { AdRoll: { opt: true } }
      });
      var alias = analytics._invoke.args[0][1];
      assert.deepEqual({ opt: true }, alias.options('AdRoll'));
    });

    it('should use the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.alias('new', 'old');
      var alias = analytics._invoke.args[0][1];
      assert.deepEqual(alias.obj.integrations, { Test: false });
    });

    it('should be able to override the initialize .integrations option', function() {
      analytics.initialize(settings, {
        integrations: {
          Test: false
        }
      });
      analytics.alias('new', 'old', {
        integrations: {
          Test: true
        }
      });
      var alias = analytics._invoke.args[0][1];
      assert.deepEqual(alias.obj.integrations, { Test: true });
    });
  });

  describe('#push', function() {
    beforeEach(function() {
      analytics.track = sinon.spy();
    });

    it('should call methods with args', function() {
      analytics.push(['track', 'event', { prop: true }]);
      assert(analytics.track.calledWith('event', { prop: true }));
    });
  });

  describe('#reset', function() {
    beforeEach(function() {
      user.id('user-id');
      user.traits({ name: 'John Doe' });
      group.id('group-id');
      group.traits({ name: 'Example' });
    });

    it('should remove persisted group and user', function() {
      assert(user.id() === 'user-id');
      assert(user.traits().name === 'John Doe');
      assert(group.id() === 'group-id');
      assert(group.traits().name === 'Example');
      analytics.reset();
      assert(user.id() === null);
      assert.deepEqual({}, user.traits());
      assert(group.id() === null);
      assert.deepEqual({}, group.traits());
    });
  });

  describe('#addIntegrationMiddleware', function() {
    it('should have a defined _integrationMiddlewares property', function() {
      assert(analytics._integrationMiddlewares !== undefined);
    });

    it('should allow users to add a valid Middleware', function() {
      try {
        analytics.addIntegrationMiddleware(function() {});
      } catch (e) {
        // This assert should not run.
        assert(false, 'error was incorrectly thrown!');
      }
    });

    it('should throw an error if the selected Middleware is not a function', function() {
      try {
        analytics.addIntegrationMiddleware(7);

        // This assert should not run.
        assert(false, 'error was not thrown!');
      } catch (e) {
        assert(
          e.message === 'attempted to add non-function middleware',
          'wrong error return'
        );
      }
    });

    it('should not throw an error if AJS has already initialized', function() {
      analytics.init();
      try {
        analytics.addIntegrationMiddleware(function() {});
      } catch (e) {
        // This assert should not run.
        assert(false, 'error was thrown!');
      }
    });

    it('should return the analytics object', function() {
      assert(analytics === analytics.addIntegrationMiddleware(function() {}));
    });
  });

  describe('#addDestinationMiddleware', function() {
    it('should have a defined _integrationMiddlewares property', function() {
      assert(analytics._destinationMiddlewares !== undefined);
    });

    it('should allow users to add a valid Middleware', function() {
      try {
        analytics.addDestinationMiddleware('foo', [function() {}]);
      } catch (e) {
        // This assert should not run.
        assert(false, 'error was incorrectly thrown!');
      }
    });

    it('should throw an error if the selected Middleware is not a function', function() {
      try {
        analytics.addDestinationMiddleware('foo', [7]);

        // This assert should not run.
        assert(false, 'error was not thrown!');
      } catch (e) {
        assert(
          e.message === 'attempted to add non-function middleware',
          'wrong error return'
        );
      }
    });

    it('should not throw an error if AJS has already initialized', function() {
      analytics.init();
      try {
        analytics.addDestinationMiddleware('foo', [function() {}]);
      } catch (e) {
        // This assert should not run.
        assert(false, 'error was thrown!');
      }
    });

    it('should return the analytics object', function() {
      assert(
        analytics === analytics.addDestinationMiddleware('foo', [function() {}])
      );
    });
  });

  describe('#addSourceMiddleware', function() {
    it('should have a defined _sourceMiddlewares property', function() {
      assert(analytics._sourceMiddlewares !== undefined);
    });

    it('should allow users to add a valid Middleware', function() {
      try {
        analytics.addSourceMiddleware(function() {});
      } catch (e) {
        // This assert should not run.
        assert(false, 'error was incorrectly thrown!');
      }
    });

    it('should throw an error if the selected Middleware is not a function', function() {
      try {
        analytics.addSourceMiddleware(8);

        // This assert should not run.
        assert(false, 'error was not thrown!');
      } catch (e) {
        assert(
          e.message === 'attempted to add non-function middleware',
          'wrong error return'
        );
      }
    });

    it('should not throw an error if AJS has already initialized', function() {
      analytics.init();
      try {
        analytics.addSourceMiddleware(function() {});
      } catch (e) {
        // This assert should not run.
        assert(false, 'error was not thrown!');
      }
    });

    it('should return the analytics object', function() {
      assert(analytics === analytics.addSourceMiddleware(function() {}));
    });
  });
});
