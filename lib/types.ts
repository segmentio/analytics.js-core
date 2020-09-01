export interface SegmentAnalytics {
  Integrations: { [name: string]: unknown };
  options: InitOptions;
  require: any
  VERSION: any
}

export interface IntegrationsSettings {
  // TODO remove `any`
  [key: string]: any;
}

export interface CookieOptions {
  maxage?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
}

export interface MetricsOptions {
  host?: string;
  sampleRate?: number;
  flushTimer?: number;
  maxQueueSize?: number;
}

interface StoreOptions {
  enabled?: boolean;
}

export interface UserOptions {
  cookie?: {
    key: string;
    oldKey: string;
  };
  localStorage?: {
    key: string;
  };
  persist?: boolean;
}

export interface GroupOptions {
  cookie?: {
    key: string;
  };
  localStorage?: {
    key: string;
  };
  persist?: boolean;
}

export interface InitOptions {
  initialPageview?: boolean;
  cookie?: CookieOptions;
  metrics?: MetricsOptions;
  localStorage?: StoreOptions;
  user?: UserOptions;
  group?: GroupOptions;
  integrations?: SegmentIntegration;
}

export interface SegmentIntegration {
  All?: boolean;
  [integration: string]: boolean | undefined;
}

export interface SegmentOpts {
  integrations?: any;
  anonymousId?: string;
  context?: object;
}

export interface Message {
  options?: unknown;
  integrations?: { [key: string]: string };
  providers?: { [key: string]: string | boolean };
  context?: unknown;
  messageId?: string;
}

export interface PageDefaults {
  path: string;
  referrer: string;
  search: string;
  title: string;
  url: string;
}
