'use strict';
var type = require('component-type');
/**
 * Deeply clone an object.
 *
 * @param {*} obj Any object.
 *
 * COPYRIGHT: https://github.com/ndhoule/clone/blob/master/LICENSE.md
 * The MIT License (MIT)
 * Copyright (c) 2015 Nathan Houle
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var clone = function clone(obj) {
    var t = type(obj);
    var copy;
    if (t === 'object') {
        copy = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = clone(obj[key]);
            }
        }
        return copy;
    }
    if (t === 'array') {
        copy = new Array(obj.length);
        for (var i = 0, l = obj.length; i < l; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (t === 'regexp') {
        // from millermedeiros/amd-utils - MIT
        var flags = '';
        flags += obj.multiline ? 'm' : '';
        flags += obj.global ? 'g' : '';
        flags += obj.ignoreCase ? 'i' : '';
        return new RegExp(obj.source, flags);
    }
    if (t === 'date') {
        return new Date(obj.getTime());
    }
    // string, number, boolean, etc.
    return obj;
};
module.exports = clone;
