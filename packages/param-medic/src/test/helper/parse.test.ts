import { KeyConfig } from '../../lib/context/context';
import { decrypt, encrypt } from '../../lib/utils/encryption';
import {
  convertParamString,
  parse,
  parseWithConfig,
} from '../../lib/utils/parse';

describe('Parsing Utility Functions', () => {
  const keyConfig: KeyConfig = { name: 'testKey', secret: 'mySecretKey' };
  const testString = 'Hello, World!';
  const testObject = { name: 'Alice', age: 25 };

  describe('parse function', () => {
    it('should parse a valid JSON string', () => {
      const jsonString = JSON.stringify(testObject);
      expect(parse(jsonString)).toEqual(testObject);
    });

    it('should return a non-JSON string as-is', () => {
      expect(parse(testString)).toBe(testString);
    });

    it('should return a number as-is', () => {
      expect(parse('42')).toBe(42);
    });

    it('should return an empty string when given an empty string', () => {
      expect(parse('')).toBe('');
    });
  });

  describe('parseWithConfig function', () => {
    it('should parse a valid JSON string without encryption', () => {
      const jsonString = JSON.stringify(testObject);
      expect(parseWithConfig(jsonString)).toEqual(testObject);
    });

    it('should return a non-JSON string as-is without encryption', () => {
      expect(parseWithConfig(testString)).toBe(testString);
    });

    it('should decrypt and parse an encrypted JSON string', () => {
      const encrypted = encrypt(JSON.stringify(testObject), keyConfig.secret!);
      expect(parseWithConfig(encrypted, keyConfig)).toEqual(testObject);
    });

    it('should decrypt an encrypted plain string', () => {
      const encrypted = encrypt(testString, keyConfig.secret!);
      expect(parseWithConfig(encrypted, keyConfig)).toBe(testString);
    });

    it('should return incorrectly decrypted values if the wrong key is used', () => {
      const encrypted = encrypt(testString, keyConfig.secret!);
      const decrypted = parseWithConfig(encrypted, {
        name: 'testKey',
        secret: 'wrongKey',
      });
      expect(decrypted).not.toEqual(testString);
    });
  });

  describe('convertParamString function', () => {
    it('should return a string as-is without encryption', () => {
      expect(convertParamString(testString)).toBe(testString);
    });

    it('should convert an object to a string', () => {
      expect(convertParamString(testObject)).toBe(JSON.stringify(testObject));
    });

    it('should encrypt a string when a secret is provided', () => {
      const encrypted = convertParamString(testString, keyConfig);
      expect(encrypted).not.toBe(testString);
      expect(decrypt(encrypted, keyConfig.secret!)).toBe(testString);
    });

    it('should encrypt an object when a secret is provided', () => {
      const encrypted = convertParamString(testObject, keyConfig);
      expect(encrypted).not.toBe(JSON.stringify(testObject));
      expect(JSON.parse(decrypt(encrypted, keyConfig.secret!))).toEqual(
        testObject
      );
    });

    it('should return an empty string when an empty string is passed', () => {
      expect(convertParamString('')).toBe('');
    });
  });
});
