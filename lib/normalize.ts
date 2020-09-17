import { Message } from './types';
import includes from 'lodash.includes'

/**
 * Module Dependencies.
 */

var debug = require('debug')('analytics.js:normalize');
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
  const lower = list?.map(function(s) {
    return s.toLowerCase();
  });
  const opts: Message = msg.options || {};
  const integrations = opts.integrations || {};
  const providers = opts.providers || {};
  const context = opts.context || {};
  let ret: {
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
    if (includes(toplevel, key)) {
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
  ret = {
    ...msg,
    ...ret
  }

  debug('->', ret);
  return ret;

  function integration(name: string) {
    return !!(
      includes(list, name) ||
      name.toLowerCase() === 'all' ||
      includes(lower, name.toLowerCase())
    );
  }
}
