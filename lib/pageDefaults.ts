import { PageDefaults } from './types';
import includes from 'lodash.includes'
import url from 'component-url'

/**
 * Return the canonical path for the page.
 */

const canonicalPath = (): string => {
  const canon = document.querySelector("link[rel='canonical']")
  if (!canon) return window.location.pathname;
  const href = canon.getAttribute("href")

  const parsed = url.parse(href);
  return parsed.pathname;
}

/**
 * Return the canonical URL for the page concat the given `search`
 * and strip the hash.
 */

const canonicalUrl = (search: string): string => {
  const canon = document.querySelector("link[rel='canonical']")
  if (canon) {
    const href = canon.getAttribute("href")
    return includes(href, '?') ? href : href + search;
  }

  const url = window.location.href;
  const i = url.indexOf('#');
  return i === -1 ? url : url.slice(0, i);
}

/**
 * Return a default `options.context.page` object.
 *
 * https://segment.com/docs/spec/page/#properties
 */

export const pageDefaults = (): PageDefaults => {
  const path = canonicalPath()
  const { referrer, title } = document
  const { search } = location
  const url = canonicalUrl(search)

  return {
    path,
    referrer,
    search,
    title,
    url
  };
}
