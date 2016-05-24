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


function intersect(a, b) {
  var t;
  if (b.length > a.length) {
    t = b;
    b = a;
    a = t;
  } // indexOf to loop over shorter
  return a.filter(function(e) {
    if (b.indexOf(e) !== -1) return true;
  });
}


function predictive(traits) {
  var predictions = {
      mk_customer_fit: undefined
    };
  try {
    var IND = ['Internet Software & Services', 'Media', 'Diversified Financial Services', 'Hotels, Restaurants & Leisure', 'Professional Services', 'Textiles, Apparel & Luxury Goods', 'Commercial Services & Supplies', 'Capital Markets', 'Food Products', 'Education Services', 'Health Care Providers & Services', 'Real Estate', 'Wireless Telecommunication Services', 'Transportation', 'Leisure Products', 'Software', 'Pharmaceuticals', 'Automotive', 'Diversified Telecommunication Services', 'Air Freight & Logistics', 'Household Durables'];
    var IND_1 = ['Software', 'Diversified Financial Services', 'Hotels,  Restaurants & Leisure', 'Education Services', 'Food Products', 'Commercial Services & Supplies'];
    var SECT_1 = ['Consumer Discretionary'];
    var IND_2 = ['Software', 'Diversified Financial Services', 'Commercial Services & Supplies'];
    var TECH_1 = ['eloqua', 'salesforce', 'omniture', 'marketo', 'pardot', 'totango'];
    var TECH_2 = ['crazy_egg', 'intercom', 'olark'];
    var TECH_3 = ['bing_ads', 'zendesk', 'perfect_audience', 'mixpanel', 'hubspot', 'segment', 'drip', 'marketo', 'pardot', 'totango', 'google_analytics', 'adroll', 'salesforce', 'optimizely', 'crazy-egg'];
    var COUNTR_1 = ['United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'India', 'Netherlands', 'New Zealand', 'Germany', 'Brazil', 'Singapore', 'Sweden', 'Denmark'];
    var COUNTR_2 = ['United Kingdom', 'Canada', 'France', 'Netherlands', 'Germany', 'Sweden', 'Denmark', 'Norway', 'Ireland', 'Span'];

    traits.tech = typeof traits.tech !== 'undefined' && traits.tech instanceof Array ? traits.tech : [];
    if (
      traits.employees != null && traits.employees !== null && typeof traits.employees !== 'undefined'
      || traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      || traits.industry != null && typeof traits.industry !== 'undefined'
      || traits.raised != null && typeof traits.raised !== 'undefined'
    ) {
      predictions.mk_customer_fit = 'not enough information';
    }
    if (
      traits.employees != null && traits.employees !== null && typeof traits.employees !== 'undefined'
    ) {
      predictions.mk_customer_fit = 'low';
    }
    if (
      traits.employees != null && traits.employees !== null && typeof traits.employees !== 'undefined'
      && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && traits.industry != null && typeof traits.industry !== 'undefined'
      && traits.raised != null && typeof traits.raised !== 'undefined'
    ) {
      predictions.mk_customer_fit = 'low';
    }
    if (
    traits.employees <= 45 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.googleRank <= 5 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
    )
    && (IND.slice(0, 17).indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
      && traits.country === null && typeof traits.country === 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'low'; // l_class_opp_01
    }
    if (
    traits.employees <= 45 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.googleRank <= 3 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
    )
    && (traits.alexaGlobalRank <= 422785 && traits.alexaGlobalRank !== null && typeof traits.alexaGlobalRank !== 'undefined'
      && traits.country !== null && typeof traits.country !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_class_opp_02
    }
    if (
    traits.employees <= 45 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.marketCap > 2.39E9 && traits.marketCap !== null && typeof traits.marketCap !== 'undefined'
      || traits.marketCap === null && typeof traits.marketCap === 'undefined'
    )
    && (traits.alexaGlobalRank > 422785 && traits.alexaGlobalRank !== null && typeof traits.alexaGlobalRank !== 'undefined'
      && traits.country !== null && typeof traits.country !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_class_opp_03
    }
    if (
    traits.employees > 45 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised <= 1.2E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
    )
    && (traits.marketCap <= 5.1284E8 && traits.marketCap !== null && typeof traits.marketCap !== 'undefined'
      && intersect(traits.tech, TECH_3).length >= 3 && traits.tech !== null && typeof traits.tech !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_class_opp_04
    }
    if (
    traits.employees > 45 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised > 1.2E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
    )
    && (IND.indexOf(traits.industry) >= -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
      && traits.googleRank <= 10 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_class_opp_05
    }
    if (
    traits.employees > 45 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised > 1.2E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
    )
    && (IND.indexOf(traits.industry) === -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'low'; // l_class_opp_06
    }
    if (
      traits.employees <= 55 && traits.employees !== null && typeof traits.employees !== 'undefined'
      && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && traits.industry != null && typeof traits.industry !== 'undefined'
      && traits.raised != null && typeof traits.raised !== 'undefined'
    ) {
      predictions.mk_customer_fit = 'low'; // l_class_mrr_01_backconv
    }
    if (
    traits.employees > 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (intersect(traits.tech, TECH_3).length >= 3 && traits.tech !== null && typeof traits.tech !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_mk_01
    }
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
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_02_backconv
    }
    if (
      traits.employees > 55 && traits.employees !== null && typeof traits.employees !== 'undefined'
      && IND_2.indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
      && traits.raised >= 3.785E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
    ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_03_backconv
    }
    if (
    ['United States'].indexOf(traits.country) !== -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.raised >= 3E6 && traits.raised !== null && typeof traits.raised !== 'undefined'
      && traits.employees > 30 && traits.employees !== null && typeof traits.employees !== 'undefined'
      && traits.raised < 5E6 && traits.raised !== null && typeof traits.raised !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_01
    }
    if (
    ['United States'].indexOf(traits.country) !== -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.raised >= 1E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
      && traits.employees > 10 && traits.employees !== null && typeof traits.employees !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_02
    }
    if (
    ['United States'].indexOf(traits.country) !== -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.raised >= 5E6 && traits.raised !== null && typeof traits.raised !== 'undefined'
      && traits.employees > 25 && traits.employees !== null && typeof traits.employees !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_03
    }
    if (
    ['United States'].indexOf(traits.country) !== -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.type === 'public' && traits.type !== null && typeof traits.type !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_04
    }
    if (
    ['United States'].indexOf(traits.country) !== -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.raised === null && typeof traits.raised === 'undefined'
      && traits.employees > 50 && traits.employees !== null && typeof traits.employees !== 'undefined'
    )
    && (traits.alexaGlobalRank < 1E5 && traits.alexaGlobalRank !== null && typeof traits.alexaGlobalRank !== 'undefined'// || intersect(traits.tech, TECH_3).length >= 3 && traits.tech !== null && typeof traits.tech !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_05
    }
    if (
    COUNTR_2.indexOf(traits.country) > -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.raised >= 1E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
      && traits.employees > 20 && traits.employees !== null && typeof traits.employees !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_06
    }
    if (
    COUNTR_2.indexOf(traits.country) > -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.raised >= 5E6 && traits.raised !== null && typeof traits.raised !== 'undefined'
      && traits.employees > 35 && traits.employees !== null && typeof traits.employees !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_07
    }
    if (
    COUNTR_2.indexOf(traits.country) > -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.raised < 5E6 && traits.raised !== null && typeof traits.raised !== 'undefined'
      && traits.employees > 40 && traits.employees !== null && typeof traits.employees !== 'undefined'
      && traits.raised >= 3E6 && traits.raised !== null && typeof traits.raised !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_08
    }
    if (
    COUNTR_2.indexOf(traits.country) > -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.type === 'public' && traits.type !== null && typeof traits.type !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_09
    }
    if (
    COUNTR_2.indexOf(traits.country) !== -1 && traits.country !== null && typeof traits.country !== 'undefined'
    && (
      traits.industry !== 'Professional Services' && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
    && (traits.raised === null && typeof traits.raised === 'undefined'
      && traits.employees > 50 && traits.employees !== null && typeof traits.employees !== 'undefined'
    )
    && (traits.alexaGlobalRank < 1E5 && traits.alexaGlobalRank !== null && typeof traits.alexaGlobalRank !== 'undefined'
      || intersect(traits.tech, TECH_3).length >= 3 && traits.tech !== null && typeof traits.tech !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_rule_sdr_10
    }
    if (
    traits.employees <= 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised <= 2.1E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
    )
    && (traits.googleRank <= 4 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
    )
    && (intersect(traits.tech, TECH_1).length > 0 && traits.tech !== null && typeof traits.tech !== 'undefined'
      && traits.alexaGlobalRank <= 105967 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_class_mrr_01
    }
    if (
    traits.employees <= 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised || 0 <= 2.1E7
    )
    && (traits.googleRank <= 4 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
    )
    && (intersect(traits.tech, TECH_1).length === 0 && traits.tech !== null && typeof traits.tech !== 'undefined'
      && traits.alexaGlobalRank > 1206671 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && traits.employees >= 45 && traits.employees !== null && typeof traits.employees !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_02
    }
    if (
    traits.employees <= 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised || 0 <= 2.1E7
    )
    && (traits.googleRank > 4 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
    )
    && (IND.slice(0, 9).indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
      && traits.alexaGlobalRank <= 3251 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && traits.employees > 60 && traits.employees !== null && typeof traits.employees !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_03
    }
    if (
    traits.employees <= 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised || 0 <= 2.1E7
    )
    && (traits.googleRank > 4 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
    )
    && (IND.slice(10, 12).indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
      && traits.alexaGlobalRank <= 14305 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_class_mrr_04
    }
    if (
    traits.employees <= 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised || 0 <= 2.1E7
    )
    && (traits.googleRank > 4 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
    )
    && (IND.slice(0, 9).indexOf(traits.industry) === 0 && traits.industry !== null && typeof traits.industry !== 'undefined'
      && traits.alexaGlobalRank > 14305 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && intersect(traits.tech, TECH_1.merge(TECH_2)).length > 0 && traits.tech !== null && typeof traits.tech !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_class_mrr_06
    }
    if (
    traits.employees <= 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised > 2.1E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
    )
    && (COUNTR_1.indexOf(traits.country) > -1 && traits.country !== null && typeof traits.country !== 'undefined'
    )
    && (traits.googleRank <= 6 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
      && traits.marketCap > 0 && traits.marketCap != null && typeof traits.marketCap !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_06
    }
    if (
    traits.employees <= 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised > 2.1E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
    )
    && (COUNTR_1.indexOf(traits.country) > -1 && traits.country !== null && typeof traits.country !== 'undefined'
    )
    && (traits.googleRank > 6 && traits.googleRank !== null && typeof traits.googleRank !== 'undefined'
      && traits.employees < 60 && traits.employees != null && typeof traits.employees !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_07
    }
    if (
    traits.employees <= 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.raised > 2.1E7 && traits.raised !== null && typeof traits.raised !== 'undefined'
    )
    && (COUNTR_1.indexOf(traits.country) === -1 && traits.country !== null && typeof traits.country !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_class_mrr_08
    }
    if (
    traits.employees > 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
     traits.marketCap || 0 <= 5.1284E8
    )
    && (traits.alexaGlobalRank <= 2219 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && traits.country === 'United States' && traits.country !== null && typeof traits.country !== 'undefined'
     && IND.slice(0, 2).indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_09
    }
    if (
    traits.employees > 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.marketCap || 0 <= 5.1284E8
    )
    && (traits.alexaGlobalRank <= 2519 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && ['United States'].indexOf(traits.country) > -1 && traits.country !== null && typeof traits.country !== 'undefined'
      && traits.employees > 700 && traits.employees !== null && typeof traits.employees !== 'undefined'
      && IND.slice(0, 2).indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_10
    }
    if (
    traits.employees > 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.marketCap || 0 <= 5.1284E8
    )
    && (traits.alexaGlobalRank > 2519 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && traits.employees <= 300 && traits.employees !== null && typeof traits.employees !== 'undefined'
      && IND.slice(0, 2).indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_11
    }
    if (
    traits.employees > 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.marketCap || 0 <= 5.1284E8
    )
    && (traits.alexaGlobalRank <= 67147 && traits.alexaGlobalRank != null && typeof traits.alexaGlobalRank !== 'undefined'
      && IND.slice(0, 4).indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_12
    }
    if (
    traits.employees > 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.marketCap || 0 <= 5.1284E8
    )
    && (traits.raised <= 1.05E8 && traits.raised != null && typeof traits.raised !== 'undefined'
      && IND.slice(0, 20).indexOf(traits.industry) > -1 && traits.industry !== null && typeof traits.industry !== 'undefined'
      && ['United States'].indexOf(traits.country) === -1 && traits.country !== null && typeof traits.country !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'good'; // l_class_mrr_13
    }
    if (
    traits.employees > 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.marketCap || 0 <= 5.1284E8
    )
    && (traits.raised > 1.05E8 && traits.raised != null && typeof traits.raised !== 'undefined'
     && intersect(traits.tech, TECH_3).length >= 1 && traits.tech !== null && typeof traits.tech !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_14
    }
    if (
    traits.employees > 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.marketCap > 5.1284E8 && traits.marketCap !== null && typeof traits.marketCap !== 'undefined'
    )
    && (traits.raised || 0 <= 1.05E8
      && traits.employees <= 804 && traits.employees !== null && typeof traits.employees !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_15
    }
    if (
    traits.employees > 200 && traits.employees !== null && typeof traits.employees !== 'undefined'
    && (
      traits.marketCap > 5.1284E8 && traits.marketCap !== null && typeof traits.marketCap !== 'undefined'
    )
    && (traits.raised > 1.05E8 && traits.raised != null && typeof traits.raised !== 'undefined'
      && traits.alexaGlobalRank > 563 && traits.alexaGlobalRank !== null && typeof traits.alexaGlobalRank !== 'undefined'
    )
  ) {
      predictions.mk_customer_fit = 'very good'; // l_class_mrr_16
    }
  } catch (e) {
    predictions = e.toString();
  }

  return predictions;
}

