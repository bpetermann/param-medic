import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParamContext } from '../context/actions';
import {
  convertParams,
  isKeyAllowed,
  parseSearchParams,
} from '../utils/params';

export function useParams<T extends Record<string, unknown>>(
  initialState?: T
): [
  params: T,
  setParams: (setFn: (prev: T) => T, options?: { replace?: boolean }) => void,
  resetParams: () => void
] {
  const { paramKeys, isInContext } = useParamContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableInitialState = useMemo(() => initialState || ({} as T), []);

  const getUrlParams = useMemo(() => {
    if (typeof window === 'undefined') return {} as T;
    return parseSearchParams(
      new URLSearchParams(window.location.search),
      isInContext,
      paramKeys
    );
  }, [isInContext, paramKeys]);

  const [searchParams, setSearchParamsState] = useState<T>(() => {
    return Object.assign({}, stableInitialState, getUrlParams);
  });

  useEffect(() => {
    let isMounted = true;
    const handlePopState = () => {
      if (isMounted) {
        setSearchParamsState(
          parseSearchParams(
            new URLSearchParams(window.location.search),
            isInContext,
            paramKeys
          ) as T
        );
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [stableInitialState, isInContext, paramKeys]);

  const setSearchParams = useCallback(
    (setFn: (prev: T) => T, options?: { replace?: boolean }) => {
      if (typeof window === 'undefined') return;

      const newParams = setFn(searchParams);
      if (JSON.stringify(newParams) === JSON.stringify(searchParams)) return;

      const filteredParams: T = isInContext
        ? (Object.fromEntries(
            Object.entries(newParams).filter(([key]) =>
              isKeyAllowed(key, paramKeys)
            )
          ) as T)
        : newParams;

      const newSearchParams = convertParams(filteredParams, paramKeys);

      if (options?.replace) {
        window.history.replaceState({}, '', `?${newSearchParams.toString()}`);
      } else {
        window.history.pushState({}, '', `?${newSearchParams.toString()}`);
      }

      setSearchParamsState(filteredParams);
    },
    [searchParams, paramKeys, isInContext]
  );

  const resetParams = useCallback(() => {
    if (typeof window === 'undefined') return;

    setSearchParamsState(initialState ?? ({} as T));
    const resetSearchParams = convertParams(initialState ?? {}, paramKeys);

    window.history.replaceState({}, '', `?${resetSearchParams.toString()}`);
  }, [initialState, paramKeys]);

  return [searchParams, setSearchParams, resetParams];
}
