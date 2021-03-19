import { PageDefaults } from './types';
import includes from 'lodash.includes'
import canonical from '@segment/canonical'
import url from 'component-url'

/**
 * Return a default `options.context.page` object.
 *
 * https://segment.com/docs/spec/page/#properties
 */

function pageDefaults(): PageDefaults {
  return {
    path: canonicalPath(),
    referrer: document.referrer,
    search: location.search,
    title: document.title,
    url: canonicalUrl(location.search)
  };
}

/**
 * Return the canonical path for the page.
 */

function canonicalPath(): string {
  const canon = canonical();
  if (!canon) return window.location.pathname;
  const parsed = url.parse(canon);
  return parsed.pathname;
}

/**
 * Return the canonical URL for the page concat the given `search`
 * and strip the hash.
 */

function canonicalUrl(search: string): string {
  const canon = canonical();
  if (canon) return includes(canon, '?') ? canon : canon + search;
  const url = window.location.href;
  const i = url.indexOf('#');
  return i === -1 ? url : url.slice(0, i);
}

/*
 * Exports.
 */

module.exports = pageDefaults;
