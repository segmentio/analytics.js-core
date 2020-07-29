export namespace SegmentAnalytics {
  export interface SegmentOpts {
    integrations?: any;
    anonymousId?: string;
    context?: object;
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

  export interface SegmentIntegration {
    All?: boolean;
    [integration: string]: boolean | undefined;
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

  export interface AnalyticsJS {
    Integrations: { [name: string]: unknown };
    require: any;
    VERSION: any;

    /**
     * Use a `plugin`.
     */
    use(plugin: (analytics: AnalyticsJS) => void): AnalyticsJS;

    /**
     * Define a new `Integration`.
     */
    addIntegration(Integration: (options: SegmentOpts) => void): AnalyticsJS;

    /**
     * Define a new `SourceMiddleware`
     */
    addSourceMiddleware(middleware: Function): AnalyticsJS;

    /**
     * Define a new `IntegrationMiddleware`
     * @deprecated Use addDestinationMiddleware instead
     */
    addIntegrationMiddleware(middleware: Function): AnalyticsJS;

    /**
     * Define a new `DestinationMiddleware`
     * Destination Middleware is chained after integration middleware
     */
    addDestinationMiddleware(
      integrationName: string,
      middlewares: Array<unknown>
    ): AnalyticsJS;

    /**
     * Initialize with the given integration `settings` and `options`.
     *
     * Aliased to `init` for convenience.
     */
    initialize(
      settings?: IntegrationsSettings,
      options?: InitOptions
    ): AnalyticsJS;

    /**
     * Initialize with the given integration `settings` and `options`.
     *
     * Aliased to `init` for convenience.
     */
    init(settings?: IntegrationsSettings, options?: InitOptions): AnalyticsJS;

    /**
     * Set the user's `id`.
     */
    setAnonymousId(id: string): AnalyticsJS;

    /**
     * Add an integration.
     */
    add(integration: { name: string | number }): AnalyticsJS;

    /**
     * Identify a user by optional `id` and `traits`.
     */
    identify(
      id: string,
      traits: unknown,
      options: SegmentOpts,
      fn: Function | SegmentOpts
    ): AnalyticsJS;

    /**
     * Return the current user.
     */
    user(): object;

    /**
     * Identify a group by optional `id` and `traits`. Or, if no arguments are
     * supplied, return the current group.
     */
    group(
      id: string,
      traits: unknown,
      options: unknown,
      fn: unknown
    ): AnalyticsJS;

    /**
     * Track an `event` that a user has triggered with optional `properties`.
     */
    track(
      event: string,
      properties: unknown,
      options: unknown,
      fn: unknown
    ): AnalyticsJS;

    /**
     * Helper method to track an outbound link that would normally navigate away
     * from the page before the analytics calls were sent.
     *
     * BACKWARDS COMPATIBILITY: aliased to `trackClick`.
     */
    trackClick(
      links: Element | Array<unknown>,
      event: any,
      properties?: any
    ): AnalyticsJS;

    /**
     * Helper method to track an outbound link that would normally navigate away
     * from the page before the analytics calls were sent.
     *
     * BACKWARDS COMPATIBILITY: aliased to `trackClick`.
     */
    trackLink(
      links: Element | Array<unknown>,
      event: any,
      properties?: any
    ): AnalyticsJS;

    /**
     * Set the user's `id`.
     */
    setAnonymousId(id: string): AnalyticsJS;

    /**
     * Helper method to track an outbound form that would normally navigate away
     * from the page before the analytics calls were sent.
     *
     * BACKWARDS COMPATIBILITY: aliased to `trackSubmit`.
     */
    trackSubmit(
      forms: Element | Array<unknown>,
      event: any,
      properties?: any
    ): AnalyticsJS;

    /**
     * Helper method to track an outbound form that would normally navigate away
     * from the page before the analytics calls were sent.
     *
     * BACKWARDS COMPATIBILITY: aliased to `trackSubmit`.
     */
    trackForm(
      forms: Element | Array<unknown>,
      event: any,
      properties?: any
    ): AnalyticsJS;

    /**
     * Trigger a pageview, labeling the current page with an optional `category`,
     * `name` and `properties`.
     */
    page(
      category: string,
      name: string,
      properties: any,
      options: any,
      fn: unknown
    ): AnalyticsJS;

    /**
     * Merge two previously unassociated user identities.
     */
    alias(
      to: string,
      from?: string,
      options?: unknown,
      fn?: unknown
    ): AnalyticsJS;

    /**
     * Register a `fn` to be fired when all the analytics services are ready.
     */
    ready(fn: Function): AnalyticsJS;

    /**
     * Set the `timeout` (in milliseconds) used for callbacks.
     */
    timeout(timeout: number): void;

    /**
     * Enable or disable debug.
     */
    debug(str: string | boolean): void;

    /**
     * Reset group and user traits and id's.
     */
    reset(): void;

    /**
     * Normalize the given `msg`.
     */
    normalize(msg: { context: { page }; anonymousId: string }): object;

    /**
     * No conflict support.
     */
    noConflict(): AnalyticsJS;
  }
}

declare var analytics: SegmentAnalytics.AnalyticsJS;

declare module '@segment/analytics.js-core' {
  var analytics: SegmentAnalytics.AnalyticsJS;
  export default analytics;
}
