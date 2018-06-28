'use strict';

var JSON = require('json3');
var zlib = require('browserify-zlib');
var supported = typeof ArrayBuffer !== 'undefined';

/**
 * Callback called when the compression is finished.
 * @callback GzipCallback
 * @param {?Object} error Compression error if any, null otherwise.
 * @param {(Uint8Array | Object)} data Compressed data if any, input data otherwise.
 * @param {Object.<string, string>} headers HTTP headers, contains `'Content-Encoding': 'gzip'` if data is compressed.
 */

/**
 * Compress an object using gzip
 * @param {Object} data Input data to compress
 * @param {GzipCallback} callback Callback to call when done
 */
module.exports.compress = function(data, callback) {
  if (supported) {
    zlib.gzip(JSON.stringify(data), function(err, result) {
      if (err) {
        callback(err, data, {});
      } else {
        callback(null, result, {
          'Content-Encoding': 'gzip'
        });
      }
    });
  } else {
    callback(null, data, {});
  }
};

// Expose supported for tests
module.exports.supported = supported;
