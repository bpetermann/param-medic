export const parse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const convertParams = <T extends Record<string, unknown>>(params: T) => {
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

export const buildUrlWithParams = <T extends Record<string, unknown>>(
  url: string = '/',
  params?: T
): string => {
  if (!params || Object.keys(params).length === 0) return url;

  const paramString = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          typeof value === 'object' ? JSON.stringify(value) : String(value)
        )}`
    )
    .join('&');

  return url.includes('?') ? `${url}&${paramString}` : `${url}?${paramString}`;
};
