export interface NavigationAdapter {
  getSearch(): string;
  push(qs: string): void;
  replace(qs: string): void;
  listen(fn: () => void): () => void;
}

export const browserAdapter: NavigationAdapter = {
  getSearch: () => (typeof window !== 'undefined' ? window.location.search : ''),
  push: (qs) => {
    if (typeof window !== 'undefined')
      window.history.pushState({}, '', `?${qs}`);
  },
  replace: (qs) => {
    if (typeof window !== 'undefined')
      window.history.replaceState({}, '', `?${qs}`);
  },
  listen: (fn) => {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('popstate', fn);
    return () => window.removeEventListener('popstate', fn);
  },
};
