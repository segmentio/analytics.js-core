/**
 * The internal types used in analytics.js-core
 */
import debug from 'debug';
import Emitter from 'component-emitter';

export interface SegmentAnalytics extends Emitter {
  Integrations: { [name: string]:  IntegrationConstructor };
  options: InitOptions;
  require: NodeJS.Require
  VERSION: string
  initialized: boolean

  // AJS Methods
  page(
    category?: string,
    name?: string,
    properties?: any,
    options?: any,
    fn?: unknown
  ): SegmentAnalytics;

  // Public fields and methods
  add(integration: Integration): SegmentAnalytics

  /**
   * A debugger provided by `debug`.  Namespaced to `analytics.js`
   */
  log: debug.Debugger
  failedInitializations: string[]


  // Private fields
  _options: (options: Object) => void
  _sourceMiddlewares:  unknown
  _integrationMiddlewares: unknown
  _destinationMiddlewares: unknown
  _integrations: { [name: string]:  Integration };
  _readied: boolean
  _timeout: number
  _user: unknown
  _parseQuery: (queryString: string) => void
}

export interface InitIntegrationsSettings {
  [name: string]: {
    [setting: string]: unknown
  };
}

export interface CookieOptions {
  maxage?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  sameSite?: string
}

export interface MetricsOptions {
  host?: string;
  sampleRate?: number;
  flushTimer?: number;
  maxQueueSize?: number;
}

export interface StoreOptions {
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

/**
 * A generic Integration Facade used by every integration in `analytics.js-integrations`.
 * The `options` vary based on the integration itself
 */
export interface Integration<Settings = {
  addIntegration?: boolean
  [setting: string]: unknown
}> extends Emitter {
  /**
   * The name of the integration
   */
  name: string,

  /**
   * The integration settings.  Varies based on the integration.
   */
  options: Settings

  /**
   * A logger provided via `debug`.  Namespaced to `analytics:integration` + a slug-ified name
   */
  debug: debug.Debugger

  /**
   * Initializes the integration, triggering a "ready" event with `next-tick`
   */
  initialize: () => void

  /**
   * Emits a "ready" event via `Emitter`
   */
  ready: () => void

  /**
   * A wrapper around a call that noop the first page call if the integration assumes
   * a pageview.
   */
  page: () => void

  /**
   * A reference to Analytics.JS
   */
  analytics: SegmentAnalytics


}

/**
 * A type alias for the object constructor that analytics.js-integration uses to build integrations
 */
type IntegrationConstructor = (this: Integration, options: { [setting: string]: unknown } ) => void

