'use strict';

import { InitOptions } from './types';

/*
 * Module dependencies.
 */

var Entity = require('./entity');
var bindAll = require('bind-all');
var debug = require('debug')('analytics:group');
var inherit = require('inherits');

/**
 * Group defaults
 */

Group.defaults = {
  persist: true,
  cookie: {
    key: 'fp_group_id'
  },
  localStorage: {
    key: 'fp_group_properties'
  }
};

/**
 * Initialize a new `Group` with `options`.
 */

function Group(options?: InitOptions) {
  this.defaults = Group.defaults;
  this.debug = debug;
  Entity.call(this, options);
}

/**
 * Inherit `Entity`
 */

inherit(Group, Entity);

/**
 * Expose the group singleton.
 */

module.exports = bindAll(new Group());

/**
 * Expose the `Group` constructor.
 */

module.exports.Group = Group;
