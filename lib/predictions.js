/**
 * Module Dependencies.
 */

var debug = require('debug')('analytics.js:predictions');

/**
 * Expose `predictive`
 */

module.exports = predictive;

/**
 * Normalize `msg` based on integrations `list`.
 *
 * @param {Object} msg
 * @param {Array} list
 * @return {Function}
 */

function predictive(traits) {
  debug(traits);
  return {
    mk_customer_fit: 'very good'
  };
}
