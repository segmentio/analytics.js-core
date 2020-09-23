/**
 * The internal types used in analytics.js-core
 */
import debug from 'debug';
import Emitter from 'component-emitter';

export interface SegmentAnalytics extends Emitter {
  Integrations: IntegrationConstructors;
  options: InitOptions;
  require: NodeJS.Require
  VERSION: string
  initialized: boolean

  // AJS Methods
  page(
    category?: string,
    name?: string,
    properties?: any,
    options?: unknown | { integrations: DataFlowOptions },
    fn?: unknown
  ): SegmentAnalytics;

  /**
   * Adds an initialized integration to the list of enabled integrations.
   * @param integration - An integration that has been created with the repsective `analytics.js-integrations` package.
   * @returns The instance of SegmentAnalytics
   */
  add(integration: Integration): SegmentAnalytics


  /**
   * Toggles debugging with the `debug` package.
   * @param enable - If `false` is provided, debugging will be disabled.  If a `string` is provided, debugging will be enabled for that value under a namespace prefixed with `analytics`.
   */
  debug(enable?: string | boolean): void

  /**
   * A logger provided by `debug`.  Namespaced to `analytics.js`.
   */
  log: debug.Debugger

  /**
   * A collection of integrations that failed to load.
   */
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

/**
 * A set of options that can provided to the `analytics.initialize` method to configure analytics.js.
 */
export interface InitOptions {
  initialPageview?: boolean;
  cookie?: CookieOptions;
  metrics?: MetricsOptions;
  localStorage?: StoreOptions;
  user?: UserOptions;
  group?: GroupOptions;
  integrations?: DataFlowOptions;
  turboMode?: boolean
}

/**
 * A collection of integrations, with settings, that can be provided to the `analytics.initialize` method to load all the integrations at runtime.
 */
export interface InitIntegrationsWithSettings {
  [name: string]: IntegrationSettings
}

/**
 * An object that can be passed as the `options` parameter to various analytics.js methods.
 * Used to control which destinations receive the data. By default, all destinations are enabled.
 * @see You can read more about this feature in the [Analytics.JS Documentation]{@link https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#managing-data-flow-with-the-integrations-object}
 */
export interface DataFlowOptions {
  /**
   * When set to false, disable sending data to all destinations unless they are explicitly listed as true.
   */
  All?: boolean;
  [integration: string]: boolean;
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
 * Type alias for a generic collection of integration constructors that are provided from analytics.js-integrations
 */
export type IntegrationConstructors = {
  [name: string]: IntegrationConstructor
}

/**
 * Type alias for a generic collection of integration settings
 */
export type IntegrationSettings = { [setting: string]: unknown, version?: string }

/**
 * IntegrationSettings specific to the Segment.io Integration
 * TODO: This should live in analytics.js-integrations
 */
export interface SegmentIOIntegrationSettings {
  apiKey: string
}

/**
 * A generic Integration Facade used by every integration in `analytics.js-integrations`.
 * The `options` vary based on the integration itself
 * TODO: This should live in analytics.js-integrations
 */
export interface Integration<T = IntegrationSettings> extends Emitter {
  /**
   * The name of the integration
   */
  name: string,

  /**
   * The integration settings.  Varies based on the integration.
   */
  options: T

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
 * A type alias for the function constructor that analytics.js-integration uses to build integrations
 * TODO: This should live in analytics.js-integrations
 */
export type IntegrationConstructor = { prototype: unknown } & ((settings: IntegrationSettings) => void)
