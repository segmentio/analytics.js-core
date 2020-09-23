
import { Integration, IntegrationConstructor, IntegrationSettings } from './types';

const BASE_URL = "https://cdn-settings.segment.com/v1/projects"

/**
 * Loads all the enabled integrations for a given write key and only adds that respective ajs-integrations package to the current ajs bundle.
 * Only occurs if the user configures turbo mode.
 * @param writeKey
 */
export const loadIntegrationsOnDemand = (writeKey: string) => {
}


/**
 * Loads a integration based on provided settings.  Assumes all ajs-integrations are included as part of the current ajs bundle.
 * Current behavior in production.
 */
export function loadIntegration(constructor: IntegrationConstructor, settings: IntegrationSettings): Integration {
}

