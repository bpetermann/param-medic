import React, { ReactNode } from 'react';
import { render } from './index';

export function HookTestComponent<T>({
  hook,
  children,
}: {
  hook: () => T;
  children: (value: T) => ReactNode;
}) {
  const result = hook();
  return <>{children(result)}</>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function renderHookComponent<T>(
  hook: () => T,
  children: (value: T) => ReactNode,
  options?: { keys?: string[] }
) {
  return render(
    <HookTestComponent hook={hook}>{children}</HookTestComponent>,
    options
  );
}
