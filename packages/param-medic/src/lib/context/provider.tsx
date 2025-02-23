import { PropsWithChildren, useState } from 'react';
import { getKeyName } from '../utils/parse';
import { KeyConfig, ParamContext } from './context';

/**
 * Provides a context for managing dynamic URL search parameters.
 *
 * @param {(string | KeyConfig)[]} props.keys Initial list of parameter keys.
 * @param {React.ReactNode} props.children Child components.
 *
 * @example
 *
 * // `count` will be visible in the URL, while `form` is encrypted and hidden
 * // Other parameters will be ignored unless explicitly defined in `keys`
 *
 * <ParamContextProvider
 *   keys={['count', { name: 'form', hide: true, secret: 'secret-key' }]}
 * >
 *   <YourComponent />
 * </ParamContextProvider>
 */
export const ParamContextProvider = ({
  keys = [],
  children,
}: PropsWithChildren<{
  keys: (string | KeyConfig)[];
}>) => {
  const [paramKeys, setParamKeys] = useState<(string | KeyConfig)[]>(keys);

  /**
   * Removes a key from the parameter list.
   * @param {string} key - The key to remove.
   */
  const deleteKey = (key: string) =>
    setParamKeys((prev) => prev.filter((value) => getKeyName(value) !== key));

  /**
   * Adds a new key to the parameter list, ensuring no duplicates.
   * @param {string | KeyConfig} key - The key to add.
   */
  const addKey = (key: string | KeyConfig) => {
    const keyExists = paramKeys.some(
      (value) => getKeyName(value) === getKeyName(key)
    );
    if (!keyExists) {
      setParamKeys((prev) => [...prev, key]);
    }
  };
  return (
    <ParamContext.Provider
      value={{ paramKeys, deleteKey, addKey, isInContext: true }}
    >
      {children}
    </ParamContext.Provider>
  );
};
