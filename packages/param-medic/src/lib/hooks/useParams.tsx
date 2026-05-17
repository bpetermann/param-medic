import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParamContext } from '../context/context';
import { NavigationAdapter, browserAdapter } from '../utils/navigation';
import {
  convertParams,
  isKeyAllowed,
  parseSearchParams,
} from '../utils/params';

/**
 * Custom hook to manage URL search parameters as state.
 * @template T The shape of the parameters object.
 * @param {T} [initialState] Optional initial state for parameters.
 * @param {NavigationAdapter} [nav] Navigation adapter (defaults to browser history).
 * @returns
 * - `params`: The current parameters object.
 * - `setParams`: Function to update parameters.
 * - `resetParams`: Function to reset parameters to their initial state.
 */
export function useParams<T extends Record<string, unknown>>(
  initialState?: T,
  nav: NavigationAdapter = browserAdapter
): [
  params: T,
  setParams: (setFn: (prev: T) => T, options?: { replace?: boolean }) => void,
  resetParams: () => void
] {
  const { paramKeys, isInContext } = useParamContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableInitialState = useMemo(() => initialState || ({} as T), []);

  const [searchParams, setSearchParamsState] = useState<T>(() =>
    Object.assign(
      {},
      stableInitialState,
      parseSearchParams(new URLSearchParams(nav.getSearch()), isInContext, paramKeys)
    )
  );

  useEffect(() => {
    return nav.listen(() => {
      setSearchParamsState(
        parseSearchParams(
          new URLSearchParams(nav.getSearch()),
          isInContext,
          paramKeys
        ) as T
      );
    });
  }, [nav, isInContext, paramKeys]);

  const setSearchParams = useCallback(
    (setFn: (prev: T) => T, options?: { replace?: boolean }) => {
      const newParams = setFn(searchParams);
      if (JSON.stringify(newParams) === JSON.stringify(searchParams)) return;

      const filteredParams: T = isInContext
        ? (Object.fromEntries(
            Object.entries(newParams).filter(([key]) =>
              isKeyAllowed(key, paramKeys)
            )
          ) as T)
        : newParams;

      const qs = convertParams(filteredParams, paramKeys).toString();

      if (options?.replace) {
        nav.replace(qs);
      } else {
        nav.push(qs);
      }

      setSearchParamsState(filteredParams);
    },
    [searchParams, paramKeys, isInContext, nav]
  );

  const resetParams = useCallback(() => {
    setSearchParamsState(initialState ?? ({} as T));
    const qs = convertParams(initialState ?? {}, paramKeys).toString();
    nav.replace(qs);
  }, [initialState, paramKeys, nav]);

  return [searchParams, setSearchParams, resetParams];
}
