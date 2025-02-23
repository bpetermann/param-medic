import { render } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { KeyConfig } from '../../lib/context/context';
import { ParamContextProvider } from '../../lib/context/provider';

function customRender(
  ui: ReactElement,
  options?: { keys?: (string | KeyConfig)[] }
) {
  return render(
    <ParamContextProvider keys={options?.keys || []}>{ui}</ParamContextProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

export { customRender as render };
