import { createContext } from 'react';

export interface KeyConfig {
  name: string;
  hide?: boolean;
  secret?: string;
}

type ParamContextType = {
  paramKeys: (KeyConfig | string)[];
  deleteKey: (key: string) => void;
  addKey: (key: string | KeyConfig) => void;
  isInContext: boolean;
};

/**
 * Context for managing URL search parameters dynamically.
 */
export const ParamContext = createContext<ParamContextType>({
  paramKeys: [],
  deleteKey: () => {},
  addKey: () => {},
  isInContext: false,
});
