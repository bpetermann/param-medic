import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParamContext } from './context/actions';
import { convertParams, parse } from './utils';

export function useParams<T extends Record<string, unknown>>(
  initialState?: T
): [
  params: T,
  setParams: (setFn: (prev: T) => T, options?: { replace?: boolean }) => void
] {
  const { paramKeys, isInContext } = useParamContext();

  const getUrlParams = useMemo(() => {
    if (typeof window === 'undefined') return {} as T;
    return Object.fromEntries(
      [...new URLSearchParams(window.location.search).entries()]
        .filter(([key]) => !isInContext || paramKeys.includes(key))
        .map(([key, value]) => [key, parse(value)])
    ) as T;
  }, [isInContext, paramKeys]);

  const [searchParams, setSearchParamsState] = useState<T>(() => {
    return Object.assign({}, initialState, getUrlParams);
  });

  useEffect(() => {
    let isMounted = true;
    const handlePopState = () => {
      if (isMounted) {
        setSearchParamsState(getUrlParams);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [getUrlParams, paramKeys]);

  const setSearchParams = useCallback(
    (setFn: (prev: T) => T, options?: { replace?: boolean }) => {
      if (typeof window === 'undefined') return;

      const newParams = setFn(searchParams);
      if (JSON.stringify(newParams) === JSON.stringify(searchParams)) return;

      const filteredParams: T = isInContext
        ? (Object.fromEntries(
            Object.entries(newParams).filter(([key]) => paramKeys.includes(key))
          ) as T)
        : newParams;

      const newSearchParams = convertParams(filteredParams);

      if (options?.replace) {
        window.history.replaceState({}, '', `?${newSearchParams.toString()}`);
      } else {
        window.history.pushState({}, '', `?${newSearchParams.toString()}`);
      }

      setSearchParamsState(filteredParams);
    },
    [searchParams, paramKeys, isInContext]
  );

  return [searchParams, setSearchParams];
}
