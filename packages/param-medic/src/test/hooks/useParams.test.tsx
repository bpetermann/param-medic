import '@testing-library/jest-dom';
import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { useParams } from '../../lib/hooks/useParams';
import { fireEvent, screen } from '../utils';
import { createFakeNav } from '../utils/fakeNav';
import { renderHookComponent } from '../utils/renderHookComponent';

describe('useParamsHook', () => {
  it('should display the correct param value', () => {
    const nav = createFakeNav('?count=2');

    renderHookComponent(
      () => useParams<{ count: number }>(undefined, nav),
      ([params]) => <div>{params.count}</div>,
      { keys: ['count'] },
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should display the correct initial value', () => {
    const nav = createFakeNav('');

    renderHookComponent(
      () => useParams<{ count: number }>({ count: 2 }, nav),
      ([params]) => <div>{params.count}</div>,
      { keys: ['count'] },
    );

    expect(screen.queryByText('2')).toBeInTheDocument();
  });

  it('should display the correct value from a long url', () => {
    const nav = createFakeNav('?foo=bar&baz=true&count=2');

    renderHookComponent(
      () => useParams<{ count: number }>(undefined, nav),
      ([params]) => <div>{params.count}</div>,
      { keys: ['count'] },
    );

    expect(screen.queryByText('2')).toBeInTheDocument();
  });

  it('should display the correct value after update', () => {
    const nav = createFakeNav('?count=0');

    renderHookComponent(
      () => useParams<{ count: number }>(undefined, nav),
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
      { keys: ['count'] },
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByText('2')).toBeInTheDocument();
  });

  it('should not display the param value if the key is not defined', () => {
    const nav = createFakeNav('');

    renderHookComponent(
      () => useParams<{ count: number }>(undefined, nav),
      ([params]) => <div>{params.count}</div>,
      { keys: [] },
    );

    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('should correctly reset to default values', () => {
    const nav = createFakeNav('');

    renderHookComponent(
      () => useParams<{ count: number }>({ count: 1 }, nav),
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
      { keys: ['count'] },
    );

    const increase = screen.getByTestId('increase');
    const reset = screen.getByTestId('reset');

    fireEvent.click(increase);
    expect(screen.queryByText('2')).toBeInTheDocument();

    fireEvent.click(reset);
    expect(screen.queryByText('1')).toBeInTheDocument();
  });

  it('should update window history correctly', () => {
    const nav = createFakeNav('?count=1');

    renderHookComponent(
      () => useParams<{ count: number }>({ count: 1 }, nav),
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
      { keys: ['count'] },
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.queryByText('2')).toBeInTheDocument();

    act(() => {
      nav.back();
    });

    expect(screen.queryByText('1')).toBeInTheDocument();
  });

  it('should convert encrypted window params', () => {
    const expected = 'Alice';
    const nav = createFakeNav(
      '?form=CEcNEwgRD1FHOB8MABdHWA8OCBgaCUFIRxVBAgYcMwIOEwwYAwgKFFFJQQIEB14cCgsXR1lQVEYeX1BPUkce',
    );

    renderHookComponent(
      () =>
        useParams<{ form: { name: string; email: string; password: string } }>(
          { form: { name: '', email: '', password: '' } },
          nav,
        ),
      ([params]) => (
        <div>
          <span>{params.form.name}</span>
        </div>
      ),
      { keys: [{ name: 'form', hide: true, secret: 'secret-key' }] },
    );

    expect(screen.queryByText(expected)).toBeInTheDocument();
  });

  describe('navigation adapter', () => {
    it('should push to history when replace option is false', () => {
      const nav = createFakeNav('?count=1');

      renderHookComponent(
        () => useParams<{ count: number }>(undefined, nav),
        ([, setParams]) => (
          <button
            onClick={() =>
              setParams((prev) => ({ ...prev, count: prev.count + 1 }), {
                replace: false,
              })
            }
          >
            go
          </button>
        ),
        { keys: ['count'] },
      );

      fireEvent.click(screen.getByRole('button'));

      expect(nav.search).toBe('?count=2');
      act(() => { nav.back(); });
      expect(nav.search).toBe('?count=1');
    });

    it('should replace history when replace option is true', () => {
      const nav = createFakeNav('?count=1');

      renderHookComponent(
        () => useParams<{ count: number }>(undefined, nav),
        ([, setParams]) => (
          <button
            onClick={() =>
              setParams((prev) => ({ ...prev, count: prev.count + 1 }), {
                replace: true,
              })
            }
          >
            go
          </button>
        ),
        { keys: ['count'] },
      );

      fireEvent.click(screen.getByRole('button'));

      expect(nav.search).toBe('?count=2');
      act(() => { nav.back(); });
      // replace: true means no new history entry — back() has nowhere to go
      expect(nav.search).toBe('?count=2');
    });

    it('should write the reset state to history', () => {
      const nav = createFakeNav('');

      renderHookComponent(
        () => useParams<{ count: number }>({ count: 1 }, nav),
        ([, setParams, resetParams]) => (
          <>
            <button
              data-testid='inc'
              onClick={() =>
                setParams((prev) => ({ ...prev, count: prev.count + 1 }))
              }
            />
            <button data-testid='reset' onClick={resetParams} />
          </>
        ),
        { keys: ['count'] },
      );

      fireEvent.click(screen.getByTestId('inc'));
      expect(nav.search).toBe('?count=2');

      fireEvent.click(screen.getByTestId('reset'));
      expect(nav.search).toBe('?count=1');
    });
  });

  it('should not convert non encrypted params', () => {
    const expected = 'Alice';
    const nav = createFakeNav(
      '?form=CEcNEwgRD1FHOB8MABdHWA8OCBgaCUFIRxVBAgYcMwIOEwwYAwgKFFFJQQIEB14cCgsXR1lQVEYeX1BPUkce',
    );

    renderHookComponent(
      () =>
        useParams<{ form: { name: string; email: string; password: string } }>(
          { form: { name: '', email: '', password: '' } },
          nav,
        ),
      ([params]) => (
        <div>
          <span>{params.form.name}</span>
        </div>
      ),
      { keys: [{ name: 'form' }] },
    );

    expect(screen.queryByText(expected)).not.toBeInTheDocument();
  });
});
