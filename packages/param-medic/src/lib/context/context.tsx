import { createContext } from 'react';

type ParamContextType = {
  paramKeys: string[];
  deleteKey: (key: string) => void;
  addKey: (key: string) => void;
  isInContext: boolean;
};

export const ParamContext = createContext<ParamContextType>({
  paramKeys: [],
  deleteKey: () => {},
  addKey: () => {},
  isInContext: false,
});
