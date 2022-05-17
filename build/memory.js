'use strict';
/*
 * Module Dependencies.
 */
var bindAll = require('bind-all');
var clone = require('./utils/clone');
/**
 * HOP.
 */
var has = Object.prototype.hasOwnProperty;
/**
 * Expose `Memory`
 */
module.exports = bindAll(new Memory());
/**
 * Initialize `Memory` store
 */
function Memory() {
    this.store = {};
}
/**
 * Set a `key` and `value`.
 */
Memory.prototype.set = function (key, value) {
    this.store[key] = clone(value);
    return true;
};
/**
 * Get a `key`.
 */
Memory.prototype.get = function (key) {
    if (!has.call(this.store, key))
        return;
    return clone(this.store[key]);
};
/**
 * Remove a `key`.
 */
Memory.prototype.remove = function (key) {
    delete this.store[key];
    return true;
};
