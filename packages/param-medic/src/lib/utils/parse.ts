import { KeyConfig } from '../context/context';
import { decrypt, encrypt } from './encryption';
import { isKeyConfig } from './params';

export const parse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const parseWithConfig = (data: string, config?: string | KeyConfig) => {
  if (isKeyConfig(config) && config.secret)
    return parse(decrypt(data, config.secret));

  return parse(data);
};

export const convertParamString = (
  value: unknown,
  config?: string | KeyConfig
): string => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

  return isKeyConfig(config) && config.secret
    ? encrypt(stringValue, config.secret)
    : stringValue;
};
