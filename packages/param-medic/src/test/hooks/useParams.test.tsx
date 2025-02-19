import '@testing-library/jest-dom';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { useParams } from '../../lib/useParams';
import { fireEvent, screen } from '../utils';
import { renderHookComponent } from '../utils/renderHookComponent';

const originalLocation = window.location;

const defineWindow = (param: { [k: string]: unknown }) =>
  Object.defineProperty(window, 'location', {
    value: {
      search: `?${Object.entries(param)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`,
    },
    writable: true,
  });

afterEach(() => {
  window.location = originalLocation;
});

describe('useParamsHook', () => {
  it('should display the correct param value', () => {
    defineWindow({ count: 2 });

    renderHookComponent(
      () => useParams<{ count: number }>(),
      ([params]) => <div>{params.count}</div>,
      { keys: ['count'] }
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should display the correct initial value', () => {
    defineWindow({});

    renderHookComponent(
      () => useParams<{ count: number }>({ count: 2 }),
      ([params]) => <div>{params.count}</div>,
      { keys: ['count'] }
    );

    expect(screen.queryByText('2')).toBeInTheDocument();
  });

  it('should display the correct value from a long url', () => {
    defineWindow({ foo: 'bar', baz: true, count: 2 });

    renderHookComponent(
      () => useParams<{ count: number }>(),
      ([params]) => <div>{params.count}</div>,
      { keys: ['count'] }
    );

    expect(screen.queryByText('2')).toBeInTheDocument();
  });

  it('should display the correct value after update', () => {
    defineWindow({ count: 0 });

    renderHookComponent(
      () => useParams<{ count: number }>(),
      ([params, setParams]) => (
        <div>
          <button
            onClick={() =>
              setParams((prev) => ({ ...prev, count: prev.count + 1 }), {
                replace: false,
              })
            }
          >
            <span>{params.count}</span>
          </button>
        </div>
      ),
      { keys: ['count'] }
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByText('2')).toBeInTheDocument();
  });

  it('should not display the param value if the key is not defined', () => {
    defineWindow({});

    renderHookComponent(
      () => useParams<{ count: number }>(),
      ([params]) => <div>{params.count}</div>,
      { keys: [] }
    );

    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });
});
