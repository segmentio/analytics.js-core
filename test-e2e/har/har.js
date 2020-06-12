const fs = require('fs');

const _ = require('lodash');

// things we want to compare between different HARs
const har_entry_model = {
  request: {
    cookies: null,
    headers: null, // []{name: string, value: string}
    httpVersion: null,
    method: null,
    postData: {
      mimeType: null,
      params: null,
      text: null // this contains the tapi payload
    },
    queryString: null,
    url: null
  }
  // we don't care about the response
};

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
  let paths = [];
  function dfs(prefix, m) {
    for (key of Object.keys(m)) {
      if (m[key] !== null) {
        dfs([...prefix, key], m[key]);
      } else {
        paths.push([...prefix, key]);
      }
    }
  }
  dfs([], model);
  return paths.map(list => list.join('.'));
}

/*
takes some JSON string and coerce it into []har_entry_model
*/
function parseHttpArchiveText(har_text) {
  // coerce the HAR json object into the model we defined
  var obj = JSON.parse(har_text);
  entries = _.get(obj, 'log.entries');
  paths = toPaths(har_entry_model);
  return entries.map(entry => _.pick(entry, paths)).map(entry => {
    // tracking api payload is a JSON string
    entry.request.postData.text = JSON.parse(entry.request.postData.text);
    return entry;
  });
}

const tapiComparisonSchema = {
  // TODO: Flesh out schema for comparing context
  // ignored: [
  //     "request.postData.context"
  // ],
  exists: [
    'request.postData.text.timestamp',
    'request.postData.text.context.userAgent',
    'request.postData.text.context.library.version',
    'request.postData.text.messageId',
    'request.postData.text.anonymousId',
    'request.postData.text.writeKey',
    'request.postData.text.sentAt'
  ]
};

/*
    isEquivalent compares if objects a and b are equivalent
    interface schema {
        ignored: string[]
        exists: string[]
    }
*/
function isEquivalent(a, b, schema) {
  schema.ignored = schema.ignored || [];
  if (schema.ignored.length > 0) {
    // Remove ignored properties from objects; it does not matter whether they originally existed or not
    for (key of schema.ignored) {
      _.unset(a, key);
      _.unset(b, key);
    }
  }

  schema.exists = schema.exists || [];
  if (schema.exists.length > 0) {
    for (key of schema.exists) {
      // Overwrite property value with dummy one since we only care if the property exists
      if (_.has(a, key)) _.set(a, key, '');
      if (_.has(b, key)) _.set(b, key, '');
    }
  }
  return _.isEqual(a, b);
}

/*
compareEntries compares two lists of har_entry_model's and 
returns true if they are all equivalent
a: []har_entry_model
b: []har_entry_model
returns bool
 */
function compareEntries(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (!isEquivalent(a[i], b[i], tapiComparisonSchema)) return false;
  }
  return true;
}

module.exports = {
  parseHttpArchiveText,
  isEquivalent,
  tapiComparisonSchema,
  compareEntries
};
