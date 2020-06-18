const _ = require('lodash')

// things we want to compare between different HARs
const harEntryModel = {
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
  // we don't care about the response
}

// interface harEntryModel {
//   request: {
//     cookies: Array<any>,
//     headers: Array<{name: string, value: string}>
//     httpVersion: string
//     method: string
//     postData: {
//       mimeType: string
//       params: Array<any>
//       text: string
//     },
//     queryString: Array<any>,
//     url: string
//   }
// }

/*
Turns a model into json paths using depth first search
E.g.
{
    a: null
    b: {c: null, d: null}
} => [
    "a",
    "b.c",
    "b.d",
]
*/
function toPaths(model) {
  const paths = []
  function dfs(prefix, m) {
    for (let key of Object.keys(m)) {
      if (m[key] !== null) {
        dfs([...prefix, key], m[key])
      } else {
        paths.push([...prefix, key])
      }
    }
  }
  dfs([], model)
  return paths.map(list => list.join('.'))
}

/*
takes some JSON string and coerce it into []harEntryModel
*/
export function parseHttpArchiveText(har_text) {
  // coerce the HAR json object into the model we defined
  const obj = JSON.parse(har_text)
  let entries = _.get(obj, 'log.entries')
  let paths = toPaths(harEntryModel)
  return entries.map(entry => _.pick(entry, paths)).map(entry => {
    // tracking api payload is a JSON string
    entry.request.postData.text = JSON.parse(entry.request.postData.text)
    return entry
  })
}

// properties that are not explicitly called out are assumed to require deep equal
const tapiComparisonSchema = {
  // these properties only need to exist; their values are not considered when comparing
  exists: [
    'request.postData.text.timestamp',
    'request.postData.text.context.userAgent',
    'request.postData.text.context.library.version',
    'request.postData.text.messageId',
    'request.postData.text.anonymousId',
    'request.postData.text.writeKey',
    'request.postData.text.sentAt'
  ]
}

/*
    isEquivalent compares if objects a and b are equivalent
    interface schema {
        ignored: string[]
        exists: string[]
    }
*/
export function isEquivalent(a, b, schema) {
  schema.ignored = schema.ignored || []
  if (schema.ignored.length > 0) {
    // Remove ignored properties from objects; it does not matter whether they originally existed or not
    for (let key of schema.ignored) {
      _.unset(a, key)
      _.unset(b, key)
    }
  }

  schema.exists = schema.exists || []
  if (schema.exists.length > 0) {
    for (let key of schema.exists) {
      // Overwrite property value with dummy one since we only care if the property exists
      if (_.has(a, key)) _.set(a, key, '')
      if (_.has(b, key)) _.set(b, key, '')
    }
  }
  return _.isEqual(a, b)
}

/*
compareEntries compares two lists of harEntryModel's and 
returns true if they are all equivalent
a: []harEntryModel
b: []harEntryModel
returns bool
 */
export function compareEntries(a, b) {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (!isEquivalent(a[i], b[i], tapiComparisonSchema)) return false
  }
  return true
}
