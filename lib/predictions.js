/**
 * Module Dependencies.
 */

// var debug = require('debug')('analytics.js:predictions');

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
  var IND_1 = ['Software', 'Diversified Financial Services', 'Hotels,  Restaurants & Leisure', 'Education Services', 'Food Products', 'Commercial Services & Supplies'];
  var SECT_1 = ['Consumer Discretionary'];
  var IND_2 = ['Software', 'Diversified Financial Services', 'Commercial Services & Supplies'];

  var predictions = {
    mk_customer_fit: undefined
  };

  if (
    traits.employees >= 180 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      IND_1.indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
      || SECT_1.indexOf(traits.sector) > -1 && traits.sector !== null && typeof traits.sector !== 'undefined'
    )
    && (
      traits.alexaGlobalRank > 1944 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && traits.alexaGlobalRank <= 19131 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
    )
  ) {
    predictions.mk_customer_fit = 'very good';
  }

  if (
      traits.employees > 55 && traits.employees !== null && typeof traits.employees !== 'undefined'
      && IND_2.indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
      && traits.raised >= 3.785E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
  ) {
    predictions.mk_customer_fit = 'very good';
  }

  return predictions;
}

