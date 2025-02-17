import { beforeEach, describe, expect, it } from 'vitest';
import { useParams } from '../lib/useParams';
import { screen } from './utils';
import { renderHookComponent } from './utils/renderHookComponent';

const originalLocation = window.location;

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    value: { search: '?count=2' },
    writable: true,
  });
});

afterEach(() => {
  window.location = originalLocation;
});

describe('useParamsHook', () => {
  it('should display the correct param value', () => {
    renderHookComponent(
      () => useParams<{ count: number }>(),
      ([params]) => <div>{params.count}</div>,
      { keys: ['count'] }
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should not display the param value if the key is not defined', () => {
    renderHookComponent(
      () => useParams<{ count: number }>(),
      ([params]) => <div>{params.count}</div>,
      { keys: [] }
    );

    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });
});
