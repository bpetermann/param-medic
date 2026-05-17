import { describe, expect, it } from 'vitest';
import { KeyConfig } from '../../lib/context/context';
import { decode, encode } from '../../lib/utils/codec';

describe('ParamCodec', () => {
  const keyConfig: KeyConfig = {
    name: 'testKey',
    hide: true,
    secret: 'mySecretKey',
  };

  describe('encode', () => {
    it('returns a string value as-is without config', () => {
      expect(encode('hello')).toBe('hello');
    });

    it('returns an empty string as-is', () => {
      expect(encode('')).toBe('');
    });

    it('serializes a number to a string', () => {
      expect(encode(42)).toBe('42');
    });

    it('serializes a boolean to a string', () => {
      expect(encode(true)).toBe('true');
    });

    it('serializes an object to a JSON string', () => {
      expect(encode({ name: 'Alice' })).toBe(JSON.stringify({ name: 'Alice' }));
    });

    it('serializes an array to a JSON string', () => {
      expect(encode(['a', 'b'])).toBe(JSON.stringify(['a', 'b']));
    });

    it('encrypts a string when config has hide: true', () => {
      const result = encode('secret', keyConfig);
      expect(result).not.toBe('secret');
      expect(decode(result, keyConfig)).toBe('secret');
    });

    it('encrypts an object when config has hide: true', () => {
      const obj = { name: 'Alice', age: 25 };
      const result = encode(obj, keyConfig);
      expect(result).not.toBe(JSON.stringify(obj));
      expect(decode(result, keyConfig)).toEqual(obj);
    });

    it('produces different output for different secrets', () => {
      const c1: KeyConfig = { name: 'k', hide: true, secret: 'key1' };
      const c2: KeyConfig = { name: 'k', hide: true, secret: 'key2' };
      expect(encode('value', c1)).not.toBe(encode('value', c2));
    });

    it('produces different output for different input values', () => {
      expect(encode('hello', keyConfig)).not.toBe(encode('world', keyConfig));
    });

    it('does not encrypt when config has hide: false', () => {
      const plain: KeyConfig = { name: 'k', hide: false };
      expect(encode('hello', plain)).toBe('hello');
    });
  });

  describe('decode', () => {
    it('returns a plain string as-is', () => {
      expect(decode('hello')).toBe('hello');
    });

    it('returns an empty string as-is', () => {
      expect(decode('')).toBe('');
    });

    it('parses a JSON number string to a number', () => {
      expect(decode('42')).toBe(42);
    });

    it('parses a JSON boolean string to a boolean', () => {
      expect(decode('true')).toBe(true);
    });

    it('parses a JSON object string to an object', () => {
      expect(decode(JSON.stringify({ name: 'Alice' }))).toEqual({
        name: 'Alice',
      });
    });

    it('decrypts and parses an encrypted object', () => {
      expect(
        decode(encode({ name: 'Alice', age: 25 }, keyConfig), keyConfig),
      ).toEqual({ name: 'Alice', age: 25 });
    });

    it('decrypts an encrypted plain string', () => {
      expect(decode(encode('secret text', keyConfig), keyConfig)).toBe(
        'secret text',
      );
    });

    it('does not return the original value when given the wrong key', () => {
      const wrong: KeyConfig = { name: 'k', hide: true, secret: 'wrongKey' };
      expect(decode(encode('secret', keyConfig), wrong)).not.toBe('secret');
    });

    it('returns undefined for invalid base64 when a secret is provided', () => {
      expect(decode('not!!valid!!base64', keyConfig)).toBeUndefined();
    });
  });

  describe('round-trip', () => {
    it('encodes and decodes a string without config', () => {
      expect(decode(encode('test value'))).toBe('test value');
    });

    it('encodes and decodes an object without config', () => {
      expect(decode(encode({ x: 1, y: 'two' }))).toEqual({ x: 1, y: 'two' });
    });

    it('encodes and decodes with encryption config', () => {
      const obj = { name: 'Alice', score: 100 };
      expect(decode(encode(obj, keyConfig), keyConfig)).toEqual(obj);
    });
  });
});
