'use strict';

var mockGlobalAnalytics = {};
global.analytics = mockGlobalAnalytics;
module.exports = mockGlobalAnalytics;
