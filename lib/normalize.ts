'use strict';

import { Message } from './types';

/**
 * Module Dependencies.
 */

var debug = require('debug')('analytics.js:normalize');
var defaults = require('@ndhoule/defaults');
var includes = require('@ndhoule/includes');
var type = require('component-type');
var uuid = require('uuid/v4');
var md5 = require('spark-md5').hash;

/**
 * HOP.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose `normalize`
 */

module.exports = normalize;

/**
 * Toplevel properties.
 */

var toplevel = ['integrations', 'anonymousId', 'timestamp', 'context'];

/**
 * Normalize `msg` based on integrations `list`.
 */

interface NormalizedMessage {
  integrations?: {
    [key: string]: string;
  };
  context?: unknown;
}

function normalize(msg: Message, list: Array<any>): NormalizedMessage {
  var lower = list?.map(function(s) {
    return s.toLowerCase();
  });
  var opts: Message = msg.options || {};
  var integrations = opts.integrations || {};
  var providers = opts.providers || {};
  var context = opts.context || {};
  var ret: {
    integrations?: { [key: string]: string };
    context?: unknown;
  } = {};
  debug('<-', msg);

  // integrations.
  Object.keys(opts).forEach(key => {
    if (!integration(key)) return;
    if (!has.call(integrations, key)) integrations[key] = opts[key];
    delete opts[key];
  });

  // providers.
  delete opts.providers;
  Object.keys(providers).forEach(key => {
    if (!integration(key)) return;
    if (type(integrations[key]) === 'object') return;
    if (has.call(integrations, key) && typeof providers[key] === 'boolean')
      return;
    integrations[key] = providers[key] as string;
  });

  // move all toplevel options to msg
  // and the rest to context.
  Object.keys(opts).forEach(key => {
    if (includes(key, toplevel)) {
      ret[key] = opts[key];
    } else {
      context[key] = opts[key];
    }
  }, opts);

  // generate and attach a messageId to msg
  msg.messageId = 'ajs-' + md5(window.JSON.stringify(msg) + uuid());

  // cleanup
  delete msg.options;
  ret.integrations = integrations;
  ret.context = context;
  ret = defaults(ret, msg);
  debug('->', ret);
  return ret;

  function integration(name: string) {
    return !!(
      includes(name, list) ||
      name.toLowerCase() === 'all' ||
      includes(name.toLowerCase(), lower)
    );
  }
}
