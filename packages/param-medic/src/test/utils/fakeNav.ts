import { NavigationAdapter } from '../../lib/utils/navigation';

export type FakeNav = NavigationAdapter & {
  readonly search: string;
  back(): void;
  firePopState(): void;
};

export const createFakeNav = (initialSearch = ''): FakeNav => {
  const history: string[] = [initialSearch];
  let cursor = 0;
  const listeners = new Set<() => void>();

  const fire = () => listeners.forEach((fn) => fn());

  return {
    get search() {
      return history[cursor];
    },
    getSearch: () => history[cursor],
    push: (qs) => {
      history.splice(cursor + 1);
      history.push(`?${qs}`);
      cursor++;
    },
    replace: (qs) => {
      history[cursor] = `?${qs}`;
    },
    listen: (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    back: () => {
      if (cursor > 0) {
        cursor--;
        fire();
      }
    },
    firePopState: fire,
  };
};
