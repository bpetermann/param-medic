import { PropsWithChildren, useState } from 'react';
import { ParamContext } from './context';

export const ParamContextProvider = ({
  keys,
  children,
}: PropsWithChildren<{
  keys?: string[];
}>) => {
  const [paramKeys, setParamKeys] = useState<string[]>(keys || []);

  const deleteKey = (key: string) =>
    setParamKeys((prev) => prev.filter((value) => value !== key));

  const addKey = (key: string) =>
    setParamKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));

  return (
    <ParamContext.Provider
      value={{ paramKeys, deleteKey, addKey, isInContext: true }}
    >
      {children}
    </ParamContext.Provider>
  );
};
