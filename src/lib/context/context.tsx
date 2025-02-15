import { createContext } from 'react';

type ParamContextType = {
  paramKeys: string[];
  setParamKeys: React.Dispatch<React.SetStateAction<string[]>>;
  inContext: boolean;
};

export const ParamContext = createContext<ParamContextType>({
  paramKeys: [],
  setParamKeys: () => {},
  inContext: false,
});
