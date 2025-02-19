import { describe, expect, it } from 'vitest';
import { buildUrlWithParams } from '../../lib/utils';

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
    ); // JSON-encoded array
  });

  it('should handle an existing query in the URL', () => {
    expect(buildUrlWithParams('/home?loggedIn=true', { user: 'Alice' })).toBe(
      '/home?loggedIn=true&user=Alice'
    );
  });

  it('should return only the base URL if params object is empty', () => {
    expect(buildUrlWithParams('/home', {})).toBe('/home');
  });
});
