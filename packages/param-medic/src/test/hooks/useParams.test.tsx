import '@testing-library/jest-dom';
import React, { act } from 'react';
import { describe, expect, it } from 'vitest';
import { useParams } from '../../lib/hooks/useParams';
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

  it('should correctly reset to default values', () => {
    defineWindow({});

    renderHookComponent(
      () => useParams<{ count: number }>({ count: 1 }),
      ([params, setParams, resetParams]) => (
        <div>
          <button
            data-testid='increase'
            onClick={() =>
              setParams((prev) => ({ ...prev, count: prev.count + 1 }), {
                replace: false,
              })
            }
          >
            <span>{params.count}</span>
          </button>
          <button onClick={resetParams} data-testid='reset' />
        </div>
      ),
      { keys: ['count'] }
    );

    const increase = screen.getByTestId('increase');
    const reset = screen.getByTestId('reset');

    fireEvent.click(increase);
    expect(screen.queryByText('2')).toBeInTheDocument();

    fireEvent.click(reset);
    expect(screen.queryByText('1')).toBeInTheDocument();
  });

  it('should update window history correctly', () => {
    defineWindow({ count: 1 });

    renderHookComponent(
      () => useParams<{ count: number }>({ count: 1 }),
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

    expect(screen.queryByText('2')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.queryByText('1')).toBeInTheDocument();
  });

  it('should convert encrypted window params', () => {
    const expected = 'Alice';
    defineWindow({
      form: 'CEcNEwgRD1FHOB8MABdHWA8OCBgaCUFIRxVBAgYcMwIOEwwYAwgKFFFJQQIEB14cCgsXR1lQVEYeX1BPUkce',
    });

    renderHookComponent(
      () =>
        useParams<{ form: { name: string; email: string; password: string } }>({
          form: { name: '', email: '', password: '' },
        }),
      ([params]) => (
        <div>
          <span>{params.form.name}</span>
        </div>
      ),
      { keys: [{ name: 'form', hide: true, secret: 'secret-key' }] }
    );

    expect(screen.queryByText(expected)).toBeInTheDocument();
  });

  it('should not convert non encrypted params', () => {
    const expected = 'Alice';
    defineWindow({
      form: 'CEcNEwgRD1FHOB8MABdHWA8OCBgaCUFIRxVBAgYcMwIOEwwYAwgKFFFJQQIEB14cCgsXR1lQVEYeX1BPUkce',
    });

    renderHookComponent(
      () =>
        useParams<{ form: { name: string; email: string; password: string } }>({
          form: { name: '', email: '', password: '' },
        }),
      ([params]) => (
        <div>
          <span>{params.form.name}</span>
        </div>
      ),
      { keys: [{ name: 'form' }] }
    );

    expect(screen.queryByText(expected)).not.toBeInTheDocument();
  });
});
