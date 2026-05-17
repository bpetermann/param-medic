import { KeyConfig } from '../context/context';
import { decode, encode } from './codec';

export const getKeyConfig = (key: string, paramKeys: (string | KeyConfig)[]) =>
  paramKeys.find((value) =>
    typeof value === 'string' ? value === key : value.name === key
  );

export const isKeyConfig = (value?: string | KeyConfig): value is KeyConfig =>
  typeof value === 'object' && value !== null;

export const isKeyAllowed = (key: string, paramKeys: (string | KeyConfig)[]) =>
  paramKeys.some(
    (value) => (typeof value === 'string' ? value : value.name) === key
  );

export const convertParams = <T extends Record<string, unknown>>(
  params: T,
  paramKeys: (string | KeyConfig)[]
): URLSearchParams => {
  const newSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    const config = getKeyConfig(key, paramKeys);

    newSearchParams.set(key, encode(value, isKeyConfig(config) ? config : undefined));
  }

  return newSearchParams;
};

export const parseSearchParams = (
  searchParams: URLSearchParams,
  isInContext: boolean,
  paramKeys: (string | KeyConfig)[]
): Record<string, unknown> => {
  return [...searchParams.entries()].reduce((acc, [key, value]) => {
    if (!isInContext || isKeyAllowed(key, paramKeys)) {
      const config = getKeyConfig(key, paramKeys);
      acc[key] = decode(value, isKeyConfig(config) ? config : undefined);
    }
    return acc;
  }, {} as Record<string, unknown>);
};

/**
 * Constructs a URL with query parameters.
 *
 * @template T A record of key-value pairs representing query parameters.
 * @param {string} [url='/'] The base URL.
 * @param {T} [params] The query parameters to append to the URL.
 * @returns {string} The URL with appended query parameters.
 *
 * @example
 * buildUrlWithParams('/api/data', { page: 1, filter: 'active' });
 * // Output: "/api/data?page=1&filter=active"
 */
export const buildUrlWithParams = <T extends Record<string, unknown>>(
  url: string = '/',
  params?: T,
  keys?: (string | KeyConfig)[]
): string => {
  if (!params || Object.keys(params).length === 0) return url;

  const paramString = Object.entries(params)
    .map(([key, value]) => {
      const config = keys ? getKeyConfig(key, keys) : undefined;
      return `${encodeURIComponent(key)}=${encodeURIComponent(encode(value, isKeyConfig(config) ? config : undefined))}`;
    })
    .join('&');

  return url.includes('?') ? `${url}&${paramString}` : `${url}?${paramString}`;
};
