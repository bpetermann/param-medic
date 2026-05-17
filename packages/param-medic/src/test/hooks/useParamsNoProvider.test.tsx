import '@testing-library/jest-dom';
import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { useParams } from '../../lib/hooks/useParams';
import { fireEvent, screen } from '../utils';
import { createFakeNav } from '../utils/fakeNav';
import { renderHookComponentWithoutContext } from '../utils/renderHookComponent';

describe('useParams (no provider)', () => {
  it('should accept all URL params without filtering', () => {
    const nav = createFakeNav('?foo=1&bar=2');

    renderHookComponentWithoutContext(
      () => useParams<{ foo: number; bar: number }>(undefined, nav),
      ([params]) => (
        <>
          <span data-testid='foo'>{params.foo}</span>
          <span data-testid='bar'>{params.bar}</span>
        </>
      ),
    );

    expect(screen.getByTestId('foo')).toHaveTextContent('1');
    expect(screen.getByTestId('bar')).toHaveTextContent('2');
  });

  it('should write all params to the URL when setParams is called', () => {
    const nav = createFakeNav('?count=0');

    renderHookComponentWithoutContext(
      () => useParams<{ count: number }>(undefined, nav),
      ([params, setParams]) => (
        <button
          onClick={() =>
            setParams((prev) => ({ ...prev, count: prev.count + 1 }))
          }
        >
          {params.count}
        </button>
      ),
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('1');
    expect(nav.search).toBe('?count=1');
  });

  it('should reset params to initial state without a provider', () => {
    const nav = createFakeNav('?count=5');

    renderHookComponentWithoutContext(
      () => useParams<{ count: number }>({ count: 0 }, nav),
      ([params, , resetParams]) => (
        <>
          <span>{params.count}</span>
          <button data-testid='reset' onClick={resetParams} />
        </>
      ),
    );

    expect(screen.getByText('5')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('reset'));

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(nav.search).toBe('?count=0');
  });

  it('should update state on navigation events without a provider', () => {
    const nav = createFakeNav('?count=1');

    renderHookComponentWithoutContext(
      () => useParams<{ count: number }>(undefined, nav),
      ([params, setParams]) => (
        <button
          onClick={() =>
            setParams((prev) => ({ ...prev, count: prev.count + 1 }), {
              replace: false,
            })
          }
        >
          {params.count}
        </button>
      ),
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('2');

    act(() => {
      nav.back();
    });

    expect(screen.getByRole('button')).toHaveTextContent('1');
  });
});
