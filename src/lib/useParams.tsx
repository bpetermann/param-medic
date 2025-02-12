import { useCallback } from 'react';

const parse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const convertParams = (params: { [k: string]: unknown }) => {
  const newSearchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) =>
    newSearchParams.set(
      key,
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    )
  );

  return newSearchParams;
};

export function useParams(): [
  searchParams: {
    [k: string]: unknown;
  },
  setSearchParams: (
    setFn: (prev: { [k: string]: unknown }) => {
      [k: string]: unknown;
    },
    options?: { replace?: boolean }
  ) => void
] {
  const searchParams = Object.fromEntries(
    [...new URLSearchParams(window.location.search).entries()].map(
      ([key, value]) => [key, parse(value)]
    )
  );

  const setSearchParams = useCallback(
    (
      setFn: (prev: { [k: string]: unknown }) => {
        [k: string]: unknown;
      },
      options?: { replace?: boolean }
    ) => {
      const newParams = setFn(searchParams);
      const newSearchParams = convertParams(newParams);

      if (options?.replace) {
        window.history.replaceState({}, '', `?${newSearchParams.toString()}`);
      } else {
        window.history.pushState({}, '', `?${newSearchParams.toString()}`);
      }
    },
    [searchParams]
  );

  return [searchParams, setSearchParams];
}
