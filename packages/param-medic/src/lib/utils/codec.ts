import { KeyConfig } from '../context/context';
import { decrypt, encrypt } from './encryption';

const parse = (data: string): unknown => {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const encode = (value: unknown, config?: KeyConfig): string => {
  const str = typeof value === 'string' ? value : JSON.stringify(value);
  return config?.secret ? encrypt(str, config.secret) : str;
};

export const decode = (raw: string, config?: KeyConfig): unknown => {
  if (config?.secret) {
    try {
      return parse(decrypt(raw, config.secret));
    } catch {
      return undefined;
    }
  }
  return parse(raw);
};
