import { PropsWithChildren, useState } from 'react';
import { KeyConfig, ParamContext } from './context';

const getKeyName = (key: string | KeyConfig) =>
  typeof key === 'string' ? key : key.name;

export const ParamContextProvider = ({
  keys = [],
  children,
}: PropsWithChildren<{
  keys: (string | KeyConfig)[];
}>) => {
  const [paramKeys, setParamKeys] = useState<(string | KeyConfig)[]>(keys);

  const deleteKey = (key: string) =>
    setParamKeys((prev) => prev.filter((value) => getKeyName(value) !== key));

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
