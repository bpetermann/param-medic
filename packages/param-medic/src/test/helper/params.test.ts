import { describe, expect, it } from 'vitest';
import { KeyConfig } from '../../lib/context/context';
import { decode } from '../../lib/utils/codec';
import { buildUrlWithParams, convertParams } from '../../lib/utils/params';

describe('buildUrlWithParams', () => {
  it('should return the base URL when no params are provided', () => {
    expect(buildUrlWithParams('/home')).toBe('/home');
  });

  it('should append a single query param', () => {
    expect(buildUrlWithParams('/home', { user: 'Alice' })).toBe(
      '/home?user=Alice'
    );
  });

  it('should append multiple query params', () => {
    expect(buildUrlWithParams('/home', { user: 'Alice', age: 25 })).toBe(
      '/home?user=Alice&age=25'
    );
  });

  it('should encode special characters', () => {
    expect(buildUrlWithParams('/search', { query: 'hello world!' })).toBe(
      '/search?query=hello%20world!'
    );
  });

  it('should convert object values to JSON strings', () => {
    expect(buildUrlWithParams('/data', { info: { key: 'value' } })).toBe(
      '/data?info=%7B%22key%22%3A%22value%22%7D'
    );
  });

  it('should handle numeric values correctly', () => {
    expect(buildUrlWithParams('/profile', { age: 30 })).toBe('/profile?age=30');
  });

  it('should handle boolean values correctly', () => {
    expect(buildUrlWithParams('/settings', { darkMode: true })).toBe(
      '/settings?darkMode=true'
    );
  });

  it('should handle arrays correctly', () => {
    expect(buildUrlWithParams('/list', { items: ['apple', 'banana'] })).toBe(
      '/list?items=%5B%22apple%22%2C%22banana%22%5D'
    );
  });

  it('should handle an existing query in the URL', () => {
    expect(buildUrlWithParams('/home?loggedIn=true', { user: 'Alice' })).toBe(
      '/home?loggedIn=true&user=Alice'
    );
  });

  it('should return only the base URL if params object is empty', () => {
    expect(buildUrlWithParams('/home', {})).toBe('/home');
  });

  describe('with keys config', () => {
    const keyConfig: KeyConfig = { name: 'token', hide: true, secret: 'secret' };

    it('encrypts a value when the matching key has hide: true', () => {
      const url = buildUrlWithParams('/app', { token: 'abc123' }, [keyConfig]);
      const raw = new URLSearchParams(url.split('?')[1]).get('token')!;
      expect(raw).not.toBe('abc123');
      expect(decode(raw, keyConfig)).toBe('abc123');
    });

    it('produces the same encrypted value as the hook would write', () => {
      const url = buildUrlWithParams('/app', { token: 'abc123' }, [keyConfig]);
      const hookParams = convertParams({ token: 'abc123' }, [keyConfig]);
      const fromBuild = new URLSearchParams(url.split('?')[1]).get('token');
      const fromHook = hookParams.get('token');
      expect(fromBuild).toBe(fromHook);
    });

    it('leaves plain keys unencrypted when keys config is provided', () => {
      const url = buildUrlWithParams('/app', { page: 2 }, [keyConfig]);
      expect(url).toBe('/app?page=2');
    });
  });
});
