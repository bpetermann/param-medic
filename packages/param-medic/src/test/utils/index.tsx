import { render as rtlRender } from '@testing-library/react';
import { ReactElement } from 'react';
import { ParamContextProvider } from '../../lib/context/provider';

function customRender(ui: ReactElement, options?: { keys?: string[] }) {
  return rtlRender(
    <ParamContextProvider keys={options?.keys || []}>{ui}</ParamContextProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

export { customRender as render };
