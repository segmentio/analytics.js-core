import {unset, has, set, isEqual} from 'lodash';

// A .har file contains more properties than defined here; however, these are the properties
// we care about when comparing network requests generated by analytics.js
interface header {
  name: string
  value: string
}
export interface HarEntry {
  request: {
    cookies: Array<{
      name: string
      value: string
      path?: string
      domain?: string
      expires?: string
      httpOnly?: boolean
      secure?: boolean
      comment?: string
    }>,
    headers: Array<header>
    httpVersion: string
    method: string
    postData: {
      mimeType: string
      params: Array<{
        name: string
        value?: string
        fileName?: string
        contentType?: string
        comment?: string
      }>
      text: string // this contains the tracking api payload
    },
    queryString: Array<{
      name: string
      value?: string
      comment?: string
    }>,
    url: string
  }
  // In the .har file, there's a `response` property. We don't care about it since we are only
  // interested in what requests analytics.js are making
}

/*
Returns an object of type T by picking properties from `obj` that are found in `model`,
omitting properties that are not found in `model`.
*/
function pick<T>(model: T, obj: any): T {
  return Object.keys(model).reduce((res, key) => {
    if (!(key in obj)) return res;
    if (model[key] === null) {
      res[key] = obj[key]; 
      return res;
    }
    res[key] = pick(model[key], obj[key]);
    return res;
  }, {} as T)
}

/*
Takes some JSON string and coerce it into a HarEntry[]
*/
export function parseHttpArchiveText(harText: string): HarEntry[] {
  // coerce the HAR json object into the model we defined
  const obj = JSON.parse(harText) as {log: {entries: [any]}}
  let entries = obj.log.entries
  return entries.map(entry => pick({
    request: {
      cookies: null,
      headers: null, // []{name: string, value: string}
      httpVersion: null,
      method: null,
      postData: {
        mimeType: null,
        params: null,
        text: null // this contains the tracking api payload
      },
      queryString: null,
      url: null
    }
  } as HarEntry, entry)).map(entry => {
    // tracking api payload is a JSON string
    entry.request.postData.text = JSON.parse(entry.request.postData.text)
    return entry
  })
}

// properties that are not explicitly called out are assumed to require deep equal
interface compareSchema {
  ignored?: string[]
  exists?: string[]
  custom?: Array<(obj: any) => void>
}

export const trackingAPIComparisonSchema: compareSchema = {
  // these properties only need to exist; their values are not considered when comparing
  exists: [
    'request.postData.text.timestamp',
    'request.postData.text.context.userAgent',
    'request.postData.text.context.library.version',
    'request.postData.text.messageId',
    'request.postData.text.anonymousId',
    'request.postData.text.writeKey',
    'request.postData.text.sentAt',
  ],
  custom: [
    // don't care about value of user-agent header
    (obj: any) => {
      if (has(obj, 'request.headers')){
        obj.request.headers.forEach((header: header) => {
          if (header.name === 'user-agent') header.value = '';
        });
      }
    }
  ]
}

/*
    preprocess an object by stripping out irrelevant properties / masking irrelevant values, 
    so that we can pass it to assert.deepEqual to do equality check.
    For example, we want to ignore the values of random IDs but still ensure an ID exists on both objects.
*/
export function preprocess(a: any, schema: compareSchema): void {
  if (schema.ignored?.length > 0) {
    // Remove ignored properties from objects; it does not matter whether they originally existed or not
    for (let key of schema.ignored) {
      unset(a, key)
    }
  }

  if (schema.exists?.length > 0) {
    for (let key of schema.exists) {
      // Overwrite property value with dummy one since we only care if the property exists
      if (has(a, key)) set(a, key, '')
    }
  }

  if (schema.custom?.length > 0) {
    for (let customFunc of schema.custom) {
      customFunc(a)
    }
  }
  return
}

/*
    preprocessHarEntries reads a HAR file text and masks irrelevant values such as timestamps 
    and user agent so that we can use assert.deepEqual to compare two HAR entries
*/
export function preprocessHarEntries(harText: string): HarEntry[]{
  let entries = parseHttpArchiveText(harText)
  entries.forEach(entry => preprocess(entry, trackingAPIComparisonSchema))
  return entries
}
