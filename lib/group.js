'use strict';

/*
 * Module dependencies.
 */

import Entity from './entity';
import bindAll from 'bind-all';
var debug = require('debug')('analytics:group');
import inherit from 'inherits';

/**
 * Group defaults
 */

Group.defaults = {
  persist: true,
  cookie: {
    key: 'ajs_group_id'
  },
  localStorage: {
    key: 'ajs_group_properties'
  }
};


/**
 * Initialize a new `Group` with `options`.
 *
 * @param {Object} options
 */

function Group(options) {
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
