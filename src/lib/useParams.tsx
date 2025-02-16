import { useCallback, useEffect, useState } from 'react';
import { useParamContext } from './context/actions';
import { convertParams, parse } from './utils';

export function useParams<T extends Record<string, unknown>>(): [
  searchParams: T,
  setSearchParams: (
    setFn: (prev: T) => T,
    options?: { replace?: boolean }
  ) => void
] {
  const { paramKeys, isInContext } = useParamContext();

  const [searchParams, setSearchParamsState] = useState<T>(() => {
    if (typeof window === 'undefined') return {} as T;
    return Object.fromEntries(
      [...new URLSearchParams(window.location.search).entries()]
        .filter(([key]) => !isInContext || paramKeys.includes(key))
        .map(([key, value]) => [key, parse(value)])
    ) as T;
  });

  useEffect(() => {
    const handlePopState = () => {
      setSearchParamsState(
        Object.fromEntries(
          [...new URLSearchParams(window.location.search).entries()]
            .filter(([key]) => !isInContext || paramKeys.includes(key))
            .map(([key, value]) => [key, parse(value)])
        ) as T
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isInContext, paramKeys]);

  const setSearchParams = useCallback(
    (setFn: (prev: T) => T, options?: { replace?: boolean }) => {
      if (typeof window === 'undefined') return;

      const newParams = setFn(searchParams);

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
