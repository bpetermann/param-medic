import { useCallback, useEffect, useState } from 'react';

const parse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const convertParams = <T extends object>(params: T) => {
  const newSearchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    newSearchParams.set(
      key,
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    );
  });

  return newSearchParams;
};

export function useParams<T extends object>(): [
  searchParams: Partial<T>,
  setSearchParams: (
    setFn: (prev: Partial<T>) => Partial<Pick<T, keyof T>>,
    options?: { replace?: boolean }
  ) => void
] {
  const [searchParams, setSearchParamsState] = useState<Partial<T>>(() => {
    if (typeof window === 'undefined') return {} as T;
    return Object.fromEntries(
      [...new URLSearchParams(window.location.search).entries()].map(
        ([key, value]) => [key, parse(value)]
      )
    ) as T;
  });

  useEffect(() => {
    const handlePopState = () => {
      setSearchParamsState(
        Object.fromEntries(
          [...new URLSearchParams(window.location.search).entries()].map(
            ([key, value]) => [key, parse(value)]
          )
        ) as T
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setSearchParams = useCallback(
    (
      setFn: (prev: Partial<T>) => Partial<Pick<T, keyof T>>,
      options?: { replace?: boolean }
    ) => {
      if (typeof window === 'undefined') return;

      const newParams = setFn(searchParams);
      const newSearchParams = convertParams(newParams);

      if (options?.replace) {
        window.history.replaceState({}, '', `?${newSearchParams.toString()}`);
      } else {
        window.history.pushState({}, '', `?${newSearchParams.toString()}`);
      }

      setSearchParamsState(newParams);
    },
    [searchParams]
  );

  return [searchParams, setSearchParams];
}
