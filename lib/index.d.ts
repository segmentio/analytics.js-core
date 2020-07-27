declare global {
  interface Window {
    jQuery: any;
    Zepto: any;
  }
}

declare namespace SegmentAnalytics {
  interface AnalyticsJS {}
}

declare var analytics: SegmentAnalytics.AnalyticsJS;

declare module '@segment/analytics.js-core' {
  var analytics: SegmentAnalytics.AnalyticsJS;
  export default analytics;
}
