import { PropsWithChildren, useState } from 'react';
import { ParamContext } from './context';

export const ParamContextProvider = ({
  keys,
  children,
}: PropsWithChildren<{
  keys?: string[];
}>) => {
  const [paramKeys, setParamKeys] = useState<string[]>(keys || []);

  return (
    <ParamContext.Provider value={{ paramKeys, setParamKeys, inContext: true }}>
      {children}
    </ParamContext.Provider>
  );
};
