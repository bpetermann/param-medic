import { decrypt, encrypt } from '../../lib/utils/encryption';

describe('Encryption Utility Functions', () => {
  const key = 'mySecretKey';
  const testString = 'Hello, World!';
  const testObject = { name: 'John', age: 30 };

  it('should correctly encrypt and decrypt a string', () => {
    const encrypted = encrypt(testString, key);
    expect(encrypted).not.toEqual(testString);
    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toEqual(testString);
  });

  it('should correctly encrypt and decrypt JSON objects', () => {
    const jsonString = JSON.stringify(testObject);
    const encrypted = encrypt(jsonString, key);
    expect(encrypted).not.toEqual(jsonString);
    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toEqual(jsonString);
    expect(JSON.parse(decrypted)).toEqual(testObject);
  });

  it('should return an empty string when encrypting an empty string', () => {
    const encrypted = encrypt('', key);
    expect(encrypted).toBe('');
    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toBe('');
  });

  it('should return different encryptions for different keys', () => {
    const encrypted1 = encrypt(testString, 'key1');
    const encrypted2 = encrypt(testString, 'key2');
    expect(encrypted1).not.toEqual(encrypted2);
  });

  it('should return different encryptions for different inputs with the same key', () => {
    const encrypted1 = encrypt('Hello', key);
    const encrypted2 = encrypt('World', key);
    expect(encrypted1).not.toEqual(encrypted2);
  });

  it('should fail to decrypt with the wrong key', () => {
    const encrypted = encrypt(testString, key);
    const decrypted = decrypt(encrypted, 'wrongKey');
    expect(decrypted).not.toEqual(testString);
  });
});
