declare global {
  namespace NodeJS {
    interface Global {
      analytics: any;
    }
  }
  interface Window {
    analytics: any;
    jQuery: any;
    Zepto: any;
  }
}

export {};
