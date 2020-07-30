import { SegmentAnalytics } from './index.d';

declare global {
  namespace NodeJS {
    interface Global {
      analytics: SegmentAnalytics.AnalyticsJS;
    }
  }
  interface Window {
    analytics: SegmentAnalytics.AnalyticsJS;
    jQuery: any;
    Zepto: any;
  }
}

export {};
