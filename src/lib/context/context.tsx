import { createContext } from 'react';

type ParamContextType = {
  paramKeys: string[];
  setParamKeys: React.Dispatch<React.SetStateAction<string[]>>;
  isInContext: boolean;
};

export const ParamContext = createContext<ParamContextType>({
  paramKeys: [],
  setParamKeys: () => {},
  isInContext: false,
});
