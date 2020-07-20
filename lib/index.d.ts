declare interface Window {
  // TODO Remove use of any and import types for JQuery/Zepto
  jQuery: any;
  Zepto: any;
}

declare namespace SegmentAnalytics {
  interface AnalyticsJS {}
}

declare var analytics: SegmentAnalytics.AnalyticsJS;

declare module '@segment/analytics.js-core' {
  var analytics: SegmentAnalytics.AnalyticsJS;
  export default analytics;
}
