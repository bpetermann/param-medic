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
