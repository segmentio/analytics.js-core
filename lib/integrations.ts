import axios from 'axios';
import { InitIntegrationsWithSettings, IntegrationConstructor, IntegrationConstructors } from './types';

const SETTINGS_URL = "https://cdn-settings.segment.com/v1/projects"
const BUNDLE_URL = 'https://ajs-next-integrations.s3-us-west-2.amazonaws.com'

/**
 * Loads each enabled integration for a given write key as `<script>` tag and returns a collection of constructors that can be used.
 * Only occurs if the user configures turbo mode.
 * @param {string} writeKey
 * @return {IntegrationConstructors}
 */
export const loadIntegrationsOnDemand = (writeKey: string): IntegrationConstructors => {
  const endpoint = `${SETTINGS_URL}/${writeKey}/settings`
  const constructors: IntegrationConstructors  = {}

  axios.get<InitIntegrationsWithSettings>(endpoint).then(async response => {
    const integrations = response.data

    const promises = Object.keys(integrations).map(async name => {
      const { version } = integrations[name]
      constructors[name] = await loadIntegrationBundle({name, version})
    })

    await Promise.all(promises)
  })

  return constructors
}

/**
 * Load the integration bundle from the system of record and return the constructor that analytics.js-core can use to initialize the integration
 * @param {string} name - The name of the integration we want to load
 * @param {string }version - The version of the integration we want to load. Defaults to `latest`.
 * @return {Promise}
 */
async function loadIntegrationBundle({ name, version = "latest" }: { name: string, version: string }): Promise<IntegrationConstructor> {
  const bundleName = name.toLowerCase()
  const url = `${BUNDLE_URL}/${bundleName}/${version}/bundle.js`
  try {
    await loadScript(url)
  } catch (e) {
    return
  }

   return window[`${name}Integration`]
}

/**
 * Loads a script into the DOM, prepending it before all scripts in <head>.
 * @param {string} src - The path to the script
 * @return {Promise}
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s: HTMLScriptElement = window.document.createElement('script')
    let r = false
    s.type = 'text/javascript'
    s.src = src
    s.async = true
    s.onerror = (err): void => {
      reject(err)
    }

    s.onload = () => {
      if (!r && (!this.readyState || this.readyState === 'complete')) {
        r = true
        resolve()
      }
    }
    const t = window.document.getElementsByTagName('script')[0]
    t.parentElement?.insertBefore(s, t)
  })
}