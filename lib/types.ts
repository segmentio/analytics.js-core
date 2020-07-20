export interface SegmentAnalytics {
  Integrations: { [name: string]: unknown };
  options: InitOptions;
  _sourceMiddlewares;
  _integrationMiddlewares;
  _destinationMiddlewares;
  _integrations;
  _readied: boolean;
  _timeout: number;
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
  integrations?: {
    All?: boolean;
    [integration: string]: boolean | undefined;
  };
}

export interface SegmentOpts {
  integrations?: any;
  anonymousId?: string;
  context?: object;
}
